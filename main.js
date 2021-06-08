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

function getImgClassification(patientData, json, callback, batchId = null) {
  const id = batchId == null ? json.length : batchId;
  const newFileName = `${json.length}${batchId == null ? "" : `-${id}`}`;

  const imageFormat =
    patientData.fileName.split(".")[patientData.fileName.split(".").length - 1];

  fs.copyFile(
    patientData.filePath,
    `${app.getAppPath()}/melanoma_images/${newFileName}.${imageFormat}`,
    (err) => {
      if (err) throw err;

      Jimp.read(
        `${app.getAppPath()}/melanoma_images/${newFileName}.${imageFormat}`,
        (err, image) => {
          if (err) throw err;

          console.log("here 1");

          image
            .resize(512, 512)
            .write(
              `${app.getAppPath()}/melanoma_images/${newFileName}.${imageFormat}`,
              (err) => {
                if (err) throw err;

                console.log("here 2");

                cnn_model.predict(
                  `${app.getAppPath()}/melanoma_images/${newFileName}.${imageFormat}`,
                  (probability) => {
                    console.log("here 3");
                    // need to make classification at this point and append it to the object
                    patientData.isMalignant = probability > 0.5; // placeholder gives random boolean
                    // probability that the model gives for the classification being correct
                    patientData.probability =
                      Math.round(probability * 10000) / 10000;

                    console.log("p(x)", patientData.probability);

                    callback({
                      id,
                      ...patientData,
                      fileName: `${newFileName}.${imageFormat}`,
                      image: base64_encode(patientData.filePath),
                    });
                  }
                );
              }
            );
        }
      );
    }
  );
}

function getBatchClassification(patientData, json, id) {
  return new Promise((resolve) => {
    getImgClassification(
      patientData,
      json,
      (patientClassification) => {
        json[json.length - 1].batchPatientData.push(patientClassification);

        fs.writeFileSync(`${app.getAppPath()}/appData.json`, JSON.stringify(json, null, 2));

        resolve();
      },
      id
    );
  });
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
      JSON.parse(fs.readFileSync(`${app.getAppPath()}/appData.json`))
    );
  });

  ipcMain.on("patientData:submit", (event, patientData) => {
    let currentAppData = fs.readFileSync(`${app.getAppPath()}/appData.json`);
    let json = JSON.parse(currentAppData);

    getImgClassification(patientData, json, (patientClassification) => {
      json.push({ isBatch: false, ...patientClassification });

      fs.writeFileSync("appData.json", JSON.stringify(json, null, 2));

      mainWindow.webContents.send("patientClassification:added", json);
    });
  });

  ipcMain.on("batchPatientData:submit", (event, batchMetaData) => {
    const { batchName, csvFile, images } = batchMetaData;

    const batchPatientData = [];

    fs.createReadStream(csvFile.path)
      .pipe(csv())
      .on("data", (row) =>
        batchPatientData.push({
          ...row,
          filePath: images[row.imageName],
          fileName: row.imageName,
        })
      )
      .on("end", () => {
        let jsonFile = fs.readFileSync(`${app.getAppPath()}/appData.json`);
        let currentPatientData = JSON.parse(jsonFile);

        currentPatientData.push({
          isBatch: true,
          name: batchName,
          id: currentPatientData.length,
          batchPatientData: [],
        });

        (async () => {
          for (let patientIndex in batchPatientData) {
            console.log("b", batchPatientData[patientIndex].name);
            console.log("b", batchPatientData[patientIndex].fileName);
            console.log("b", batchPatientData[patientIndex].filePath);

            await getBatchClassification(
              batchPatientData[patientIndex],
              currentPatientData,
              parseInt(patientIndex)
            );

            mainWindow.webContents.send("batchClassification:progress", {
              numProcessed: parseInt(patientIndex) + 1,
              total: batchPatientData.length,
            });

            console.log("progress", parseInt(patientIndex) + 1);
          }

          // fs.writeFileSync(
          //   "appData.json",
          //   JSON.stringify(currentPatientData, null, 2)
          // );

          mainWindow.webContents.send(
            "patientClassification:added",
            JSON.parse(fs.readFileSync(`${app.getAppPath()}/appData.json`))
          );
        })();
      });
  });
})();
