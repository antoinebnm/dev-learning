const mockSession = (mockSessionData = {}, mockMethods = {}) => {
  jest.mock("express-session", () => {
    return () => (req, res, next) => {
      const defaultMethods = {
        regenerate: jest.fn((callback) => {
          req.session = {
            ...mockSessionData, // Keep session data after reset
            ...defaultMethods, // Reattach mocked methods
            ...mockMethods, // Include custom mocked methods
          };
          callback(null);
        }),
        save: jest.fn((callback) => {
          callback(null); // Simulate successful save
        }),
        destroy: jest.fn((callback) => {
          req.session = null; // Clear session
          callback(null);
        }),
      };

      req.session = {
        ...mockSessionData,
        ...defaultMethods,
        ...mockMethods, // Allow overriding methods if needed
      };

      next();
    };
  });
};

module.exports = mockSession;
