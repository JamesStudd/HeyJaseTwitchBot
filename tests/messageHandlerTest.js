const handleMessage = require('../messagehandler').HandleMessage;
const CONFIG = require('./../config').CONFIG;
const util = require('./../utils');

const MIN_GUESS = 1;
const MAX_GUESS = 100;
const AMOUNT = 100;

let testCases = CreateRandomMessages(MIN_GUESS, MAX_GUESS, AMOUNT);
RunTests(testCases);

async function RunTests(cases) {
	for (let i = 0; i < cases.length; i++) {
		const { tags, message, delay } = cases[i];
		handleMessage(
			CONFIG.CHANNEL_NAME,
			tags,
			message,
			false
		);
		await util.timeout(delay * 1000);
	}
}

function CreateRandomMessages(minGuess, maxGuess, amount) {
    let testCases = [];
    for (let i = 0; i < amount; i++) {
        let amount = `${RandomIntFromInterval(minGuess, maxGuess)}${RandomLetter()}`;
        testCases.push({
            message: `${amount} ${RandomAffix()}`,
            delay: 0.1,
            tags: RandomTags(`homida${i}`)
        });
    }
    testCases.push({ message: " ", delay: 0.1, tags: RandomTags(CONFIG.GUESS_ENDER[0])});
    return testCases;
}

function RandomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function RandomLetter() {
    const rand = RandomIntFromInterval(1, 3);
    switch(rand) {
        case 1:
            return "k";
        case 2:
            return "m";
        case 3:
            return "b";
    }
}

function RandomAffix() {
    const rand = RandomIntFromInterval(1, 20);
    if (rand < 18) return "";
    if (rand < 19) return "bh";
    if (rand < 20) return "mimic"
    else return "jaseCasket"
}

function RandomTags(username) {
    let tags = {
        subscriber: false,
        username
    }
    
    if (RandomIntFromInterval(0, 1) > 0) tags.subscriber = true;
    if (RandomIntFromInterval(0, 10) > 9) tags["user-type"] = "mod"
    tags.id = MakeID(10);
    return tags;
}

function MakeID(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}