import React from "react";
import { SidePanelWrap } from "polotno";
import { SidePanel, DEFAULT_SECTIONS } from "polotno/side-panel";

import Photos from "./Photos";

import { filterRightPanel } from "../utils";

function RightPanel({ store }) {
  const filteredSections = filterRightPanel(DEFAULT_SECTIONS);

  const photosSectionIndex = filteredSections.findIndex(
    ({ name }) => name === "photos"
  );

  if (photosSectionIndex !== -1)
    filteredSections[photosSectionIndex].Panel = Photos;

  return (
    <SidePanelWrap className="rounded-lg mr-5">
      <SidePanel store={store} sections={filteredSections} />
    </SidePanelWrap>
  );
}

export default RightPanel;
