import SaveButton from "./SaveButton";
import { useNavigate } from "react-router-dom";

import { getTemplatePayload } from "./Polotno/utils";

const ActionControls =
  ({ saveTemplateDetails, isSaving, isStoreChanged }) =>
  ({ store }) => {
    const navigate = useNavigate();

    const handleSave = async () => {
      if (isStoreChanged) {
        const payload = getTemplatePayload(store);
        await saveTemplateDetails(payload);
        navigate("/template");
      } else {
        navigate("/template");
      }
    };

    return (
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SaveButton isSaving={isSaving} />
        </button>
      </div>
    );
  };

export default ActionControls;
