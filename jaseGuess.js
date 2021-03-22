module.exports = class JaseGuess {
	constructor() {
		let allStats = [];
		let amount = 0;
		let guesses = 0;
		let normalUserGuesses = 0;
		let subUserGuesses = 0;
		let modUserGuesses = 0;
		let mimicGuesses = 0;
		let seconds = 0;
		let bloodhoundGuesses = 0;
		let jaseCaskets = 0;

		allStats = [
			amount,
			guesses,
			normalUserGuesses,
			subUserGuesses,
			modUserGuesses,
			mimicGuesses,
			seconds,
			bloodhoundGuesses,
			jaseCaskets,
		];

		let allGuesses = [];
		let guessBacklog = [];
	}

	resetStatistics() {
		allStats.forEach((element) => {
			element = 0;
		});
	}

	resetFully() {
		this.allGuesses = [];
		this.guessBacklog = [];
		this.resetStatistics();
	}

	shouldStopGuesses = () => this.amount !== 0 && this.guesses !== 0;

	writeToFile() {
		// let result = JSON.stringify({
		//     result: allGuesses,
		//     totalGuesses: guesses,
		//     totalAmount: ConvertToFormat(amount),
		//     totalSmallAmount: ConvertToFormat(smallAmount),
		//     averageGuess: ConvertToFormat(Math.round(amount / guesses)),
		//     averageSmallGuess: ConvertToFormat(
		//         Math.round(smallAmount / guesses)
		//     ),
		//     infoGuesses,
		//     mimicGuesses,
		//     seconds,
		//     bloodhoundGuesses,
		//     jaseCaskets,
		// });
		// fs.writeFile("./guesses.json", result, (err) => {
		//     if (err) {
		//         console.log("Failed to write to file");
		//         console.error(err);
		//     }
		// });
	}
};
