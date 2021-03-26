const util = require("./../utils");

const convertToFormatTestCases = [
	{ input: 1000, expected: "1K" },
	{ input: 5000, expected: "5K" },
	{ input: 10000, expected: "10K" },
	{ input: 50000, expected: "50K" },
	{ input: 100000, expected: "100K" },
	{ input: 500000, expected: "500K" },
	{ input: 1000000, expected: "1.00M" },
	{ input: 5000000, expected: "5.00M" },
	{ input: 10000000, expected: "10.00M" },
	{ input: 50000000, expected: "50.00M" },
	{ input: 100000000, expected: "100.00M" },
	{ input: 500000000, expected: "500.00M" },
	{ input: 1000000000, expected: "1.00B" },
	{ input: 5000000000, expected: "5.00B" },
	{ input: 10000000000, expected: "10.00B" },
	{ input: 50000000000, expected: "50.00B" },
	{ input: 100000000000, expected: "100.00B" },
	{ input: 500000000000, expected: "500.00B" },
	{ input: 1000000000000, expected: "1000.00B" },
	{ input: 0, expected: 0 },
	{ input: -1, expected: 0 },
	{ input: "a", expected: 0 },
	{ input: [], expected: 0 },
	{ input: {}, expected: 0 },
	{ input: /a/, expected: 0 },
];

for (let i = 0; i < convertToFormatTestCases.length; i++) {
	const testCase = convertToFormatTestCases[i];
	test(`Turns ${testCase.input} into ${testCase.expected}`, () => {
		expect(util.ConvertToFormat(testCase.input)).toBe(testCase.expected);
	});
}

const parseUserInputTestCases = [
	{ input: "1K", expected: 1000 },
	{ input: "5K", expected: 5000 },
	{ input: "10K", expected: 10000 },
	{ input: "50K", expected: 50000 },
	{ input: "100K", expected: 100000 },
	{ input: "500K", expected: 500000 },
	{ input: "1.00M", expected: 1000000 },
	{ input: "5.00M", expected: 5000000 },
	{ input: "10.00M", expected: 10000000 },
	{ input: "50.00M", expected: 50000000 },
	{ input: "100.00M", expected: 100000000 },
	{ input: "500.00M", expected: 500000000 },
	{ input: "1.00B", expected: 1000000000 },
	{ input: "5.00B", expected: 5000000000 },
	{ input: "10.00B", expected: 10000000000 },
	{ input: "50.00B", expected: 50000000000 },
	{ input: "100.00B", expected: 100000000000 },
	{ input: "500.00B", expected: 500000000000 },
	{ input: "1000.00B", expected: 1000000000000 },
	{ input: "1k", expected: 1000 },
	{ input: "5k", expected: 5000 },
	{ input: "10k", expected: 10000 },
	{ input: "50k", expected: 50000 },
	{ input: "125000gp", expected: 125000 },
	{ input: "1,2m", expected: 1200000 },
	{ input: "5,6m", expected: 5600000 },
	{ input: "5.6m", expected: 5600000 },
	{ input: "1222k", expected: 1222000 },
	{ input: "123.23m", expected: 123230000 },
	{ input: "", expected: 0 },
	{ input: "abc", expected: 0 },
	{ input: "-----------", expected: 0 },
	{ input: 120, expected: 120 },
	{ input: 50000, expected: 50000 },
	{ input: 1200000, expected: 1200000 },
	{ input: [], expected: 0 },
	{ input: {}, expected: 0 },
	{ input: () => {}, expected: 0 },
	{ input: /2/, expected: 0 },
];

for (let i = 0; i < parseUserInputTestCases.length; i++) {
	const testCase = parseUserInputTestCases[i];
	test(`Turns ${testCase.input} into ${testCase.expected}`, () => {
		expect(util.ParseUserInputToNumber(testCase.input)).toBe(
			testCase.expected
		);
	});
}

const dateTestCases = [
	{ input: new Date(0), expected: "01-01-1970--01-00-00" }, // Thu Jan 01 1970 01:00:00
	{ input: new Date(1000), expected: "01-01-1970--01-00-01" },
	{ input: new Date(60000), expected: "01-01-1970--01-01-00" },
	{ input: new Date("3 march 2015"), expected: "03-03-2015--00-00-00" },
	{ input: new Date("17 march 2015"), expected: "17-03-2015--00-00-00" },
	{ input: new Date("17 july 2015"), expected: "17-07-2015--00-00-00" },
	{ input: new Date("26 march 2021"), expected: "26-03-2021--00-00-00" },
	{ input: new Date("26 march 2021 20:00:00"), expected: "26-03-2021--20-00-00" },
	{ input: new Date("26 march 2021 20:34:40"), expected: "26-03-2021--20-34-40" },
	{ input: new Date("26 asdadsf40"), expected: "Invalid-Date" },
	{ input: new Date("-----"), expected: "Invalid-Date" },
	{ input: 123, expected: "Invalid-Date" },
	{ input: 1231231, expected: "Invalid-Date" },
	{ input: "----", expected: "Invalid-Date" },
	{ input: [], expected: "Invalid-Date" },
	{ input: {}, expected: "Invalid-Date" },
	{ input: () => {}, expected: "Invalid-Date" },
];

for (let i = 0; i < dateTestCases.length; i++) {
	const testCase = dateTestCases[i];
	test(`Turns ${testCase.input} into ${testCase.expected}`, () => {
		expect(util.GetSafeDateFormat(testCase.input)).toBe(testCase.expected);
	});
}
