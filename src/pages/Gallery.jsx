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
      <div className="h-full flex items-center">
        <div className="w-[242px] bg-[#e3e6d3] flex flex-col items-start pt-6 pb-6 px-6 rounded-tr-2xl rounded-br-2xl box-border mt-2 mb-2 h-[95%]">
          <div className="w-full">
            <CategoryDropdown
              options={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
          <hr className="w-[calc(100%+3rem)] -mx-6 my-6 border-t-2 border-[#cdd1bc]" />
          <FlowerList
            images={images}
            loading={loading}
            onSelect={setSelectedFlower}
            selectedId={selectedFlower?.id}
          />
        </div>
      </div>
      {/* Right Panel */}
      {selectedFlower && (
        <RightPanel
          selectedFlower={selectedFlower}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
}

export default Gallery;
