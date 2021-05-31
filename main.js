require("dotenv").config();
const electron = require("electron");
const fs = require("fs");
const process = require("process");

const csv = require("csv-parser");

// Module to control application life.
// Module to create native browser window.
const { app, BrowserWindow, ipcMain } = electron;

const path = require("path");
const url = require("url");

// const tf = require("@tensorflow/tfjs");
// const tfn = require("@tensorflow/tfjs-node");
const Jimp = require("jimp");

const cnn_model = require("./cnn_model");

const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, "./build/index.html"),
    protocol: "file:",
    slashes: true,
  });

console.log("startUrl", startUrl);

console.log(process.cwd());

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

(async () => {
  // console.clear();

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
      icon: `${__dirname}/src/images/app-icon.ico`,
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
    let currentAppData = fs.readFileSync("appData.json");
    let json = JSON.parse(currentAppData);

    const imageFormat =
      patientData.fileName.split(".")[
        patientData.fileName.split(".").length - 1
      ];

    fs.copyFile(
      patientData.filePath,
      `${__dirname}/melanoma_images/${json.length}.${imageFormat}`,
      (err) => {
        if (err) throw err;

        Jimp.read(
          `${__dirname}/melanoma_images/${json.length}.${imageFormat}`,
          (err, image) => {
            if (err) throw err;

            image
              .resize(512, 512)
              .write(
                `${__dirname}/melanoma_images/${json.length}.${imageFormat}`,
                (err) => {
                  if (err) throw err;

                  cnn_model.predict(patientData.filePath, (probability) => {
                    // need to make classification at this point and append it to the object
                    patientData.isMalignant = probability > 0.5; // placeholder gives random boolean
                    // probability that the model gives for the classification being correct
                    patientData.probability =
                      Math.round(probability * 10000) / 10000;

                    console.log(patientData);

                    json.push({
                      isBatch: false,
                      ...patientData,
                      id: json.length,
                      fileName: `${json.length}.${imageFormat}`,
                      image: base64_encode(patientData.filePath),
                    });

                    fs.writeFileSync(
                      "appData.json",
                      JSON.stringify(json, null, 2)
                    );

                    mainWindow.webContents.send(
                      "patientClassification:added",
                      json
                    );
                  });
                }
              );
          }
        );
      }
    );
  });

  ipcMain.on("batchPatientData:submit", (event, batchMetaData) => {
    const { batchName, csvFile, images } = batchMetaData;

    const batchPatientData = [];

    fs.createReadStream(csvFile.path)
      .pipe(csv())
      .on("data", (row) =>
        batchPatientData.push({
          ...row,
          image: base64_encode(images[row.imageName]),
        })
      )
      .on("end", () => {
        let jsonFile = fs.readFileSync("appData.json");
        let currentPatientData = JSON.parse(jsonFile);

        currentPatientData.push({
          isBatch: true,
          name: batchName,
          ...currentPatientData,
          id: currentPatientData.length,
          batchPatientData,
        });

        fs.writeFileSync(
          "appData.json",
          JSON.stringify(currentPatientData, null, 2)
        );

        mainWindow.webContents.send(
          "patientClassification:added",
          currentPatientData
        );
      });
  });
})();
