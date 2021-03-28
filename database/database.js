const mongoose = require("mongoose");

mongoose.connect(
	process.env.MONGODB_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err) => {
		if (err) {
			console.error(
				"Database error, check credentials and restart server"
			);
			return;
		}
		console.log("Connected to database");
	}
);

module.exports = mongoose;
