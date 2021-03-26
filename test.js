function* makeIterator() {
	yield 1;
	yield 2;
}

const it = makeIterator();
for (const itItem of it) {
	console.log(itItem);
}
