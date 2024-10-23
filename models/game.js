const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: { type: String, required: true},
    type: { type: String, required: true, enum: ['infinite','chrono','words'] },
    score: { type: Number, required: true },
    playedAt: { type: Date, required: true },
    won: { type: Boolean },
    playTime: { type: Number },
}, { versionKey: false });

// Export model
module.exports = mongoose.model("Game", gameSchema);