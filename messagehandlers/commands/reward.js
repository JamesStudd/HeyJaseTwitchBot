const util = require("./../../utils");
const Guess = require("./../../database/model/guessSchema");

module.exports = {
	name: "reward",
	help: "Gets the winner of the casket guess.",
	middleware: util.AdminCommandMiddleware,
	command: function (channel, tags, args, client) {
		[amount] = args;
		const parsed = util.ParseUserInputToNumber(amount);

		const fileName = util.GetMostRecentFileName("guesses");
		util.ProcessResult(fileName, parsed)
			.then((result) => {
				client.say(channel, result.post);

				let winnerGuess = new Guess({
					userId: result.userId,
					processedGuess: result.processedGuess,
					rawMessage: result.rawGuess,
				});

				winnerGuess
					.save()
					.then((_) => {
						console.log("Saved winner to database");
						console.log(winnerGuess);
					})
					.catch((err) => {
						console.log("Failed to save winner to database");
						console.log(err);
					});
			})
			.catch((err) => {
				console.log("Failed to process message", err);
				client.say(channel, "Failed :(");
			});
	},
};
