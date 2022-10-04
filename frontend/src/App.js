import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [file, setFile] = useState();
	const [filePath, setFilePath] = useState();
	const [result, setResult] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (file && filePath) {
			setLoading(true);
			setResult("");
			// Tesseract.recognize(file, "eng", {
			// 	logger: (m) => console.log(m),
			// })
			// 	.then(({ data: { text } }) => {
			// 		console.log(text);
			// 		setLoading(false);
			// 		setResult(text);
			// 	})
			// 	.catch((err) => {
			// 		console.error(err);
			// 		alert("error");
			// 	});

			console.log(file);

			let formdata = new FormData();
			formdata.append(
				"file",
				document.getElementById("file-input").files[0]
			);

			axios
				.post("https://ocr-backend.ieeetechithon.com/ocr", formdata, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((res) => {
					console.log(res.data);
					setLoading(false);
					setResult(res.data.text);
				});

			// setLoading(false);
			// setResult("lmao");
		}
	}, [file, filePath]);

	return (
		<>
			<input
				type="file"
				id="file-input"
				name="image"
				accept="image/*"
				onChange={(e) => {
					setFilePath(e.target.value);
					const reader = new FileReader();
					reader.onload = function () {
						setFile(reader.result);
					};
					reader.readAsDataURL(e.target.files[0]);
				}}
			/>

			{file && <img height={200} src={file} />}

			{loading && (
				<>
					<hr />
					<h4>loading...</h4>
				</>
			)}

			{result && (
				<>
					<hr />
					<pre>{result}</pre>
				</>
			)}
		</>
	);
}

export default App;
