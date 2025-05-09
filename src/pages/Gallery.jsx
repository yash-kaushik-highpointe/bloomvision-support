import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FlowerList from "../components/FlowerList";
import categories from "../data/flowerCategories.json";
import GalleryService from "../services/flowerService";
import RightPanel from "../components/GalleryRightPanel";
import CategoryDropdown from "../components/Dropdown";

function Gallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCategoryChange = (...args) => {
    setSelectedCategory(...args);
    setSelectedFlower(null);
  };

  const handleFlowerUpdate = (updatedFlower, isNewView2) => {
    const searchKey = isNewView2 ? "flowerId" : "id";
    const searchValue = isNewView2 ? updatedFlower.flowerId : updatedFlower.id;

    setSelectedFlower(updatedFlower);

    setImages((prevImages) => {
      const newImages = [...prevImages];
      const index = newImages.findIndex(
        (flower) => flower[searchKey] === searchValue
      );

      if (index === -1) return prevImages;

      if (isNewView2) {
        newImages[index].dirtyMessage = "";
        updatedFlower.dirtyMessage = "";

        // Insert before or after based on view
        if (updatedFlower.view === "view_1")
          newImages.splice(index, 0, updatedFlower);
        else if (updatedFlower.view === "view_2")
          newImages.splice(index + 1, 0, updatedFlower);
      } else {
        newImages[index] = updatedFlower;
      }

      return newImages;
    });
  };

  const handleFlowerDelete = (deletedFlower) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const index = newImages.findIndex(
        (flower) => flower.id === deletedFlower.id
      );

      if (index === -1) return prevImages;

      // Remove the deleted flower
      newImages.splice(index, 1);

      // Update dirtyMessage for related flowers
      newImages.forEach((flower) => {
        if (flower.flowerId === deletedFlower.flowerId) {
          if (deletedFlower.view === "view_1") {
            flower.dirtyMessage = "View 1 missing";
          } else if (deletedFlower.view === "view_2") {
            flower.dirtyMessage = "View 2 missing";
          }
        }
      });

      return newImages;
    });

    setIsDeleting(false);
    setSelectedFlower(null);
  };

  useEffect(() => {
    setLoading(true);
    GalleryService.getImagesByCategory(selectedCategory)
      .then((imgs) => setImages(imgs))
      .catch((_) => toast.error("Failed to fetch Images"))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="flex h-full">
      {/* Full screen loader */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <button
        onClick={() => navigate("/upload")}
        className="fixed top-4 right-4 bg-[#827a3a] hover:bg-[#827a3a] text-white px-4 py-2 rounded-lg shadow-md transition-colors z-10"
      >
        Add New Images
      </button>
      {/* Left Panel */}
      <div className="fixed left-[20px] top-0 h-full flex items-center">
        <div className="w-[242px] bg-[#e3e6d3] flex flex-col items-start pt-4 pb-4 px-4 rounded-2xl rounded-br-2xl box-border mt-2 mb-2 h-[95%]">
          <div className="w-full">
            <CategoryDropdown
              options={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
          <hr className="w-[calc(100%+2rem)] -mx-4 my-4 border-t-2 border-[#cdd1bc]" />
          <FlowerList
            images={images}
            loading={loading}
            onSelect={setSelectedFlower}
            selectedId={selectedFlower?.id}
            onDelete={handleFlowerDelete}
            setIsDeleting={setIsDeleting}
          />
        </div>
      </div>
      {selectedFlower && (
        <RightPanel
          selectedFlower={selectedFlower}
          selectedCategory={selectedCategory}
          onUpdate={handleFlowerUpdate}
        />
      )}
    </div>
  );
}

export default Gallery;
