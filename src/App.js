import React, { useState, useEffect } from "react";
import MainPanel from "layouts/MainPanel";
import SideBar from "layouts/SideBar";

const { ipcRenderer } = window.require("electron");

const App = () => {
  const [classifications, setClassifications] = useState([]);
  const [selectedTab, setSelectedTab] = useState({
    type: null,
    data: null
  });

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
    console.log("t", selectedTab);
  }, [selectedTab]);

  return (
    <>
      <SideBar
        classifications={classifications}
        setSelectedTab={setSelectedTab}
      />

      <MainPanel
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </>
  );
};

export default App;
