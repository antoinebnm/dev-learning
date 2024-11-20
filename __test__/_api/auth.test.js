const request = require("supertest");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { createServer } = require("../utils/api.server");
const { mongoSetup, mongoTeardown, mongoServer } = require("../utils/mongoMemory.server");

let app, server;

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
/*
  describe("POST /login", () => {
    beforeEach(async () => {
      // Create a test user
      const user = new User({
        displayName: "TestUser",
        credentials: {
          login: "testUser",
          password: await bcrypt.hash("test123", 10),
        },
        addedAt: new Date(),
        gamesPlayed: [],
      });
      await user.save();
    });

    it("should login an existing user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "testUser", password: "test123" })
        .expect(200);

      expect(response.body.userInfo).toBeDefined();
      expect(response.body.userInfo.displayName).toBe("TestUser");
    });
  });*/
});
