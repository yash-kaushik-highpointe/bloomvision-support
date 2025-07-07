import React from "react";
import { SidePanelWrap } from "polotno";
import { SidePanel, DEFAULT_SECTIONS } from "polotno/side-panel";

import Photos from "./Photos";

import { filterRightPanel } from "../utils";

function LeftPanel({ store, env }) {
  const filteredSections = filterRightPanel(DEFAULT_SECTIONS);

  const photosSectionIndex = filteredSections.findIndex(
    ({ name }) => name === "photos"
  );

  if (photosSectionIndex !== -1) {
    const PhotosWrapper = React.useMemo(
      (props) => {
        return () => <Photos {...props} store={store} env={env} />;
      },
      [store, env]
    );

    filteredSections[photosSectionIndex].Panel = PhotosWrapper;
  }

  return (
    <SidePanelWrap className="rounded-lg mr-5">
      <SidePanel store={store} sections={filteredSections} />
    </SidePanelWrap>
  );
}

export default LeftPanel;
