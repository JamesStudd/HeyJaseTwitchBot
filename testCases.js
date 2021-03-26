const testCases = [];
const amountOfTests = 11;

function makeid(length) {
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

for (let i = 0; i < amountOfTests; i++) {
	testCases.push({
		message: "100k",
		delay: 0.5,
		tags: {
			username: `homida${i}`,
			subscriber: false,
			id: makeid(10),
		},
	});
}

testCases[0].message = "110k bh";

testCases.push({
	message: "jaseDemon jaseTreemon",
	delay: 0.1,
	tags: {
		username: `hey_jase`,
		subscriber: false,
		id: makeid(10),
	},
});

testCases.push({
	message: "answer: 110k",
	delay: 0.1,
	tags: {
		username: `homida`,
		subscriber: false,
		id: makeid(10),
	},
});

exports.testCases = testCases;
