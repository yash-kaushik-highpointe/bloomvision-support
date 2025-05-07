import React from "react";
import Dropdown from "../Dropdown";
import categories from "../../data/flowerCategories.json";

const FlowerDetails = ({
  onSave,
  colors,
  isSaving,
  formData,
  onInputChange,
}) => {
  return (
    <div className="h-full flex items-center">
      <div className="w-[350px] bg-[#e3e6d3] rounded-2xl rounded-bl-2xl p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6">Flower Details</h2>

        {/* Category */}
        <div className="w-full mb-4">
          <label className="text-xs font-semibold mb-1 block">Category</label>
          <Dropdown
            value={formData.category}
            options={categories}
            onChange={(val) => onInputChange("category", val)}
          />
        </div>

        {/* Name */}
        <div className="w-full mb-4">
          <label className="text-xs font-semibold mb-1 block">Name</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-[#f8faf3]"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="Enter flower name"
          />
        </div>

        {/* Color */}
        <div className="w-full mb-4">
          <label className="text-xs font-semibold mb-1 block">Color</label>
          <Dropdown
            value={formData.color}
            options={colors}
            onChange={(val) => onInputChange("color", val)}
          />
        </div>

        {/* View */}
        <div className="w-full mb-4">
          <label className="text-xs font-semibold mb-1 block">View</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 bg-[#f8faf3] disabled:opacity-65 disabled:text-gray-500 disabled:text-base"
            value="view_1"
            disabled
          />
        </div>

        <hr className="w-[calc(100%+3rem)] -mx-6 my-6 border-t-2 border-[#cdd1bc]" />

        <button
          className="w-full bg-green-500 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition text-base font-semibold"
          onClick={onSave}
          disabled={
            isSaving || !formData.name || !formData.category || !formData.color
          }
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default FlowerDetails;
