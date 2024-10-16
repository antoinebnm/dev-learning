const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: Number, required: true },
    userName: { type: String, required: true, minLength: 2, maxLength: 16 },
    userScore: { type: Number, required: true, min: 0 },
    dateOfEntry: { type: Date, required: true },
    //_ip: { type: String, required: true },
});

// Export model
module.exports = mongoose.model("User", userSchema);
