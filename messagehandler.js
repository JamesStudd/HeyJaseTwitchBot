// Config
const GUESS_CONFIG = require("./config").CONFIG;

// Imports
const JaseGuess = require("./jaseGuess");
const util = require("./utils");

let jaseGuess = new JaseGuess();

const IGNORE = ["nightbot"];

let timer;
let messageThresholdTimer;
let canProcessGuesses = false;

function ShouldIgnoreMessage(tags) {
	return IGNORE.indexOf(tags.username) !== -1;
}

function ShouldStopGuesses(tags, message) {
	return (
		(tags.username === "homida" && message === ":)") ||
		(tags.username === "hey_jase" && message.indexOf("http") === -1)
	);
}

function ShouldProcessBacklog() {
	return (
		jaseGuess.guessBacklog.length >= GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT &&
		jaseGuess.guessBacklog.filter(
			(guess) =>
				ProcessMessage(guess.tags, guess.message).messageContainedGuess
		).length >= GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT_CORRECT
	);
}

function ProcessMessage(tags, rawMessage) {
	let args = rawMessage.split(" ");
	let messageContainedGuess = false;
	let guessAmount = 0;

	for (const arg of args) {
		jaseGuess.CheckSpecialCases(arg);

		if (arg === "mimic") {
			console.log(`Received a mimic guess from ${tags.username}`);
			mimicGuesses++;
		} else if (
			arg === "bloodhound" ||
			arg === "bh" ||
			arg === "dog" ||
			arg === "doggo" ||
			arg === "dogggo" ||
			arg === "pet"
		) {
			bloodhoundGuesses++;
		} else if (arg === "jaseCasket") {
			jaseCaskets++;
		}

		let res = util.ParseUserInputToNumber(arg);
		if (res && res >= 1000) {
			guessAmount += res;
			messageContainedGuess = true;
		}
	}
	return { messageContainedGuess, guessAmount };
}

exports.HandleMessage = function HandleMessage(channel, tags, message, self) {
	console.log(message, tags);
	if (ShouldIgnoreMessage(tags)) return;
	if (ShouldStopGuesses(tags, message)) {
		if (jaseGuess.HasGuesses()) {
			clearTimeout(timer);
			jaseGuess.writeToFile();
			jaseGuess.ResetFully();
		}
	}
	if (canProcessGuesses) {
		for (const guess of jaseGuess.guessBacklog) {
			let processed = ProcessMessage(guess.tags, guess.message);
			if (processed.messageContainedGuess) {
				jaseGuess.IncreaseCount(
					processed.guessAmount,
					guess.tags,
					guess.message
				);
			}
		}
		jaseGuess.ClearBacklog();
		let processed = ProcessMessage(tags, message);
		if (processed.messageContainedGuess) {
			jaseGuess.IncreaseCount(processed.guessAmount, tags, message);
		}
	} else {
		jaseGuess.AddToBacklog(message, tags);
		if (!messageThresholdTimer) {
			messageThresholdTimer = setTimeout(() => {
				if (ShouldProcessBacklog()) {
					canProcessGuesses = true;
					console.log(
						`Received ${GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT} or more guesses in 5 seconds, probably a clue...`
					);
					seconds = Math.ceil(
						Date.now() / 1000 - jaseGuess.GetFirstGuessTime()
					);
					setInterval(() => seconds++, 1000);
				} else {
					guessBacklog = [];
				}
				messageThresholdTimer = undefined;
			}, 5000);
		}
	}
};
