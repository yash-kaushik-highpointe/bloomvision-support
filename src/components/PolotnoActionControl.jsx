import SaveButton from "./SaveButton";

import { getTemplatePayload } from "./Polotno/utils";

const ActionControls =
  ({ saveTemplateDetails, isSaving, isStoreChanged }) =>
  ({ store }) => {
    const handleSave = async () => {
      const payload = getTemplatePayload(store);
      await saveTemplateDetails(payload);
    };

    return (
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !isStoreChanged}
          className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SaveButton isSaving={isSaving} />
        </button>
      </div>
    );
  };

export default ActionControls;
