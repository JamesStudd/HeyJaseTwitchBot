// Config
const GUESS_CONFIG = require("./config").CONFIG;
const TEST_CASES = require("./testCases").testCases;

// Imports
const tmi = require("tmi.js");
const messageHandler = require("./messagehandler");
const timeout = require("./utils").timeout;

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
		if (process.argv.indexOf("test") !== -1) {
			RunTests();
		}
	})
	.catch((err) => {
		console.log("Failed to connect");
		console.log(err);
	});

client.on("message", messageHandler.HandleMessage);

async function RunTests() {
	for (let i = 0; i < TEST_CASES.length; i++) {
		const { tags, message, delay } = TEST_CASES[i];
		messageHandler.HandleMessage(
			GUESS_CONFIG.CHANNEL_NAME,
			tags,
			message,
			false
		);
		await timeout(delay * 1000);
	}
}
