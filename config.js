const shouldLog = process.argv.indexOf("log") !== -1;
const shouldQuit = process.argv.indexOf("quit") !== -1;

module.exports.CONFIG = {
	GUESS_THRESHOLD_AMOUNT: 7,
	GUESS_THRESHOLD_AMOUNT_CORRECT: 5,
	GUESS_THRESHOLD_TIMER: 5, //Seconds
	BIG_NUMBER_IGNORE: 100000000,
	MIN_GUESS: 1000,
	CHANNEL_NAME: "homida",
	MONEY_REGEX: /^\d+$/,
	SHORT_REGEX: /(^\d+)([k|l|m|b])$/,
	SHORT_SPLIT_REGEX: /(^\d+)[,.]?(\d+)([k|m|b])$/,
	DATE_REGEX: /\s+|[,\/:]/g,
	DEBUG_LOG: shouldLog,
	RESULT_STRING: "answer:",
	IGNORE: ["nightbot"],
	GUESS_ENDER: ["homida"],
	RESULT_ACCEPTER: ["homida"],
	QUIT_AFTER_RESULT: shouldQuit,
};
