import React, { useEffect } from "react";
import ImportDropDown from "components/ImportDropDown";

const PatientClassification = ({
  classification,
  selectedTab,
  setSelectedTab,
}) => {
  console.log(classification);
  const { name, age, sex, imageLocation, isMalignant, probability, image } =
    classification;

  useEffect(() => {
    console.log("here", selectedTab)
  }, [selectedTab]);

  return (
    <div style={{ height: "100%" }}>
      <div style={{ float: "right" }}>
        <ImportDropDown
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>

      <div className="full-width center-column patient-tab">
        <h1>Patient name: {name}</h1>

        <div className="center-column patient-data">
          <h3>Age: {age}</h3>
          <h3>Biological sex: {sex}</h3>
          <h3>Location of imaged site: {imageLocation}</h3>
          <h3>
            Classification: {isMalignant ? "Malignant" : "Benign"} (Probability
            = {probability}%)
          </h3>

          <img
            style={{ marginTop: "25px", width: "75%" }}
            alt="Melanoma"
            src={`data:image/png;base64, ${image}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientClassification;
