const util = require("../../utils");

module.exports = {
	name: "stats",
	help: "Gets the winner of the casket guess.",
	middleware: util.AdminCommandMiddleware,
	command: function (channel, tags, args, client) {
		const fileName = util.GetMostRecentFileName("guesses");
		util.ProcessResult(fileName)
			.then((result) => {
				client.say(channel, result.post);
			})
			.catch((err) => {
				console.log("Failed to process message", err);
				client.say(channel, "Failed :(");
			});
	},
};
