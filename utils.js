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
