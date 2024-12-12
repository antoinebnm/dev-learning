let mockedSessionData = {};

module.exports = () => ({
  setMockSessionData: (newMockedSessionData) => {
    mockedSessionData = newMockedSessionData;
  },
  create: () => (req, res, next) => {
    req.session = Object.assign(
      {
        save: jest.fn((callback) => callback(null)),
        destroy: jest.fn((callback) => {
          mockedSessionData = {};
          callback(null);
        }),
        regenerate: jest.fn((callback) => callback(null)),
      },
      mockedSessionData
    );
    next();
  },
});
