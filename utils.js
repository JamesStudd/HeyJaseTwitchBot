const CONFIG = require("./config").CONFIG;

const fs = require("fs");
const path = require("path");
const _ = require("underscore");

function ConvertToFormat(number) {
	if (isNaN(number) || number <= 0) return 0;
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
}

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function ParseUserInputToNumber(arg) {
	const multiplier = {
		k: 1000,
		l: 1000,
		m: 1000000,
		b: 1000000000,
	};

	if (typeof arg === "number") return arg;
	if (typeof arg !== "string" || arg === "") return 0;

	arg = arg.toLowerCase();

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
	return 0;
}

function GetSafeDateFormat(date) {
	if (!(date instanceof Date)) return "Invalid-Date";
	return date.toLocaleString().replace(CONFIG.DATE_REGEX, "-");
}

// Return only base file name without dir
function GetMostRecentFileName(dir) {
	var files = fs.readdirSync(dir);

	// use underscore for max()
	return _.max(files, function (f) {
		var fullpath = path.join(dir, f);

		// ctime = creation time is used
		// replace with mtime for modification time
		return fs.statSync(fullpath).ctime;
	});
}

function ProcessResult(filename, amount) {
	return new Promise((resolve, reject) => {
		fs.readFile(
			path.join(__dirname, "guesses", filename),
			"utf8",
			(err, data) => {
				if (err) {
					console.log("Failed to read file");
					reject(err);
					return;
				}

				let message = PrintResult(JSON.parse(data), amount);
				resolve(message);
			}
		);
	});
}

function DebugLog(message) {
	if (CONFIG.DEBUG_LOG) console.log(message);
}

module.exports = {
	ConvertToFormat,
	timeout,
	ParseUserInputToNumber,
	GetSafeDateFormat,
	GetMostRecentFileName,
	ProcessResult,
	DebugLog,
};

function GuessToString(
	stat,
	keyword,
	fluffNobody = "",
	fluffOne = "",
	fluffMany = ""
) {
	return stat === 0
		? `Nobody said ${keyword}${fluffNobody}`
		: stat > 1
		? `${stat} people said ${keyword}${fluffMany}`
		: `1 person said ${keyword}${fluffOne}`;
}

function TypeOfUserToString(typeOfUser, count) {
	return count > 1 || count === 0
		? `${count} ${typeOfUser}s`
		: `${count} ${typeOfUser}`;
}

function PrintResult(data, actualAmount) {
	const {
		result,
		totalGuesses,
		totalAmount,
		totalSmallAmount,
		averageGuess,
		averageSmallGuess,
		mimics,
		seconds,
		bloodhoundGuesses,
		jaseCaskets,
		normalUserGuesses,
		modUserGuesses,
		subUserGuesses,
	} = data;

	let winner = "";
	let bestDiff = Number.MAX_VALUE;
	let rawGuess;

	for (const guess of result) {
		let diff = Math.abs(guess.amount - actualAmount);
		if (diff < bestDiff) {
			bestDiff = diff;
			winner = guess.user;
			rawGuess = guess.raw;
		}
	}

	let mimicGuessString = GuessToString(mimics, "mimic");
	let bhGuessString = GuessToString(bloodhoundGuesses, "bloodhound");
	let jaseCasketString = GuessToString(
		jaseCaskets,
		"jaseCasket",
		" jaseGrumpy",
		" jaseWow",
		""
	);

	let modString = TypeOfUserToString("mod", modUserGuesses);
	let subString = TypeOfUserToString("sub", subUserGuesses);
	let nonSubString = TypeOfUserToString("non-sub", normalUserGuesses);

	let secondsRounded = Math.ceil(seconds);

	let post =
		`Guesses over! The winner is ${winner} with a guess of "${rawGuess}". ` +
		`In ${secondsRounded} seconds there were ${totalGuesses} total guesses, adding up to ${totalAmount}. ` +
		`Average guess was ${averageGuess}. Ignoring guesses over 100m, they added up to ${totalSmallAmount} with an average of ${averageSmallGuess}. ` +
		`${modString}, ${subString} and ${nonSubString} guessed. ` +
		`${mimicGuessString}. ${bhGuessString}. ${jaseCasketString}.`;

	DebugLog(post);
	return post;
}
