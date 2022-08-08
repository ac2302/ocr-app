const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const tesseract = require("node-tesseract-ocr");
const fs = require("fs");

const app = express();

// enable files upload
app.use(
	fileUpload({
		createParentPath: true,
	})
);

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//start app
const port = 5050;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

app.post("/ocr", async (req, res) => {
	// try {
	if (!req.files) {
		res.send({
			status: false,
			message: "No file uploaded",
		});
	} else {
		//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
		let uploadedFile = req.files.file;

		const randomString =
			(Math.random() + 1).toString(36).substring(7) +
			(Math.random() + 1).toString(36).substring(7) +
			(Math.random() + 1).toString(36).substring(7) +
			(Math.random() + 1).toString(36).substring(7) +
			(Math.random() + 1).toString(36).substring(7);

		//Use the mv() method to place the file in upload directory (i.e. "uploads")
		const path = `./uploads/${randomString}-${uploadedFile.name}`;
		await uploadedFile.mv(path);

		// scheduling delete
		setTimeout(() => {
			fs.rmSync(path);
		}, 1000 * 5);

		// ocr
		tesseract
			.recognize(path, { lang: "eng" })
			.then((text) => {
				console.log("Result:", text);
				res.json({ text });
			})
			.catch((error) => {
				console.log(error.message);
				res.status(500).json({ msg: error.message });
			});
	}
	// } catch (err) {
	// 	res.status(500).send(err);
	// }
});

// app.get("/download/:filename", (req, res) => {
// 	try {
// 		res.sendFile(__dirname + "/uploads/" + req.params.filename);
// 	} catch (err) {
// 		res.status(500).send(err);
// 	}
// });
