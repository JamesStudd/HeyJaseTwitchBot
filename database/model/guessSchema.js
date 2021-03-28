const mongoose = require("./../database");

let Guess = undefined;
const guessSchema = new mongoose.Schema({
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

Guess = mongoose.model("Guess", guessSchema);

module.exports = Guess;
