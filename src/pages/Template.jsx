import React from "react";
import { Toolbar } from "polotno/toolbar/toolbar";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { DownloadButton } from "polotno/toolbar/download-button";
import { PolotnoContainer, WorkspaceWrap } from "polotno";

import saveIcon from "../assets/save.svg";
import RightPanel from "../components/Polotno/RightPanel";

import "../assets/polotno.css";
import "@blueprintjs/core/lib/css/blueprint.css";

const store = createStore({
  key: "NxzKWGh2oQbD1TfLG5VB",
  showCredit: true,
});

store.addPage();

const ActionControls = ({ store }) => {
  const handleSave = () => {
    const imageElements = store.pages.flatMap((page) =>
      page.children.filter((el) => el.type === "image")
    );

    // Extract relevant properties
    const imageData = imageElements.map((image) => ({
      name: image.name,
      id: image.id,
      src: image.src, // image source URL
      x: image.x, // x position
      y: image.y, // y position
      width: image.width,
      height: image.height,
      rotation: image.rotation,
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      opacity: image.opacity,
      pageId: image.page?.id, // if you want to track which page
    }));

    console.log(imageData);
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

const Editor = () => {
  return (
    <PolotnoContainer className="p-5">
      <RightPanel store={store} />
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
