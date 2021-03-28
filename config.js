const path = require("path");

const args = require("minimist")(process.argv.slice(2), {
	alias: {
		c: "channel",
	},
});

const shouldLog = process.argv.includes("log");
const shouldQuit = process.argv.includes("quit");
const isDebug = process.argv.includes("test");

module.exports.CONFIG = {
	BIG_NUMBER_IGNORE: 100000000,
	MIN_GUESS: 1000,
	CHANNEL_NAME: args.channel ?? "homida",
	MONEY_REGEX: /^\d+$/,
	SHORT_REGEX: /(^\d+)([k|l|m|b])$/,
	SHORT_SPLIT_REGEX: /(^\d+)[,.]?(\d+)([k|m|b])$/,
	DATE_REGEX: /\s+|[,\/:]/g,
	DEBUG_LOG: shouldLog,
	IGNORE: ["nightbot"],
	RESULT_ACCEPTER: ["homida", "hey_jase"],
	QUIT_AFTER_RESULT: shouldQuit,
	GUESS_PATH: isDebug
		? path.join(__dirname, "guesses", "debug")
		: path.join(__dirname, "guesses"),
	DEBUG: isDebug,
	COMMAND_PREFIX: "?",
	ADMINS: ["homida"],
};
