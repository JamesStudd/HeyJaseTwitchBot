const mongoose = require("../database");

let Winner = undefined;
const winnerSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	processedGuess: {
		type: Number,
		required: true,
	},
	rawMessage: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

Winner = mongoose.model("Winner", winnerSchema);

module.exports = Winner;
