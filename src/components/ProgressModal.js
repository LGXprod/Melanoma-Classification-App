import React, { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

const { ipcRenderer } = window.require("electron");

const ProgressModal = () => {
  const [progress, setProgress] = useState({
    numProcessed: 0,
    total: 1,
    progressSent: false,
  });

  useEffect(() => {
    ipcRenderer.on("batchClassification:progress", (event, progress) => {
      setProgress({ ...progress, progressSent: true });
    });
  }, []);

  return (
    <div className="form-container center-row">
      <div
        className="green form center-column patient-form"
        style={{ padding: "20px" }}
      >
        <h1 style={{ marginBottom: "25px" }}>
          The Deep Learning Model is now processing all your patient's skin
          imaging to classify it as benign or malignant. This usually takes 1-2
          minutes per patient.
        </h1>

        <div style={{ width: "90%" }}>
          <LinearProgress
            variant="determinate"
            value={Math.round((progress.numProcessed / progress.total) * 100)}
          />
        </div>

        {progress.progressSent ? (
          <label style={{ textAlign: "center" }}>
            {progress.numProcessed} out of {progress.total}
            <br />
            patients processed and classified
          </label>
        ) : <label style={{ textAlign: "center" }}>Loading...</label>}
      </div>
    </div>
  );
};

export default ProgressModal;
