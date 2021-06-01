import React, { useState, useEffect } from "react";
import ImportDropDown from "components/ImportDropDown";

const BatchClassification = ({ classification, selectedTab, setSelectedTab }) => {
  const { name, batchPatientData } = classification;

  return (
    <div>
      <div style={{ width: "100%" }}>
        <div style={{float: "right"}}>
        <ImportDropDown
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        </div>
      </div>

      <h1 style={{ marginBottom: "20px" }}>{name}</h1>

      <div className="batch-import">
        {batchPatientData.map((patientData, index) => {
          console.log("H", patientData);
          return (
            <div className="center-column">
              <img
                key={index}
                alt="skin"
                src={`data:image/png;base64, ${patientData.image}`}
                style={{ marginBottom: "10px", marginRight: "10px" }}
              />
              <h3 style={{ marginBottom: "10px" }}>
                {patientData.patientName}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BatchClassification;
