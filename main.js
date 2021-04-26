require("dotenv").config();
const electron = require("electron");
const fs = require("fs");

// Module to control application life.
// Module to create native browser window.
const { app, BrowserWindow, ipcMain } = electron;

const path = require("path");
const url = require("url");

const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, "./build/index.html"),
    protocol: "file:",
    slashes: true,
  });

console.log("startUrl", startUrl);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: `${__dirname}/src/images/app-icon.ico`
  });

  // and load the index.html of the app.
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("classifications:initialLoad", (event) => {
  mainWindow.webContents.send(
    "classifications:initialLoad",
    JSON.parse(fs.readFileSync("appData.json"))
  );
});

ipcMain.on("patientData:submit", (event, patientData) => {
  patientData = {
    ...patientData,
    image: fs.readFileSync(patientData.filePath, "base64"),
  };
  //   console.log(patientData);

  // need to make classification at this point and append it to the object
  patientData.isMalignant = Math.random() < 0.5; // placeholder gives random boolean
  // probability that the model gives for the classification being correct
  patientData.probability = (Math.random()*100).toFixed(2); 

  var currentAppData = fs.readFileSync("appData.json");
  var json = JSON.parse(currentAppData);
  json.push({ ...patientData, id: json.length });

  fs.writeFileSync("appData.json", JSON.stringify(json, null, 2));

  mainWindow.webContents.send("patientClassification:added", patientData);
});

// ipcMain.on("batchPatientData:submit", (event, patientsData) => {

// });
