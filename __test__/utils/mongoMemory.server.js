const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;
mongoose.set("debug", true);

var mongoSetup = async () => {
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  console.log("MongoMemoryServer started")
};

var mongoTeardown = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log("MongoMemoryServer stopped");
};

module.exports = { mongoSetup, mongoTeardown, mongoServer };
