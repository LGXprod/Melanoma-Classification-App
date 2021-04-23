import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";

const FileDialog = ({ label, isSingleFile }) => {
  const [files, setFiles] = useState();
  const inputFile = useRef(null);

  const handleFileUpload = (e) => {
    const { files } = e.target;

    if (files && files.length) {
      const filename = files[0].name;

      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      console.log("fileType", fileType); //ex: zip, rar, jpg, svg etc.

      setFiles(files[0]);
    }
  };

  return (
    <>
      <Button className="reg-button" onClick={() => inputFile.current.click()}>
        {label}
      </Button>

      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </>
  );
};

export default FileDialog;
