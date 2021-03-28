const util = require("./../../utils");
const config = require("./../../config").CONFIG;

module.exports = {
	name: "reward",
	help: "Gets the winner of the casket guess.",
	middleware: function (tags) {
		return config.ADMINS.indexOf(tags.username) !== -1;
	},
	command: function (channel, tags, args, client) {
		[amount] = args;
		const parsed = util.ParseUserInputToNumber(amount);

		const fileName = util.GetMostRecentFileName("guesses");
		util.ProcessResult(fileName, parsed)
			.then((message) => {
				client.say(channel, message);
			})
			.catch((err) => {
				console.log("Failed to process message", err);
				client.say(channel, "Failed :(");
			});
	},
};
