import React, { useState, useEffect, Fragment } from "react";

import ImportDropDown from "components/ImportDropDown";
import LoadingModal from "components/LoadingModal";
import ProgressModal from "components/ProgressModal";
import AboutPage from "./AboutPage";

import SinglePatient from "./forms/SinglePatient";
import BatchImport from "./forms/BatchImport";

import PatientClassification from "./PatientClassification";
import BatchClassification from "./BatchClassification";

const MainPanel = ({ selectedTab, setSelectedTab }) => {
  // const [previousTab, setPreviousTab] = useState();

  // useEffect(() => {
  //   const { type } = selectedTab;

  //   if (type !== "Single Patient Form" && type !== "Batch Patient Form") {
  //     setPreviousTab(selectedTab);
  //   }
  // }, [selectedTab]);

  return (
    <>
      <div
        className={`main-panel blue`}
        style={
          selectedTab.type === "Batch Classification"
            ? { overflowY: "scroll" }
            : {}
        }
      >
        <div
          style={{ width: "100%", height: "100%" }}
          className={
            selectedTab.type === "Batch Classification" ? "" : "center-column"
          }
        >
          {(() => {
            switch (selectedTab.type) {
              case "Single Classification":
                return (
                  <PatientClassification
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    classification={selectedTab.data}
                  />
                );
              case "Batch Classification":
                return (
                  <BatchClassification
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    classification={selectedTab.data}
                  />
                );
              case "About Page":
                return (
                  <AboutPage
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  />
                );
              case "Single Patient Form":
                return <SinglePatient setSelectedTab={setSelectedTab} />;
              case "Batch Patient Form":
                return <BatchImport setSelectedTab={setSelectedTab} />;
              case "Loading Single Classification":
                return <LoadingModal />;
              case "Loading Batch Classification":
                return <ProgressModal />;
              default:
                return (
                  <Fragment>
                    <h1 style={{ marginBottom: "20px", fontSize: "40px" }}>
                      To begin detecting malignant Melanomas import a single
                      patient???s information or a batch of patient information.
                    </h1>

                    <ImportDropDown
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  </Fragment>
                );
            }
          })()}
        </div>
      </div>
    </>
  );
};

export default MainPanel;
