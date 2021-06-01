import React from "react";
import ImportDropDown from "components/ImportDropDown";
import "styles/index.css";

const AboutPage = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="main-panel center-column">
      <h1 style={{ marginBottom: "25px" }}>About the Melanomore App</h1>

      <p>
        Melanoma is the third most common cancer in Australia, with 15,000
        diagnoses annually. This gives Australia the highest incidence of
        melanoma anywhere in the world. Melanoma is one of the deadliest cancers
        when it reaches advanced stages, however can readily be treated when
        caught in its early stages, by detecting and removing skin lesions
        through minor surgery.
      </p>

      <p>
        For this reason, people at elevated risk of melanoma, such as those who
        have had significant sunburn, have pale skin or have a family history,
        are recommended to have regular skin checks by a doctor, with suspect
        lesions being removed when identified. This process has several
        limitations:
      </p>

      <ul>
        <li>
          Doctors can mistakenly clear lesions which subsequently become cancer
        </li>
        <li>
          Doctors can unnecessarily remove lesions that are not problematic
        </li>
        <li>
          The significant cost of attending a skin cancer clinic can dissuade
          at-risk people from attending as regularly as is recommended
        </li>
      </ul>

      <p>
        To address these limitations, we have built a machine learning model
        (which is interfaced with using this app) that processes dermatoscopic
        pictures (which can be generated using smartphone attachments) and
        predicts the risk of melanoma in the imaged lesion. The desired outcome
        is to develop a tool capable of assisting clinicians in improving their
        diagnostic accuracy for suspicious lesions and to remove barriers to
        entry for a wider range of clinicians to conduct skin checks.
      </p>

      <p>Begin importing and classifying skin imaging using the dropdown below:</p>

      <ImportDropDown
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </div>
  );
};

export default AboutPage;
