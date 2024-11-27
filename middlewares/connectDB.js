require("dotenv").config();

var connectDB = () => {
  /**
   * Mongoose Connection Setup
   */
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);

  const DBname = "learning";
  const mongoDB =
    process.env.MONGODB_TOKEN +
    DBname +
    "?retryWrites=true&w=majority&appName=Cluster0";

  main().catch((err) => console.log(err));
  async function main() {
    await mongoose
      .connect(mongoDB)
      .then(() => console.log("Connexion à MongoDB réussie !"))
      .catch(() => {
        console.log("Connexion à MongoDB échouée !");
        throw new Error(mongoose.Error);
      });
  }
};

module.exports = connectDB;
