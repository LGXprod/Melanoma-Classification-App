require("dotenv").config();
const electron = require("electron");
const fs = require("fs");

// Module to control application life.
// Module to create native browser window.
const { app, BrowserWindow, ipcMain } = electron;

const path = require("path");
const url = require("url");

// const tf = require("@tensorflow/tfjs");
// const tfn = require("@tensorflow/tfjs-node");
const Jimp = require("jimp");

const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, "./build/index.html"),
    protocol: "file:",
    slashes: true,
  });

console.log("startUrl", startUrl);

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
      `${__dirname}/src/melanoma_images/${json.length}.${imageFormat}`,
      (err) => {
        if (err) throw err;

        // need to make classification at this point and append it to the object
        patientData.isMalignant = Math.random() < 0.5; // placeholder gives random boolean
        // probability that the model gives for the classification being correct
        patientData.probability = (Math.random() * 100).toFixed(2);

        Jimp.read(
          `${__dirname}/src/melanoma_images/${json.length}.${imageFormat}`,
          (err, image) => {
            if (err) throw err;

            image
              .resize(224, 224)
              .write(
                `${__dirname}/src/melanoma_images/${json.length}.${imageFormat}`
              );

              json.push({
                ...patientData,
                id: json.length,
                fileName: `${json.length}.${imageFormat}`,
              });
      
              fs.writeFileSync("appData.json", JSON.stringify(json, null, 2));
      
              mainWindow.webContents.send("patientClassification:added", json);

            // Jimp.read(
            //   `${__dirname}/src/melanoma_images/${json.length}.${imageFormat}`,
            //   async (err, image) => {
            //     let pixels = [];

            //     for (let x = 0; x < 224; x++) {
            //       pixels.push([]);

            //       for (let y = 0; y < 224; y++) {
            //         const rgba = Jimp.intToRGBA(image.getPixelColour(x, y));

            //         pixels[pixels.length - 1].push([rgba.r, rgba.g, rgba.b]);
            //       }
            //     }

            //     // for (let x = 0; x < 224; x++) {
            //     //   for (let y = 0; y < 224; y++) {
            //     //     const rgba = Jimp.intToRGBA(image.getPixelColour(x, y));

            //     //     pixels.push([rgba.r, rgba.g, rgba.b]);
            //     //   }
            //     // }

            //     // try {
            //     //   const handler = tfn.io.fileSystem(`${__dirname}/model.json`);
            //     //   const cnn_model = await tf.loadGraphModel(handler);

            //     //   const predictions_tensor = await cnn_model.executeAsync(
            //     //     tf.tensor([pixels])
            //     //   );

            //     //   console.log(predictions_tensor.dataSync());
                  
            //     //   // console.log(await predictions_tensor.data);

            //     //   // console.log(pixels);
            //     // } catch (err) {
            //     //   console.log("err", err);
            //     // }

                
            //   }
            // );
          }
        );

        
      }
    );
  });

  // ipcMain.on("batchPatientData:submit", (event, patientsData) => {

  // });
})();
