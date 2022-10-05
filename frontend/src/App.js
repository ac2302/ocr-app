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
				.post("http://localhost:6050/ocr", formdata, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((res) => {
					console.log(res.data);
					setLoading(false);
					const detectedText = res.data.text;
					console.log(detectedText.length);
					detectedText.length > 1
						? setResult(detectedText)
						: setResult("No Text Detected");
				});

			// setLoading(false);
			// setResult("lmao");
		}
	}, [file, filePath]);

	return (
		<>
			<div className="container">
				<input
					type="file"
					id="file-input"
					name="image"
					accept="image/*"
					style={{ display: file ? "none" : "block" }}
					onChange={(e) => {
						setFilePath(e.target.value);
						const reader = new FileReader();
						reader.onload = function () {
							setFile(reader.result);
						};
						reader.readAsDataURL(e.target.files[0]);
					}}
				/>

				{file && (
					<img className="display-image" height={200} src={file} />
				)}

				<div className="results">
					{loading && (
						<>
							<h4>loading...</h4>
						</>
					)}

					{result && (
						<>
							<pre>{result}</pre>
							<button
								onClick={() => {
									const cb = navigator.clipboard;
									const element =
										document.querySelector("pre");
									cb.writeText(element.innerText).then(() =>
										alert("Text copied")
									);
								}}
							>
								copy
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
