const util = require("./../../utils");

module.exports = {
	name: "findwinner",
	help: "Gets the winner of the casket guess.",
	middleware: util.AdminCommandMiddleware,
	command: function (channel, tags, args, client) {
		[amount] = args;
		const parsed = util.ParseUserInputToNumber(amount);

		const fileName = util.GetMostRecentFileName("guesses");
		util.ProcessResult(fileName, parsed)
			.then((result) => {
				client.say(channel, result.winnerString);
				util.SaveWinner(result);
			})
			.catch((err) => {
				console.log("Failed to process message", err);
				client.say(channel, "Failed :(");
			});
	},
};
