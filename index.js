const {
	app,
	BrowserWindow
} = require("electron");

app.on("ready", () => {
	let demoWindow = new BrowserWindow();
	demoWindow.loadFile(__dirname + "/demo.html");
	demoWindow.show();
});