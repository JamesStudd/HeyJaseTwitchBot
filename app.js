// Config
require("dotenv").config();
const GUESS_CONFIG = require("./config").CONFIG;

// Imports
const tmi = require("tmi.js");
const messageHandler = require("./messagehandler");

const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true,
	},
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_OATH,
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

client.on("message", (channel, tags, message, self) =>
	messageHandler.HandleMessage(channel, tags, message, self, client)
);
