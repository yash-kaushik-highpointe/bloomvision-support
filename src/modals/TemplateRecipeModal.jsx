import { toast } from "react-toastify";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "../components/Dialog";
import TemplateService from "../services/template";
import TemplateRecipeUI from "../components/TemplateRecipeUI";

import {
  saveTemplateDetails,
  fetchTemplateDetails,
} from "../store/slices/polotnoSlice";
import { CONFIG } from "../App";
import { getDisplayListAndMultiplier } from "../utils/helper";

const Loading = () => (
  <div className="flex justify-center items-center h-[200px]">
    <svg
      className="animate-spin h-7 w-7 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="#000"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="#000"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p className="text-lg font-bold ms-4">Loading...</p>
  </div>
);

const Saving = () => (
  <>
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    Saving...
  </>
);

function TemplateRecipeModal({ isOpen, onClose, data, env }) {
  const dispatch = useDispatch();

  const { templates, loading } = useSelector((state) => state.polotno);

  const [isDirty, setIsDirty] = useState(false);
  const [multiplier, setMultiplier] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [displayDataList, setDisplayDataList] = useState([]);

  const templateData = useMemo(() => {
    return templates?.[data?.id];
  }, [templates, data?.id]);

  const shouldFetch = useMemo(() => {
    return data?.id && env && isOpen && !templateData;
  }, [data?.id, env, isOpen, templateData]);

  const clearState = () => {
    setIsDirty(false);
    setMultiplier({});
    setDisplayDataList([]);
  };

  const handleCancel = () => {
    clearState();
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      let response = await TemplateService(CONFIG[env]).saveTemplateDetails(
        data.id,
        {
          multiplier,
        }
      );
      dispatch(saveTemplateDetails({ templateId: data.id, data: response }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to save Template Recipe");
    } finally {
      setIsLoading(false);
      clearState();
      onClose();
    }
  };

  const handleMultiplierChange = (newMultiplier) => {
    setMultiplier(newMultiplier);
    setIsDirty(true);
  };

  useEffect(() => {
    if (templateData) {
      let { multiplierData, displayData } =
        getDisplayListAndMultiplier(templateData);

      setMultiplier(multiplierData);
      setDisplayDataList(displayData);
    }
  }, [templateData]);

  useEffect(() => {
    if (shouldFetch)
      dispatch(
        fetchTemplateDetails({ templateId: data.id, baseURL: CONFIG[env] })
      );
  }, [shouldFetch, dispatch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-2xl bg-white"
        aria-describedby="recipe-modal"
      >
        <DialogHeader>
          <DialogTitle>{`${data?.name} Recipe`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          {loading || displayDataList.length === 0 ? (
            <Loading />
          ) : (
            <TemplateRecipeUI
              displayDataList={displayDataList}
              multiplier={multiplier}
              onMultiplierChange={handleMultiplierChange}
            />
          )}
          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#7a7a3a] disabled:opacity-50 flex items-center gap-2"
              onClick={handleConfirm}
              disabled={!isDirty || isLoading}
            >
              {isLoading ? <Saving /> : "Save Changes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateRecipeModal;
