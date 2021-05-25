import React, { useState, useEffect } from "react";

const BatchClassification = ({ classification }) => {
  const { name, batchPatientData } = classification;

  return (
    <div>
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
