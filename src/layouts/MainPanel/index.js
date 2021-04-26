import React, { useState, useEffect } from "react";
import ImportDropDown from "components/ImportDropDown";
import SinglePatient from "./forms/SinglePatient";
import PatientClassification from "./PatientClassification";

const MainPanel = ({ selectedTabData }) => {
  const [isSingleImport, setIsSingleImport] = useState();
  const [showPatientForm, setShowPatientForm] = useState();

  useEffect(() => {
    console.log("import", isSingleImport);
  }, [isSingleImport]);

  // ${isSingleImport ? "blur" : ""}
  return (
    <>
      <div className={`main-panel blue`}>
        <div
          style={{ width: "100%", height: "100%" }}
          className="center-column"
        >
          {selectedTabData != null ? (
            <PatientClassification classification={selectedTabData} />
          ) : (
            <>
              <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>
                To begin detecting malignant Melanomas import a single patient’s
                information or a batch of patient information.
              </h1>

              <ImportDropDown
                isSingleImport={isSingleImport}
                setIsSingleImport={setIsSingleImport}
              />
            </>
          )}
        </div>
      </div>

      {isSingleImport ? (
        <SinglePatient setIsSingleImport={setIsSingleImport} />
      ) : null}
    </>
  );
};

export default MainPanel;
