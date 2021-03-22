// Config
const GUESS_CONFIG = require("./config.json");

// Imports
const tmi = require("tmi.js");
const messageHandler = require("./messagehandler");

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true,
	},
	channels: [GUESS_CONFIG.CHANNEL_NAME],
});

client
	.connect()
	.then(() => {
		console.log(`Connected to channel ${GUESS_CONFIG.CHANNEL_NAME}`);
	})
	.catch((err) => {
		console.log("Failed to connect");
		console.log(err);
	});

client.on("message", messageHandler.HandleMessage);
