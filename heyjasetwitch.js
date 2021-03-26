// Config
const GUESS_CONFIG = require("./config");

// Imports
const fs = require("fs");
const path = require("path");

const moneyRegex = /^\d+$/;
const shortRegex = /(^\d+)([k|l|m|b])$/;
const shortSplitRegex = /(^\d+)[,.]?(\d+)([k|m|b])$/;

let amount = 0;
let smallAmount = 0;
let guesses = 0;
let infoGuesses = {
	normal: 0,
	sub: 0,
	mod: 0,
};
let mimicGuesses = 0;
let seconds = 0;
let bloodhoundGuesses = 0;
let jaseCaskets = 0;

let timer;
let messageThresholdTimer;

let allGuesses = [];
let guessBacklog = [];
let canProcessGuesses = false;

client.on("message", (channel, tags, message, self) => {
	if (tags.username === "nightbot") return;

	if (
		(tags.username === "homida" && message === ":)") ||
		(tags.username === "hey_jase" && message.indexOf("http") === -1)
	) {
		if (amount !== 0 && guesses !== 0) {
			clearTimeout(timer);
			let result = JSON.stringify({
				result: allGuesses,
				totalGuesses: guesses,
				totalAmount: ConvertToFormat(amount),
				totalSmallAmount: ConvertToFormat(smallAmount),
				averageGuess: ConvertToFormat(Math.round(amount / guesses)),
				averageSmallGuess: ConvertToFormat(
					Math.round(smallAmount / guesses)
				),
				infoGuesses,
				mimicGuesses,
				seconds,
				bloodhoundGuesses,
				jaseCaskets,
			});

			fs.writeFile("./guesses.json", result, (err) => {
				if (err) {
					console.log("Failed to write to file");
					console.error(err);
				}
			});

			ResetCount();
			console.log(
				"-------- Finished recording guesses, saved file -----------"
			);
		}
	}

	if (canProcessGuesses) {
		for (const guess of guessBacklog) {
			let processed = ProcessMessage(guess.tags, guess.message);
			if (processed.messageContainedGuess) {
				IncreaseCount(processed.guessAmount, guess.tags, guess.message);
			}
		}
		guessBacklog = [];
		let processed = ProcessMessage(tags, message);
		if (processed.messageContainedGuess) {
			IncreaseCount(processed.guessAmount, tags, message);
		}
	} else {
		guessBacklog.push({ message, time: Date.now() / 1000, tags });

		if (!messageThresholdTimer) {
			messageThresholdTimer = setTimeout(() => {
				if (
					guessBacklog.length >=
						GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT &&
					guessBacklog.filter(
						(guess) =>
							ProcessMessage(guess.tags, guess.message)
								.messageContainedGuess
					).length >= GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT_CORRECT
				) {
					canProcessGuesses = true;
					console.log(
						`Received ${GUESS_CONFIG.GUESS_THRESHOLD_AMOUNT} or more guesses in 5 seconds, probably a clue...`
					);
					seconds = Math.ceil(
						Date.now() / 1000 - guessBacklog[0].time
					);
					setInterval(() => seconds++, 1000);
				} else {
					guessBacklog = [];
				}
				messageThresholdTimer = undefined;
			}, 5000);
		}
	}
});

function ResetCount() {
	amount = 0;
	guesses = 0;
	infoGuesses.normal = infoGuesses.sub = infoGuesses.mod = 0;
	mimicGuesses = 0;
	allGuesses = [];
	seconds = 0;
	lastGuess = 0;
	guessBacklog = [];
	canProcessGuesses = false;
	bloodhoundGuesses = 0;
	messageThresholdTimer = undefined;
	smallAmount = 0;
	jaseCaskets = 0;
}

function ProcessMessage(tags, rawMessage) {
	let args = rawMessage.split(" ");
	let messageContainedGuess = false;
	let guessAmount = 0;
	for (const arg of args) {
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

		let res = ParseUserInputToNumber(arg);
		if (res && res >= 1000) {
			guessAmount += res;
			messageContainedGuess = true;
		}
	}
	return { messageContainedGuess, guessAmount };
}

function ParseUserInputToNumber(arg) {
	const multiplier = {
		k: 1000,
		l: 1000,
		m: 1000000,
		b: 1000000000,
	};

	let strippedGold = arg.replace(/[.,gp]/g, "").toLowerCase();

	if (moneyRegex.test(strippedGold)) {
		return parseInt(moneyRegex.exec(strippedGold)[0]);
	} else if (shortRegex.test(arg)) {
		let result = shortRegex.exec(arg);
		let money = result[1];
		let letter = result[2];
		if (multiplier[letter]) {
			return parseInt(money) * multiplier[letter];
		}
	} else if (shortSplitRegex.test(arg)) {
		let result = shortSplitRegex.exec(arg);
		let [_, first, smaller, letter] = result;
		if (multiplier[letter]) {
			let parsed = parseFloat(`${first}.${smaller}`);
			return parsed * multiplier[letter];
		}
	}
}

function IncreaseCount(amountToAdd, tags, rawMessage) {
	guesses++;
	amount += amountToAdd;
	if (amountToAdd <= GUESS_CONFIG.BIG_NUMBER_IGNORE) {
		smallAmount += amountToAdd;
	}
	console.log(
		`Received a guess from ${tags.username} for ${amountToAdd}. Message: ${rawMessage}`
	);

	allGuesses.push({
		user: tags.username,
		amount: amountToAdd,
		raw: rawMessage,
	});

	if (tags["user-type"] === "mod") {
		infoGuesses.mod++;
		return;
	}
	if (tags.subscriber) {
		infoGuesses.sub++;
	} else {
		infoGuesses.normal++;
	}
}

function ConvertToFormat(number) {
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

// WEB

const express = require("express");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.post("/amount", (req, res) => {
	if (req.body.amount) {
	}
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/reset", (req, res) => {
	ResetCount();
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
