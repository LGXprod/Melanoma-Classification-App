import React from "react";

const PatientClassification = ({ classification }) => {
  console.log(classification);
  const {
    patientName,
    age,
    sex,
    imageLocation,
    isMalignant,
    probability,
    image
  } = classification;

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

        <img
          style={{ marginTop: "25px", width: "75%" }}
          alt="Melanoma"
          src={`data:image/png;base64, ${image}`}
        />
      </div>
    </div>
  );
};

export default PatientClassification;
