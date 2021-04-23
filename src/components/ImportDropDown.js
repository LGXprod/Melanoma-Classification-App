import React, { useState, useEffect, useRef } from "react";
import Select from '@material-ui/core/Select';

const ImportDropDown = () => {
  const [isSingleImport, setIsSingleImport] = useState();

  const inputFile = useRef(null) ;

  useEffect(() => {
    console.log(isSingleImport);
  }, [isSingleImport]);

  return (
    <>
      <Select
        native
        variant="filled"
        value={isSingleImport == null ? true : isSingleImport}
        onChange={(e) => {
          setIsSingleImport(e.target.value);
          inputFile.current.click();
        }}
        inputProps={{
          name: 'Import new',
          id: 'age-native-simple',
        }}
        className="dropdown"
      >
        <option value={true}>Single Patient</option>
        <option value={false}>Batch Import</option>
      </Select>

      <input type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
    </>
  );
}

export default ImportDropDown;