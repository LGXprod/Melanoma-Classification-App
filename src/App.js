import React, { useState, useEffect } from "react";
import MainPanel from "layouts/MainPanel";
import SideBar from "layouts/SideBar";

const { ipcRenderer } = window.require("electron");

const App = () => {
  const [classifications, setClassifications] = useState([]);
  const [selectedTabData, setSelectedTabData] = useState();
  const [showAboutPage, setShowAboutPage] = useState(false);

  useEffect(() => {
    ipcRenderer.send("classifications:initialLoad");

    ipcRenderer.on("classifications:initialLoad", (event, classifications) => {
      console.log(classifications);
      setClassifications(classifications);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on("patientClassification:added", (event, classification) => {
      console.log("num", classifications.length);
      setClassifications([...classifications, classification]);
    });
  }, [classifications]);

  useEffect(() => {
    console.log("t", selectedTabData);
  }, [selectedTabData]);

  return (
    <>
      <SideBar
        classifications={classifications}
        setSelectedTabData={setSelectedTabData}
        setShowAboutPage={setShowAboutPage}
      />

      <MainPanel
        selectedTabData={selectedTabData}
        showAboutPage={showAboutPage}
      />
    </>
  );
};

export default App;
