import { toast } from "react-toastify";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import Dropdown from "../../Dropdown";
import GalleryService from "../../../services/flowerService";

import { CONFIG } from "../../../App";

function FlowerDetailsPanel({ flower, colors, onImageChange, onUpdate, env }) {
  const fileInputRef = useRef();
  const view2InputRef = useRef();

  const [formState, setFormState] = useState({
    name: flower.name,
    color: flower.color,
    image: flower.image,
    touched: false,
    isSaved: false,
    isSaving: false,
    isDirtyUpload: false,
  });

  const isEditDisabled = useMemo(() => flower?.view === "view_2", [flower]);

  const handleInputChange = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      touched: true,
      isSaved: false,
    }));
  }, []);

  const handleFileChange = useCallback(
    (e, isDirty = false) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFormState((prev) => ({
            ...prev,
            image: ev.target.result,
            touched: true,
            isSaved: false,
            isDirtyUpload: isDirty,
          }));
          if (onImageChange) onImageChange(ev.target.result);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
      }
    },
    [onImageChange]
  );

  const handleSave = useCallback(async () => {
    try {
      setFormState((prev) => ({ ...prev, isSaving: true }));

      const updateData = {
        image: formState.image,
        view: formState.isDirtyUpload
          ? flower.dirtyMessage === "View 1 missing"
            ? "view_1"
            : "view_2"
          : flower.view,
        name: formState.isDirtyUpload ? flower.name : formState.name,
        color: formState.isDirtyUpload ? flower.color : formState.color,
      };

      const updatedFlower = formState.isDirtyUpload
        ? await GalleryService(CONFIG[env]).uploadDirtyView(
            flower.flowerId,
            updateData
          )
        : await GalleryService(CONFIG[env]).updateImage(flower.id, updateData);

      setFormState((prev) => ({
        ...prev,
        touched: false,
        isSaving: false,
        isSaved: true,
        isDirtyUpload: false,
      }));

      onUpdate?.(updatedFlower, formState.isDirtyUpload);
    } catch (_) {
      toast.error("Error updating flower details");
      setFormState((prev) => ({
        ...prev,
        isSaving: false,
        isSaved: false,
      }));
    }
  }, [formState, flower, onUpdate]);

  useEffect(() => {
    setFormState({
      name: flower.name,
      color: flower.color,
      image: flower.image,
      touched: false,
      isSaved: false,
      isSaving: false,
      isDirtyUpload: false,
    });
  }, [flower.id]);

  const buttonText = useMemo(() => {
    if (formState.isSaving) return "Saving...";
    if (formState.isSaved) return "Saved";
    return formState.isDirtyUpload
      ? flower.dirtyMessage === "View 1 missing"
        ? "Save View 1"
        : "Save View 2"
      : "Save";
  }, [formState.isSaving, formState.isSaved, formState.isDirtyUpload]);

  return (
    <div className="h-full w-full flex p-6">
      <div className="p-6 pr-0 flex flex-col justify-between border-l-[1px] border-[#e3e6d3] w-full">
        <div className="w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Flower Details</h2>

          {/* Name */}
          <div className="w-full mb-4">
            <label className="text-xs font-semibold mb-1 block">Name</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-[#f8faf3] disabled:opacity-65 disabled:text-gray-500 disabled:text-base"
              value={formState.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isEditDisabled}
            />
          </div>
          {/* Color */}
          <div className="w-full mb-4">
            <label className="text-xs font-semibold mb-1 block">Color</label>
            <Dropdown
              value={formState.color}
              options={colors}
              onChange={(val) => handleInputChange("color", val)}
              isDisabled={isEditDisabled}
            />
          </div>

          {/* View */}
          <div className="w-full mb-4">
            <label className="text-xs font-semibold mb-1 block">View</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 bg-[#f8faf3] disabled:opacity-65 disabled:text-gray-500 disabled:text-base"
              value={flower.view}
              disabled
            />
          </div>
        </div>
        <div>
          {/* Re-upload Flower */}
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-base font-semibold mb-2"
            onClick={() => fileInputRef.current.click()}
            type="button"
          >
            Re-upload Flower
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, false)}
          />

          {/* Upload View 2 Button */}
          {flower.dirtyMessage && (
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-base font-semibold mb-2"
              onClick={() => view2InputRef.current.click()}
              type="button"
            >
              {flower.dirtyMessage === "View 1 missing"
                ? "Upload View 1 of Flower"
                : "Upload View 2 of Flower"}
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={view2InputRef}
            onChange={(e) => handleFileChange(e, true)}
          />

          <button
            className="w-full bg-green-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition text-base font-semibold"
            onClick={handleSave}
            disabled={
              !formState.touched || formState.isSaving || formState.isSaved
            }
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlowerDetailsPanel;
