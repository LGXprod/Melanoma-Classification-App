import React from "react";
import LoadingAnimation from "images/loading.gif";

const LoadingModal = () => {
  return (
    <div className="form-container center-row">
      <div className="green form center-column patient-form">
        <img alt="Loading animation" src={LoadingAnimation} />
        <h1>The Deep Learning Model is now processing your patient's image to classify it as benign or malignant. This may take 1-2 minutes.</h1>
      </div>
    </div>
  );
};

export default LoadingModal;
