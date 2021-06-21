// const { spawn } = require("child_process");

// const predict = (filePath, modelPath, callback) => {
//   const pythonProcess = spawn("python3", [
//     `${modelPath}/cnn_model.py`,
//     filePath,
//     modelPath,
//   ]);

//   pythonProcess.stdout.on("data", (data) => {
//     console.log("py", data.toString());
//     callback(JSON.parse(data.toString())[0][0] * 100);
//   });
// };

// module.exports = {
//   predict,
// };

const { PythonShell } = require("python-shell");

const predict = (filePath, modelPath, callback) => {
  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: modelPath,
    args: [filePath, modelPath],
  };

  PythonShell.run("cnn_model.py", options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution

    const [probability] = results;
    console.log("py", probability.toString());
    callback(parseFloat(JSON.parse(probability.toString())[0][0]) * 100);
  });
};

module.exports = {
  predict,
};
