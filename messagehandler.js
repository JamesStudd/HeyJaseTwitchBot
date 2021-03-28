// Config
const GUESS_CONFIG = require("./config").CONFIG;

// Imports
const JaseGuess = require("./jaseGuess");
const util = require("./utils");

let jaseGuess = new JaseGuess();

let timer;
let canProcessGuesses = false;
let seconds = 0;

const messageHandlers = util.GetAllCommands();

messageHandlers["stop"] = {
	execute: StopGuesses,
	middleware: util.AdminCommandMiddleware,
	name: "stop",
};

messageHandlers["start"] = {
	name: "start",
	execute: BeginGuesses,
	middleware: util.AdminCommandMiddleware,
};

function BeginGuesses() {
	canProcessGuesses = true;
	timer = setInterval(() => seconds++, 1000);
}

function ShouldIgnoreMessage(tags) {
	return GUESS_CONFIG.IGNORE.includes(tags.username);
}

function ProcessMessage(tags, rawMessage, checkSpecialCases = true) {
	let args = rawMessage.split(" ");
	let messageContainedGuess = false;
	let guessAmount = 0;

	for (let arg of args) {
		arg = arg.toLowerCase();
		if (checkSpecialCases) {
			jaseGuess.CheckSpecialCases(arg, tags.id);
		}

		let res = util.ParseUserInputToNumber(arg);
		if (!messageContainedGuess && res && res >= GUESS_CONFIG.MIN_GUESS) {
			guessAmount += res;
			messageContainedGuess = true;
		}
	}
	return { messageContainedGuess, guessAmount };
}

function StopGuesses() {
	if (jaseGuess.HasGuesses()) {
		canProcessGuesses = false;
		clearTimeout(timer);
		jaseGuess.seconds = seconds;
		seconds = 0;
		jaseGuess.SaveResults();

		jaseGuess = new JaseGuess();
	}
}

exports.HandleMessage = function HandleMessage(
	channel,
	tags,
	message,
	self,
	client
) {
	if (ShouldIgnoreMessage(tags)) return;
	if (message.startsWith(GUESS_CONFIG.COMMAND_PREFIX)) {
		const args = message.slice(1).split(" ");
		const command = args.shift().toLowerCase();

		let handler = messageHandlers[command];
		if (handler) {
			util.DebugLog(
				`${handler.name} called by ${tags.username} ID (${tags["user-id"]}).`
			);
			if (!handler.middleware || handler.middleware(tags)) {
				handler.execute(channel, tags, args, client);
			}
			return;
		}
	}
	if (canProcessGuesses) {
		let processed = ProcessMessage(tags, message);
		if (processed.messageContainedGuess) {
			jaseGuess.IncreaseCount(processed.guessAmount, tags, message);
		}
	}
};
