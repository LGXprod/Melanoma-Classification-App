import React, { useState, useEffect } from "react";
import MainPanel from "layouts/MainPanel";
import SideBar from "layouts/SideBar";

const { ipcRenderer } = window.require("electron");

const App = () => {
  const [classifications, setClassifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState({
    type: null,
    data: null
  });

  useEffect(() => {
    ipcRenderer.send("classifications:initialLoad");

    ipcRenderer.on("classifications:initialLoad", (event, classifications) => {
      console.log("c1", classifications);
      setClassifications(classifications);
    });

    ipcRenderer.on("patientClassification:added", (event, classifications) => {
      console.log("new classification added", classifications)
      setIsLoading(false);
      setClassifications(classifications);
    });

    return;
  }, []);

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
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
    </>
  );
};

export default App;
