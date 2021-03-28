const path = require("path");

const args = require("minimist")(process.argv.slice(2), {
	alias: {
		c: "channel",
	},
});

const shouldLog = process.argv.indexOf("log") !== -1;
const shouldQuit = process.argv.indexOf("quit") !== -1;
const isDebug = process.argv.indexOf("test") !== -1;

module.exports.CONFIG = {
	GUESS_THRESHOLD_AMOUNT: 7,
	GUESS_THRESHOLD_AMOUNT_CORRECT: 5,
	GUESS_THRESHOLD_TIMER: 5, //Seconds
	BIG_NUMBER_IGNORE: 100000000,
	MIN_GUESS: 1000,
	CHANNEL_NAME: args.channel ?? "homida",
	MONEY_REGEX: /^\d+$/,
	SHORT_REGEX: /(^\d+)([k|l|m|b])$/,
	SHORT_SPLIT_REGEX: /(^\d+)[,.]?(\d+)([k|m|b])$/,
	DATE_REGEX: /\s+|[,\/:]/g,
	DEBUG_LOG: shouldLog,
	RESULT_STRING: "answer:",
	IGNORE: ["nightbot"],
	GUESS_ENDER: ["homida"],
	RESULT_ACCEPTER: ["homida", "hey_jase"],
	QUIT_AFTER_RESULT: shouldQuit,
	GUESS_PATH: isDebug
		? path.join(__dirname, "guesses", "debug")
		: path.join(__dirname, "guesses"),
	COMMAND_PREFIX: "?",
	ADMINS: ["homida"],
};
