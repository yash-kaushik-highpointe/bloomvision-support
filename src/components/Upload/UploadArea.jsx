import React, { useCallback } from "react";

const UploadArea = ({
  onFilesSelect,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  className = "",
}) => {
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    onFilesSelect(selectedFiles);
    event.target.value = "";
  };

  const handleButtonClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center h-full flex items-center justify-center ${
        isDragging ? "border-[#827a3a] bg-[#827a3a]/10" : "border-gray-300"
      } ${className}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="space-y-4">
        <p className="text-gray-600">Drag and drop your images here, or</p>
        <label className="inline-block">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <button
            className="bg-[#827a3a] text-white px-4 py-2 rounded-lg hover:bg-[#827a3a]/90 transition-colors"
            onClick={handleButtonClick}
          >
            Upload Images
          </button>
        </label>
      </div>
    </div>
  );
};

export default UploadArea;
