import React from "react";
import { Toolbar } from "polotno/toolbar/toolbar";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { DownloadButton } from "polotno/toolbar/download-button";
import { PolotnoContainer, WorkspaceWrap } from "polotno";

import saveIcon from "../assets/save.svg";
import LeftPanel from "../components/Polotno/LeftPanel";
import { getAllImagesWithMetadata } from "../components/Polotno/utils";

import "../assets/polotno.css";
import "@blueprintjs/core/lib/css/blueprint.css";

const store = createStore({
  key: "NxzKWGh2oQbD1TfLG5VB",
  showCredit: true,
});

store.addPage();

const ActionControls = ({ store }) => {
  const handleSave = () => {
    const imageData = getAllImagesWithMetadata(store);

    const imagesByCategory = imageData.reduce((acc, image) => {
      const category = image.metadata.category || "unknown";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(image);
      return acc;
    }, {});

    console.log("Images grouped by category:", imagesByCategory);
  };

  return (
    <div className="flex gap-2">
      <button className="flex items-center gap-2" onClick={handleSave}>
        <img src={saveIcon} className="w-5 h-5" />
        Save
      </button>
      <DownloadButton store={store} />
    </div>
  );
};

const Editor = ({ env }) => {
  return (
    <PolotnoContainer className="p-5">
      <LeftPanel store={store} env={env} />
      <WorkspaceWrap>
        <Toolbar store={store} components={{ ActionControls }} />
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

export default Editor;
