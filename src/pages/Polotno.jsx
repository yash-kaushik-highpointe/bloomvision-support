import React from "react";
import { Toolbar } from "polotno/toolbar/toolbar";
import { Workspace } from "polotno/canvas/workspace";
import { PolotnoContainer, WorkspaceWrap } from "polotno";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { DownloadButton } from "polotno/toolbar/download-button";

import Loading from "../components/Loading";
import saveIcon from "../assets/save.svg";
import LeftPanel from "../components/Polotno/LeftPanel";

import { None, TOOLBAR_COMPONENTS } from "../config/constants";
import { usePolotnoEditor } from "../hooks/usePolotnoEditor";
import { usePolotnoStorage } from "../hooks/usePolotnoStorage";
import { getAllImagesWithMetadata } from "../components/Polotno/utils";

import "../assets/polotno.css";
import "@blueprintjs/core/lib/css/blueprint.css";

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

function Polotno({ env }) {
  const { templateData, loading, error, templateId } = usePolotnoStorage(env);
  const { store, storeReady } = usePolotnoEditor(templateData);

  if (loading || !storeReady) return <Loading />;

  return (
    <PolotnoContainer className="p-5">
      <LeftPanel store={store} env={env} />
      <WorkspaceWrap>
        <Toolbar
          store={store}
          components={{ ...TOOLBAR_COMPONENTS, ActionControls }}
        />
        <Workspace
          store={store}
          pageControlsEnabled={false}
          components={{
            Tooltip: None,
          }}
        />
        <ZoomButtons store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
}

export default Polotno;
