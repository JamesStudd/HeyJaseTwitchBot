const mongoose = require("./../database");

let Result = undefined;
const resultSchema = new mongoose.Schema({
	totalGuesses: {
		type: Number,
	},
	totalAmount: {
		type: Number,
	},
	totalSmallAmount: {
		type: Number,
	},
	averageGuess: {
		type: Number,
	},
	averageSmallGuess: {
		type: Number,
	},
	normalUserGuesses: {
		type: Number,
	},
	modUserGuesses: {
		type: Number,
	},
	subUserGuesses: {
		type: Number,
	},
	seconds: {
		type: Number,
	},
	bloodhoundGuesses: {
		type: Number,
	},
	jaseCaskets: {
		type: Number,
	},
	mimics: {
		type: Number,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

Result = mongoose.model("Result", resultSchema);

module.exports = Result;
