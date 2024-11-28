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
  });

  afterAll(async () => {
    await User.deleteMany({});
    await server.close();
    await mongoTeardown();
  });

  describe("POST /register", () => {
    afterEach(async () => {
      // Clean DB after each use
      await User.deleteMany({});
    });

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
    beforeEach(async () => {
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
      testUser.save();
    });

    afterEach(async () => {
      // Clean DB after each use
      await User.deleteMany({});
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

  describe("POST /preload", () => {
    beforeEach(async () => {
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
      testUser.save();
    });

    afterEach(async () => {
      // Clean DB after each use
      await User.deleteMany({});
    });

    it("should not pass requireAuth middleware without session cookies", async () => {
      await request(app).post("/api/auth/preload").expect(401);
    });
  });
});
