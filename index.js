const express = require("express");
const app = express();
const getZip = require("./getZip");
const cors = require("cors");

app.use(cors());
const getMapsURL = (long, lat) =>
	`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyDN8mwXsiRuCYxxCKAkOUdMINGVItC0yDo&language=iw`;

app.get("/api/", cors(), async (req, res) => {
	const { city, street, house } = req.query;
	if (
		city === undefined ||
		street === undefined ||
		house === undefined ||
		city == "" ||
		street == "" ||
		house == ""
	) {
		res.send("Not found");
		console.log(33333);
	} else {
		console.log(req.query);
		res.send(await getZip(req.query));
	}
});

//getZip({ city: "מודיעין-מכבים-רעות", street: "מגדל הלבנון", house: "26" });

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
