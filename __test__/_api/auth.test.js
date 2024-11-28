const request = require("supertest");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { createServer } = require("../utils/api.server");
const {
  mongoSetup,
  mongoTeardown,
  mongoServer,
} = require("../utils/mongoMemory.server");

let app, server, testUser;

describe("Authentication", () => {
  beforeAll(async () => {
    await mongoSetup();
    const serverSetup = await createServer(); // Start the server and MongoMemoryServer
    app = serverSetup.app;
    server = serverSetup.server;

    // Create a test user
    testUser = new User({
      displayName: "TestUser",
      credentials: {
        login: "testUser",
        password: await bcrypt.hash("test123", 10),
      },
      addedAt: new Date(),
      gamesPlayed: [],
    });
  });

  afterAll(async () => {
    await server.close();
    await mongoTeardown();
  });

  afterEach(async () => {
    // Clean DB after each use
    await User.deleteMany({});
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ username: "testUser", password: "test123" })
        .expect(201);

      expect(response.body.message).toBe("User registered successfully");
      const userInDb = await User.findOne({ "credentials.login": "testUser" });
      expect(userInDb).toBeDefined();
    });
  });

  describe("POST /login", () => {
    beforeAll(async () => {
      await testUser.save();
    });

    it("should login an existing user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "testUser", password: "test123" })
        .expect(200);

      expect(response.body.userInfo).toBeDefined();
      expect(response.body.userInfo.displayName).toBe("TestUser");
    });
    /*
    it("should throw an error when user already logged in", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .set({ Cookie: 'sid=something' })
        .send({  })
        .expect(500);

      expect(response.body).toBeDefined();
      expect(response.body).toBe("User already logged in!");
    });*/

    describe("logging when passing incorrect values", () => {
      it("should fail when using wrong username", async () => {
        const response = await request(app)
          .post("/api/auth/login")
          .send({ username: "failUser", password: "test123" })
          .expect(401);

        expect(response.body).toEqual({
          error: "Authentication failed, invalid username.",
        });
      });

      it("should fail when using wrong password", async () => {
        const response = await request(app)
          .post("/api/auth/login")
          .send({ username: "testUser", password: "wrongPassword" })
          .expect(401);

        expect(response.body).toEqual({
          error: "Authentication failed, invalid password.",
        });
      });
    });
  });

  describe("POST /preload", () => {
    it("should not pass requireAuth middleware without session cookies", async () => {
      await request(app).post("/api/auth/preload").expect(401);
    });
  });
});
