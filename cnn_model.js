const { spawn } = require("child_process");

const predict = (filePath, callback) => {
  const pythonProcess = spawn("python", ["./cnn_model.py", filePath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log("py", data.toString());
    callback(JSON.parse(data.toString())[0][0]*100);
  });
};

module.exports = {
  predict,
};
