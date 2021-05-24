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
            <img
              key={index}
              alt="skin"
              src={`data:image/png;base64, ${patientData.image}`}
              style={{ marginRight: "10px" }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BatchClassification;
