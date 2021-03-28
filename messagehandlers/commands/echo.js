module.exports = {
	name: "echo",
	help: "Replies with any words you type after the command",
	command: function (channel, tags, args, client) {
		client.say(channel, `@${tags.username}, you said: "${args.join(" ")}"`);
	},
};
