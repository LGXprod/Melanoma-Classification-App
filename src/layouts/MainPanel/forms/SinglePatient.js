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

const SinglePatient = () => {
  return (
    <div className="form-container center-row">
      <div className="green form center-column patient-form">
        <h1>Single Patient Detection</h1>

        <div>
          <TextField id="standard-basic" label="Patient" />
        </div>

        <div>
          <TextField id="standard-basic" label="Age" />
        </div>

        <div style={{ marginTop: "26px", width: "275px" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Biological sex</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="position"
              defaultValue="top"
            >
              <FormControlLabel
                value="Male"
                control={<Radio color="primary" />}
                label="Male"
                labelPlacement="end"
              />
              <FormControlLabel
                value="Female"
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
          />
        </div>

        <div>
          <FileDialog isSingleFile={true} label="Import Lession Image" />
        </div>

        <div>
          <Button className="reg-button">Submit</Button>
        </div>
      </div>

      <img alt="close icon" src={CloseIcon} style={{ width: "48px" }} />
    </div>
  );
};

export default SinglePatient;
