const fs = require("fs");
const path = require("path");
const CONFIG = require("./config").CONFIG;
const util = require("./utils");

module.exports = class JaseGuess {
	constructor() {
		this.amount = 0;
		this.guesses = 0;
		this.normalUserGuesses = 0;
		this.subUserGuesses = 0;
		this.modUserGuesses = 0;
		this.mimicGuesses = 0;
		this.seconds = 0;
		this.bloodhoundGuesses = 0;
		this.jaseCaskets = 0;

		this.allStats = [
			this.amount,
			this.guesses,
			this.normalUserGuesses,
			this.subUserGuesses,
			this.modUserGuesses,
			this.mimicGuesses,
			this.seconds,
			this.bloodhoundGuesses,
			this.jaseCaskets,
		];

		this.allGuesses = [];
		this.guessBacklog = [];

		this.specialCases = [
			{
				stat: this.mimicGuesses,
				title: "Mimic",
				input: ["mimic", "Mimic"],
				guessedThisMessage: false,
			},
			{
				stat: this.bloodhoundGuesses,
				title: "Bloodhound",
				input: ["bloodhound", "bh", "dog", "doggo", "dogggo", "pet"],
				guessedThisMessage: false,
			},
			{
				stat: this.jaseCaskets,
				title: "Casket",
				input: ["jaseCasket"],
				guessedThisMessage: false,
			},
		];
		this.cacheId;
	}

	ResetStatistics() {
		this.allStats.forEach((element) => {
			element = 0;
		});
	}

	ResetFully() {
		this.allGuesses = [];
		this.guessBacklog = [];
		this.ResetStatistics();
	}

	ClearBacklog() {
		this.guessBacklog = [];
	}

	AddToBacklog(message, tags) {
		this.guessBacklog.push({ message, time: Date.now() / 1000, tags });
	}

	HasGuesses = () => this.amount !== 0 && this.guesses !== 0;

	GetFirstGuessTime = () => this.guessBacklog[0].time;

	writeToFile() {
		let result = JSON.stringify(
			{
				result: this.allGuesses,
				totalGuesses: this.guesses,
				totalAmount: util.ConvertToFormat(this.amount),
				totalSmallAmount: util.ConvertToFormat(this.smallAmount),
				averageGuess: util.ConvertToFormat(
					Math.round(this.amount / this.guesses)
				),
				averageSmallGuess: util.ConvertToFormat(
					Math.round(this.smallAmount / this.guesses)
				),
				normalUserGuesses: this.normalUserGuesses,
				modUserGuesses: this.modUserGuesses,
				subUserGuesses: this.subUserGuesses,
				seconds: this.seconds,
				bloodhoundGuesses: this.bloodhoundGuesses,
				jaseCaskets: this.jaseCaskets,
			},
			null,
			2
		);
		fs.writeFile("./guesses.json", result, (err) => {
			if (err) {
				console.log("Failed to write to file");
				console.error(err);
			}
			console.log(
				"-------- Finished recording guesses, saved file -----------"
			);
			console.log(result);
		});
		return result;
	}

	IncreaseCount(amountToAdd, tags, rawMessage) {
		this.guesses++;
		this.amount += amountToAdd;
		if (amountToAdd <= CONFIG.BIG_NUMBER_IGNORE) {
			this.smallAmount += amountToAdd;
		}
		console.log(
			`Received a guess from ${tags.username} for ${amountToAdd}. Message: ${rawMessage}`
		);

		this.allGuesses.push({
			user: tags.username,
			amount: amountToAdd,
			raw: rawMessage,
		});

		if (tags["user-type"] === "mod") {
			this.modUserGuesses++;
			return;
		}
		if (tags.subscriber) {
			this.subUserGuesses++;
		} else {
			this.normalUserGuesses++;
		}
	}

	CheckSpecialCases(arg) {}
};
