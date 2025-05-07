import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";

import FlowerList from "../components/FlowerList";
import categories from "../data/flowerCategories.json";
import GalleryService from "../services/flowerService";
import RightPanel from "../components/GalleryRightPanel";
import CategoryDropdown from "../components/Dropdown";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

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
        newImages.splice(index + 1, 0, updatedFlower);
      } else {
        newImages[index] = updatedFlower;
      }

      return newImages;
    });
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
