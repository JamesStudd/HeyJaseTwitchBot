const fs = require("fs");
const path = require("path");
const CONFIG = require("./config").CONFIG;
const util = require("./utils");

module.exports = class JaseGuess {
	constructor() {
		this.amount = 0;
		this.guesses = 0;
		this.smallAmount = 0;
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

		this.specialCases = [
			{
				title: "Mimic",
				input: ["mimic"],
				guessedThisMessage: false,
			},
			{
				title: "Bloodhound",
				input: ["bloodhound", "bh", "dog", "doggo", "dogggo", "pet"],
				guessedThisMessage: false,
			},
			{
				title: "Casket",
				input: ["jasecasket"],
				guessedThisMessage: false,
			},
		];
		this.cacheId;
	}

	HasGuesses = () => this.amount !== 0 && this.guesses !== 0;

	WriteToFile() {
		const todayDate = new Date();
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
				mimics: this.mimicGuesses,
				date: todayDate,
			},
			null,
			2
		);

		const fileName = `guesses-${util.GetSafeDateFormat(todayDate)}.json`;

		fs.writeFile(path.join(CONFIG.GUESS_PATH, fileName), result, (err) => {
			if (err) {
				console.log("Failed to write to file");
				console.error(err);
			}
			console.log(
				`-------- Finished recording guesses (${todayDate.toString()}), saved file -----------`
			);
			util.DebugLog(result);
			if (CONFIG.QUIT_AFTER_RESULT) {
				process.exit();
			}
		});
		return result;
	}

	IncreaseCount(amountToAdd, tags, rawMessage) {
		this.guesses++;
		this.amount += amountToAdd;
		if (amountToAdd <= CONFIG.BIG_NUMBER_IGNORE) {
			this.smallAmount += amountToAdd;
		}

		util.DebugLog(
			`Received a guess from ${tags.username} for ${amountToAdd}. Message: ${rawMessage}`
		);

		this.allGuesses.push({
			user: tags.username,
			amount: amountToAdd,
			raw: rawMessage,
			userId: tags["user-id"],
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

	CheckSpecialCases(arg, messageId) {
		if (messageId !== this.cacheId) {
			this.specialCases.forEach((sCase) => {
				sCase.guessedThisMessage = false;
			});
		}

		for (const specialCase of this.specialCases) {
			if (specialCase.guessedThisMessage) continue;
			for (const word of specialCase.input) {
				if (arg === word) {
					specialCase.guessedThisMessage = true;

					if (specialCase.title === "Mimic") {
						this.mimicGuesses++;
					} else if (specialCase.title === "Bloodhound") {
						this.bloodhoundGuesses++;
					} else if (specialCase.title === "Casket") {
						this.jaseCaskets++;
					}

					break;
				}
			}
		}
	}
};
