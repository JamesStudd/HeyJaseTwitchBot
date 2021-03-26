const shouldLog = process.argv.indexOf("log") !== -1;

module.exports.CONFIG = {
	GUESS_THRESHOLD_AMOUNT: 7,
	GUESS_THRESHOLD_AMOUNT_CORRECT: 5,
	BIG_NUMBER_IGNORE: 100000000,
	CHANNEL_NAME: "homida",
	MONEY_REGEX: /^\d+$/,
	SHORT_REGEX: /(^\d+)([k|l|m|b])$/,
	SHORT_SPLIT_REGEX: /(^\d+)[,.]?(\d+)([k|m|b])$/,
	DATE_REGEX: /\s+|[,\/:]/g,
	DEBUG_LOG: shouldLog,
	RESULT_STRING: "answer:",
	IGNORE: ["nightbot"],
	GUESS_ENDER: ["hey_jase"],
	RESULT_ACCEPTER: ["homida"],
};
