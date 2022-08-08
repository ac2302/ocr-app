import { MantineProvider } from "@mantine/core";
import "./App.css";

function App() {
	return (
		<MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS>
			Hello
		</MantineProvider>
	);
}

export default App;
