beforeAll(() => console.log("1 - beforeAll"));
afterAll(() => console.log("1 - afterAll"));
afterEach(() => console.log("1 - afterEach"));

test("", () => console.log("1 - test"));

describe("Scoped / Nested block", () => {
  beforeEach(() => console.log("2 - beforeEach"));

  test("", () => console.log("2 - test"));

  describe("Scoped / Nested Nested block", () => {
    test("", () => console.log("3 - test"));
    test("", () => console.log("3bis - test"));
  });
});
