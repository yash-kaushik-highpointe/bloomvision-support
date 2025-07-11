import React from "react";
import { Toolbar } from "polotno/toolbar/toolbar";
import { Workspace } from "polotno/canvas/workspace";
import { PolotnoContainer, WorkspaceWrap } from "polotno";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";

import Loading from "../components/Loading";
import LeftPanel from "../components/Polotno/LeftPanel";
import ActionControls from "../components/PolotnoActionControl";

import { None, TOOLBAR_COMPONENTS } from "../config/constants";
import { usePolotnoEditor } from "../hooks/usePolotnoEditor";
import { usePolotnoStorage } from "../hooks/usePolotnoStorage";

import "../assets/polotno.css";
import "@blueprintjs/core/lib/css/blueprint.css";

function Polotno({ env }) {
  const {
    loading,
    isSaving,
    templateId,
    templateData,
    storeChanged,
    isStoreChanged,
    saveTemplateDetails,
  } = usePolotnoStorage(env);

  const { store, storeReady } = usePolotnoEditor(storeChanged, templateData);

  if (loading || !storeReady) return <Loading />;

  return (
    <PolotnoContainer className="p-5">
      <LeftPanel env={env} store={store} templateId={templateId} />
      <WorkspaceWrap>
        <Toolbar
          store={store}
          components={{
            ...TOOLBAR_COMPONENTS,
            ActionControls: ActionControls({
              isSaving,
              isStoreChanged,
              saveTemplateDetails,
            }),
          }}
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
      {isSaving && (
        <div className="absolute inset-0 z-50 bg-white/40 pointer-events-auto flex items-center justify-center" />
      )}
    </PolotnoContainer>
  );
}

export default Polotno;
