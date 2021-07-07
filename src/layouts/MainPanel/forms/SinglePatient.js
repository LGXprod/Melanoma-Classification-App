import React, { useState, useEffect } from "react";

import FileDialog from "components/FileDialog";
import CloseIcon from "images/close-icon.png";

import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";

import CropTool from "./CropTool";

const { ipcRenderer } = window.require("electron");

const SinglePatient = ({ setSelectedTab }) => {
  const [file, setFile] = useState();
  const [imageDetails, setImageDetails] = useState();

  const [patientDetails, setPatientDetails] = useState({
    name: null,
    age: null,
    sex: null,
    imageLocation: null,
  });

  const [isIncomplete, setIsInComplete] = useState(false);

  useEffect(() => {
    console.log("f", file);

    if (file != null) {
      ipcRenderer.send("image_res:check", file.path);
    }
  }, [file]);

  useEffect(() => {
    ipcRenderer.on("image_res:checked", (event, imageDetails) => {
      setImageDetails(imageDetails);
    });
  }, []);

  const updateDetails = (attribute, value) => {
    setPatientDetails({ ...patientDetails, [attribute]: value });
  };

  const onSubmit = () => {
    console.log(patientDetails);
    let formCompleted = true;

    if (file == null) {
      formCompleted = false;
      setIsInComplete(true);
    }

    for (let attribute in patientDetails) {
      if (patientDetails[attribute] == null) {
        formCompleted = false;
        setIsInComplete(attribute);
        break;
      }
    }

    if (formCompleted) {
      console.log("f", file);
      ipcRenderer.send("patientData:submit", {
        ...patientDetails,
        filePath: file.path,
        fileName: file.name,
      });
      setSelectedTab({ type: "Loading Single Classification", data: null });
    }
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

        <h1 style={{ marginTop: "-30px" }}>Single Patient Detection</h1>

        {imageDetails != null ? (
          <CropTool imageDetails={imageDetails} />
        ) : (
          <>
            <div>
              <TextField
                id="standard-basic"
                label="Patient name"
                onChange={(e) => updateDetails("name", e.target.value)}
              />
            </div>

            <div>
              <TextField
                id="standard-basic"
                label="Age"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => updateDetails("age", e.target.value)}
              />
            </div>

            <div style={{ marginTop: "26px", width: "275px" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Biological sex</FormLabel>
                <RadioGroup
                  row
                  aria-label="position"
                  name="position"
                  defaultValue="top"
                  onChange={(e) => updateDetails("sex", e.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio color="primary" />}
                    label="Male"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio color="primary" />}
                    label="Female"
                    labelPlacement="end"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div>
              <TextField
                id="standard-basic"
                label="Location of image sited on patient"
                onChange={(e) => updateDetails("imageLocation", e.target.value)}
              />
            </div>

            <div>
              <FileDialog
                isSingleFile={true}
                label="Import Lesion Image"
                files={file}
                setFiles={setFile}
              />
            </div>

            {file != null && <label>Image selected: {file.name}</label>}

            {isIncomplete ? (
              <label style={{ color: "#ff0033", fontWeight: "bold" }}>
                Form is incomplete. Please ensure you have correctly filled out
                each field.
              </label>
            ) : null}

            <div>
              <Button className="reg-button" onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SinglePatient;
