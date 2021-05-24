import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

const ImportDropDown = ({ selectedTab, setSelectedTab }) => {
  return (
    <>
      <Select
        native
        variant="filled"
        value={selectedTab.type}
        onChange={(e) => setSelectedTab({
          type: e.target.value,
          data: null
        })}
        className="dropdown"
      >
        <option value={null} style={{ display: "none" }}>Import Imaging</option>
        <option value={"Single Patient Form"}>Single Patient</option>
        <option value={"Batch Patient Form"}>Batch Import</option>
      </Select>
    </>
  );
};

export default ImportDropDown;
