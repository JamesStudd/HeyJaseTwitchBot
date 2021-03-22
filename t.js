const messageTests = [
	{ message: "Test message", delay: 0.1 },
	{ message: "Test message1", delay: 0.1 },
	{ message: "Test message2", delay: 0.5 },
	{ message: "Test message3", delay: 1 },
	{ message: "Test message4", delay: 0.1 },
];

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function Test() {
	for (let i = 0; i < messageTests.length; i++) {
		const element = messageTests[i];
		console.log(element.message);
		await timeout(element.delay * 1000);
	}
}

Test();
