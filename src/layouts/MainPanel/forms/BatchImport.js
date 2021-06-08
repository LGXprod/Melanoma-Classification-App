import React, { useState, useEffect } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import FileDialog from "components/FileDialog";
import CloseIcon from "images/close-icon.png";

const { ipcRenderer } = window.require("electron");

const BatchImport = ({ setSelectedTab }) => {
  const [formDetails, setFormDetails] = useState({
    batchName: null,
  });
  const [csv, setCsv] = useState();
  const [images, setImages] = useState();

  useEffect(() => {
    console.log("xx", images);
    if (!Array.isArray(images) && images != null) {
      const imageList = [];

      for (let image of images) {
        imageList.push(image);
      }

      setImages(imageList);
    }
  }, [images]);

  const updateDetails = (attribute, value) => {
    setFormDetails({ ...formDetails, [attribute]: value });
  };

  const [showUpload, setShowUpload] = useState(false);

  const submitForm = () => {
    let imageData = {};

    for (let image of images) {
      imageData[image.name] = image.path;
    }

    const batchPatientData = {
      ...formDetails,
      csvFile: {
        name: csv.name,
        path: csv.path,
      },
      images: imageData,
    };

    console.log(batchPatientData);

    ipcRenderer.send("batchPatientData:submit", batchPatientData);
    setSelectedTab({ type: "Loading Batch Classification", data: null });
  };

  return (
    <div className="form-container center-row">
      <div className="green form center-column patient-form">
        <div style={{ width: "100%" }}>
          <img
            alt="close icon"
            src={CloseIcon}
            style={{ width: "32px", float: "right", marginRight: "10px" }}
            onClick={() => setSelectedTab({ type: null, data: null })}
          />
        </div>

        <h1 style={{ marginTop: "-30px" }}>Batch Patient Detection</h1>

        {showUpload ? (
          <>
            <label>CSV file imported: {csv.name}</label>

            <label>Images imported:</label>

            <div style={{ height: "125px", overflowY: "scroll" }}>
              {images.map((image, i) => {
                return <label key={i} style={{display: "block"}}>{image.name}</label>;
              })}
            </div>

            <div>
              <Button className="reg-button" onClick={submitForm}>
                &nbsp;&nbsp;Confirm&nbsp;&nbsp;
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <TextField
                id="standard-basic"
                label="Batch name"
                onChange={(e) => updateDetails("batchName", e.target.value)}
              />
            </div>

            <div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ marginRight: "5px" }}>
                  <FileDialog
                    isSingleFile={true}
                    label="&nbsp;&nbsp;&nbsp;Import CSV&nbsp;&nbsp;&nbsp;"
                    setFiles={setCsv}
                  />
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <FileDialog
                    isSingleFile={false}
                    label="Import Images"
                    setFiles={setImages}
                  />
                </div>
              </div>
            </div>

            <div>
              <Button
                className="reg-button"
                onClick={() => setShowUpload(true)}
              >
                &nbsp;&nbsp;Submit&nbsp;&nbsp;
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BatchImport;
