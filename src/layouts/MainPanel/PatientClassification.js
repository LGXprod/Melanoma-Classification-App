import React, { useState, useEffect } from "react";

const { ipcRenderer } = window.require("electron");

const PatientClassification = ({ classification }) => {
  console.log(classification);
  const {
    patientName,
    age,
    sex,
    imageLocation,
    isMalignant,
    probability,
    fileName,
  } = classification;

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  return (
    <div className="full-width center-column patient-tab">
      <h1>Patient name: {patientName}</h1>

      <div className="center-column patient-data">
        <h3>Age: {age}</h3>
        <h3>Biological sex: {sex}</h3>
        <h3>Location of imaged site: {imageLocation}</h3>
        <h3>
          Classification: {isMalignant ? "Malignant" : "Benign"} (Probability ={" "}
          {probability}%)
        </h3>
      </div>

      <div style={{ width: "85%" }}>
        <img alt="Melanoma" src={require(`melanoma_images/${fileName}`).default} />
      </div>
    </div>
  );
};

export default PatientClassification;
