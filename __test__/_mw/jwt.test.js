const jwt = require("jsonwebtoken");
const jwtSignCheck = require("../../middlewares/jwtsigncheck");
require("dotenv").config();

describe("JWT Verification", () => {
  let payload = {
    user: "test",
    id: 0,
  };
  let OAuthToken;

  beforeAll(() => {
    OAuthToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
  });

  afterAll(() => {
    OAuthToken = null;
  });

  it("verify jwt signature", () => {
    expect(jwtSignCheck(OAuthToken, null)).toBeTruthy();
  });
});
