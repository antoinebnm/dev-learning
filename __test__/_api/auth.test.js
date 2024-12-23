const request = require("supertest");
const bcrypt = require("bcrypt");

jest.mock("express-session");

const { createServer } = require("../utils/api.server");
const {
  mongoSetup,
  mongoTeardown,
  mongoServer,
} = require("../utils/mongoMemory.server");

const User = require("../../models/User");

let app, server, sessionManager, testUser;

describe("Authentication", () => {
  beforeAll(async () => {
    await mongoSetup();
    const serverSetup = await createServer(); // Start the server and MongoMemoryServer
    app = serverSetup.app;
    server = serverSetup.server;
    sessionManager = serverSetup.sessionManager;
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
        .set({
          Login: "testUser",
          Password: "test123",
          DisplayName: "TestUser",
        })
        .expect(201);

      expect(response.body.userInfo).toBeDefined();
      expect(response.body.message).toBe("User registered successfully");
      const userInDb = await User.findOne({ "credentials.login": "testUser" });
      expect(userInDb).toBeDefined();
    });
  });

  describe("POST /login", () => {
    beforeEach(async () => {
      // Create a test user for auth tests
      testUser = new User({
        displayName: "TestUser",
        credentials: {
          login: "testUser",
          password: await bcrypt.hash("test123", 10),
        },
        addedAt: new Date(),
        gamesPlayed: [],
      });
      // save in DB the testUser before each use
      testUser.save();
    });

    afterEach(async () => {
      // Clean DB after each use
      await User.deleteMany({});
      sessionManager.setMockSessionData({});
    });

    it("should login an existing user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .set({ Login: "testUser", Password: "test123" })
        .expect(200);

      expect(response.body.userInfo).toBeDefined();
      expect(response.body.userInfo.displayName).toBe("TestUser");
    });

    it("should throw an error when user already logged in", async () => {
      // Pre query to get valid oauth token
      const preQuery = await request(app)
        .post("/api/auth/login")
        .set({ Login: "testUser", Password: "test123" })
        .expect(200);

      const validToken = preQuery.body.userInfo.OAuthToken;

      // Mock valid token in request session
      sessionManager.setMockSessionData({ user: { OAuthToken: validToken } });

      // Attempt to log in again, using session cookie and token
      const response = await request(app)
        .post("/api/auth/login")
        .set({ Cookie: "sid=somesessioncookie" })
        .expect(500);

      expect(response.body.error).toBe("User already logged in!");
    });

    it("should fail when using wrong username", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .set({ Login: "failUser", Password: "test123" })
        .expect(401);

      expect(response.body).toEqual({
        error: "Authentication failed, invalid credentials.",
      });
    });

    it("should fail when using wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .set({ Login: "testUser", Password: "wrongPassword" })
        .expect(401);

      expect(response.body).toEqual({
        error: "Authentication failed, invalid credentials.",
      });
    });
  });

  /*describe('POST /logout', () => {
    it("should throw an error when user already logged in", async () => {
      // Pre query to get valid oauth token
      const preQuery = await request(app)
        .post("/api/auth/login")
        .set({ Login: "testUser", Password: "test123" })
        .expect(200);

      const validToken = preQuery.body.userInfo.OAuthToken;

      // Mock valid token in request session
      sessionManager.setMockSessionData({ user: { OAuthToken: validToken } });

      // Attempt to log in again, using session cookie and token
      const response = await request(app)
        .post("/api/auth/login")
        .set({ Cookie: "sid=somesessioncookie" })
        .expect(500);

      expect(response.body.error).toBe("User already logged in!");
    });
  });*/

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
