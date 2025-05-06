import { toast } from "react-toastify";
import React, { useState, useRef, useEffect, useMemo } from "react";

import Dropdown from "../../Dropdown";
import GalleryService from "../../../services/flowerService";

function FlowerDetailsPanel({ flower, colors, onImageChange, onUpdate }) {
  const fileInputRef = useRef();

  const [touched, setTouched] = useState(false);
  const [name, setName] = useState(flower.name);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [color, setColor] = useState(flower.color);
  const [image, setImage] = useState(flower.image);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setTouched(true);
    setIsSaved(false);
  };

  const handleColorChange = (val) => {
    setColor(val);
    setTouched(true);
    setIsSaved(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
        setTouched(true);
        setIsSaved(false);
        if (onImageChange) onImageChange(ev.target.result);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleReupload = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedFlower = await GalleryService.updateImage(flower.id, {
        name,
        color,
        image,
        view: flower.view,
      });
      setTouched(false);
      setIsSaving(false);
      setIsSaved(true);
      onUpdate?.(updatedFlower);
    } catch (_) {
      toast.error("Error updating flower details");
      setIsSaving(false);
      setIsSaved(false);
    }
  };

  const isEditDisabled = useMemo(() => flower?.view === "view_2", [flower]);

  const getButtonText = useMemo(() => {
    if (isSaving) return `Saving...`;

    if (isSaved) return "Saved";

    return "Save";
  }, [isSaving, isSaved]);

  useEffect(() => {
    setTouched(false);
    setName(flower.name);
    setColor(flower.color);
    setImage(flower.image);
    setIsSaved(false);
  }, [flower.id]);

  useEffect(() => {
    if (touched) setIsSaved(false);
  }, [touched]);

  return (
    <div className="h-full flex items-center">
      <div className="w-[350px] bg-[#e3e6d3] rounded-tl-2xl rounded-bl-2xl p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6">Flower Details</h2>
        {/* Name */}
        <div className="w-full mb-4">
          <label className="text-xs font-semibold mb-1 block">Name</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-[#f8faf3] disabled:opacity-65 disabled:text-gray-500 disabled:text-base"
            value={name}
            onChange={handleNameChange}
            disabled={isEditDisabled}
          />
        </div>
        {/* Color */}
        <div className="w-full mb-4">
          <label className="text-xs font-semibold mb-1 block">Color</label>
          <Dropdown
            value={color}
            options={colors}
            onChange={handleColorChange}
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
        {/* Re-upload Flower */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-base font-semibold"
          onClick={handleReupload}
          type="button"
        >
          Re-upload Flower
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <hr className="w-[calc(100%+3rem)] -mx-6 my-6 border-t-2 border-[#cdd1bc]" />
        <button
          className="w-full bg-green-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition text-base font-semibold"
          onClick={handleSave}
          disabled={!touched || isSaving || isSaved}
        >
          {getButtonText}
        </button>
      </div>
    </div>
  );
}

export default FlowerDetailsPanel;
