import React, { useState } from "react";
import deleteIcon from "../assets/delete.svg";
import GalleryService from "../services/flowerService";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const ErrorSVG = () => (
  <svg
    className="w-8 h-8 text-red-500 mb-2"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

function FlowerList({
  images,
  loading,
  onSelect,
  selectedId,
  onDelete,
  setIsDeleting,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFlowerToDelete, setSelectedFlowerToDelete] = useState(null);

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (e, img) => {
    e.stopPropagation(); // Prevent triggering the flower selection
    setSelectedFlowerToDelete(img);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (substituteFlowerId) => {
    if (!selectedFlowerToDelete) return;

    setIsDeleting(true);
    setDeletingId(selectedFlowerToDelete.id);
    try {
      await GalleryService.deleteImage(
        selectedFlowerToDelete.id,
        substituteFlowerId
      );
      onDelete(selectedFlowerToDelete);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setDeletingId(null);
      setIsDeleteModalOpen(false);
      setSelectedFlowerToDelete(null);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100%-75px)]">
      <div className="w-[208px] sticky top-0 z-1 bg-[#e3e6d3] pb-3">
        <input
          type="text"
          placeholder="Search flowers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-[#f8faf3] border-none focus:outline-none focus:ring-2 focus:ring-[#e3e6d3] text-gray-900 placeholder-gray-500 text-m"
        />
      </div>
      <div className="flex flex-col gap-3 w-full overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40 w-full">
            <div className="w-8 h-8 border-4 border-[#cdd1bc] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className={`bg-white rounded-2xl shadow-md w-[208px] flex flex-col items-center p-0 cursor-pointer relative ${
                  selectedId === img.id ? "border-2 border-blue-400" : ""
                }`}
                onClick={() => onSelect && onSelect(img)}
              >
                <button
                  onClick={(e) => handleDelete(e, img)}
                  className="absolute top-1 right-1 z-[9] p-1.5 bg-white rounded-full"
                  disabled={deletingId === img.id}
                >
                  <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                </button>
                <div className="flex justify-center relative w-full">
                  <img
                    src={img.image}
                    alt={img.name}
                    className={`h-[180px] w-[180px] object-contain rounded-[10px] bg-[#e3e6d3] mt-[13px] ${
                      img.dirtyMessage ? "filter blur-sm" : ""
                    }`}
                  />
                  {!!img.dirtyMessage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-1">
                      <ErrorSVG />
                      <span className="text-xs text-red-600 text-center bg-white/80 px-2 py-1 rounded font-medium">
                        {img.dirtyMessage}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center w-full px-4 py-3">
                  <span
                    className="font-semibold text-base text-gray-900 truncate flex-1 mr-3"
                    title={img.name}
                  >
                    {img.name}
                  </span>
                  <span
                    className="w-[20px] h-[20px] rounded-full border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: img.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedFlowerToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        images={images}
        selectedFlower={selectedFlowerToDelete}
      />
    </div>
  );
}

export default FlowerList;
