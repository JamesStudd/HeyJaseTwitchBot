// Config
const GUESS_CONFIG = require("./config").CONFIG;

// Imports
const JaseGuess = require("./jaseGuess");
const util = require("./utils");

let jaseGuess = new JaseGuess();

let timer;
let messageThresholdTimer;
let canProcessGuesses = false;
let seconds;

function ShouldIgnoreMessage(tags) {
	return GUESS_CONFIG.IGNORE.indexOf(tags.username) !== -1;
}

function ShouldStopGuesses(tags, message) {
	return (
		message.indexOf("http") === -1 &&
		GUESS_CONFIG.GUESS_ENDER.indexOf(tags.username) !== -1
	);
}

function ShouldProcessBacklog() {
	return (
		jaseGuess.guessBacklog.length >= GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT &&
		jaseGuess.guessBacklog.filter(
			(guess) =>
				ProcessMessage(guess.tags, guess.message, false)
					.messageContainedGuess
		).length >= GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT_CORRECT
	);
}

function ShouldAcceptMessageAsAnswer(tags, message) {
	if (
		GUESS_CONFIG.RESULT_ACCEPTER.indexOf(tags.username) !== -1 &&
		message.indexOf(GUESS_CONFIG.RESULT_STRING) !== -1
	) {
		const processed = ProcessMessage(tags, message, false);
		if (processed.messageContainedGuess) {
			return processed.guessAmount;
		}
	}
}

function ProcessMessage(tags, rawMessage, checkSpecialCases = true) {
	let args = rawMessage.split(" ");
	let messageContainedGuess = false;
	let guessAmount = 0;

	for (const arg of args) {
		if (checkSpecialCases) {
			jaseGuess.CheckSpecialCases(arg, tags.id);
		}

		let res = util.ParseUserInputToNumber(arg);
		if (!messageContainedGuess && res && res >= GUESS_CONFIG.MIN_GUESS) {
			guessAmount += res;
			messageContainedGuess = true;
		}
	}
	return { messageContainedGuess, guessAmount };
}

exports.HandleMessage = function HandleMessage(channel, tags, message, self) {
	if (ShouldIgnoreMessage(tags)) return;
	if (!canProcessGuesses) {
		const result = ShouldAcceptMessageAsAnswer(tags, message);
		if (result) {
			const fileName = util.GetMostRecentFileName("guesses");
			util.ProcessResult(fileName, result);
		}
	}
	if (ShouldStopGuesses(tags, message)) {
		util.DebugLog(
			`Stopping guesses due to getting the message "${message}" from ${tags.username}`
		);
		if (jaseGuess.HasGuesses()) {
			canProcessGuesses = false;
			clearTimeout(timer);
			jaseGuess.seconds = seconds;
			jaseGuess.WriteToFile(message);
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
						`Received ${GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT} or more guesses in ${GUESS_CONFIG.GUESS_THRESHOLD_TIMER} seconds, probably a clue...`
					);
					seconds = Math.ceil(
						Date.now() / 1000 - jaseGuess.GetFirstGuessTime()
					);
					setInterval(() => seconds++, 1000);
				} else {
					jaseGuess.ClearBacklog();
				}
				messageThresholdTimer = undefined;
			}, GUESS_CONFIG.GUESS_THRESHOLD_TIMER * 1000);
		}
	}
};
