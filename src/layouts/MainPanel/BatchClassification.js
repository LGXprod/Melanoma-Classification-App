import React, { useState } from "react";
import ImportDropDown from "components/ImportDropDown";

import CloseIcon from "images/close-icon.png";

const BatchClassification = ({
  classification,
  selectedTab,
  setSelectedTab,
}) => {
  const { name, batchPatientData } = classification;

  const [patient, setPatient] = useState();

  return (
    <div>
      <div style={{ width: "100%" }}>
        <div style={{ float: "right" }}>
          <ImportDropDown
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
      </div>

      <h1 style={{ marginBottom: "20px" }}>Batch name: {name}</h1>

      {patient != null ? (
        <div className="form-container center-row">
          <div className="green form center-column patient-form">
            <div style={{ width: "100%" }}>
              <img
                alt="close icon"
                src={CloseIcon}
                style={{ width: "32px", float: "right", marginRight: "10px" }}
                onClick={() => setPatient(null)}
              />
            </div>

            <h1>Patient name: {patient.name}</h1>

            <div className="center-column patient-data">
              <h3>Age: {patient.age}</h3>
              <h3>Biological sex: {patient.sex}</h3>
              <h3>Location of imaged site: {patient.imageLocation}</h3>
              <h3 style={{ marginBottom: "50px" }}>
                Classification: {patient.isMalignant ? "Malignant" : "Benign"}{" "}
                (Probability = {patient.probability}%)
              </h3>
            </div>
          </div>
        </div>
      ) : null}

      <div className="batch-import">
        {batchPatientData.map((patientData, index) => {
          return (
            <div
              className="center-column"
              onClick={() => setPatient(patientData)}
            >
              <img
                key={index}
                alt="skin"
                src={`data:image/png;base64, ${patientData.image}`}
                style={{ marginBottom: "10px", marginRight: "10px" }}
              />
              <h3 style={{ marginBottom: "10px" }}>{patientData.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BatchClassification;
