import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

const ImportDropDown = ({ isSingleImport, setIsSingleImport }) => {
  return (
    <>
      <Select
        native
        variant="filled"
        value={isSingleImport}
        onChange={(e) => setIsSingleImport(e.target.value)}
        className="dropdown"
      >
        <option value={null} style={{ display: "none" }}>Import Imaging</option>
        <option value={true}>Single Patient</option>
        <option value={false}>Batch Import</option>
      </Select>
    </>
  );
};

export default ImportDropDown;
