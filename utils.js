const CONFIG = require("./config").CONFIG;

exports.ConvertToFormat = function ConvertToFormat(number) {
	// Nine Zeroes for Billions
	return Math.abs(Number(number)) >= 1.0e9
		? (Math.abs(Number(number)) / 1.0e9).toFixed(2) + "B"
		: // Six Zeroes for Millions
		Math.abs(Number(number)) >= 1.0e6
		? (Math.abs(Number(number)) / 1.0e6).toFixed(2) + "M"
		: // Three Zeroes for Thousands
		Math.abs(Number(number)) >= 1.0e3
		? Math.abs(Number(number)).toFixed(2) / 1.0e3 + "K"
		: Math.abs(Number(number)).toFixed(2);
};

exports.timeout = function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

exports.ParseUserInputToNumber = function ParseUserInputToNumber(arg) {
	const multiplier = {
		k: 1000,
		l: 1000,
		m: 1000000,
		b: 1000000000,
	};

	let strippedGold = arg.replace(/[.,gp]/g, "").toLowerCase();

	if (CONFIG.MONEY_REGEX.test(strippedGold)) {
		return parseInt(CONFIG.MONEY_REGEX.exec(strippedGold)[0]);
	} else if (CONFIG.SHORT_REGEX.test(arg)) {
		let result = CONFIG.SHORT_REGEX.exec(arg);
		let money = result[1];
		let letter = result[2];
		if (multiplier[letter]) {
			return parseInt(money) * multiplier[letter];
		}
	} else if (CONFIG.SHORT_SPLIT_REGEX.test(arg)) {
		let result = CONFIG.SHORT_SPLIT_REGEX.exec(arg);
		let [_, first, smaller, letter] = result;
		if (multiplier[letter]) {
			let parsed = parseFloat(`${first}.${smaller}`);
			return parsed * multiplier[letter];
		}
	}
};
