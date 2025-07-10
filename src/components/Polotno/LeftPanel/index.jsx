import React from "react";
import { SidePanelWrap } from "polotno";
import { SidePanel, DEFAULT_SECTIONS } from "polotno/side-panel";
import { observer } from "mobx-react-lite";

import Photos from "./Photos";

import { filterRightPanel } from "../utils";

const LeftPanel = observer(({ store, env, templateId }) => {
  const filteredSections = filterRightPanel(DEFAULT_SECTIONS);

  const photosSectionIndex = filteredSections.findIndex(
    ({ name }) => name === "photos"
  );

  if (photosSectionIndex !== -1) {
    const PhotosWrapper = React.useMemo(() => {
      return () => <Photos store={store} env={env} templateId={templateId} />;
    }, [store, env, templateId]);

    filteredSections[photosSectionIndex].Panel = PhotosWrapper;
  }

  return (
    <SidePanelWrap className="rounded-lg mr-5">
      <SidePanel store={store} sections={filteredSections} />
    </SidePanelWrap>
  );
});

export default LeftPanel;
