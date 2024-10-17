const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true, minLength: 2, maxLength: 16 },
    userScore: { type: Number, required: true, min: 0 },
    dateOfEntry: { type: Date, required: true },
    //_ip: { type: String, required: true },
}, { versionKey: false });

// Export model
module.exports = mongoose.model("User", userSchema);