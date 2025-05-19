import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FlowerList from "../components/FlowerList";
import categories from "../data/flowerCategories.json";
import RightPanel from "../components/GalleryRightPanel";
import CategoryDropdown from "../components/Dropdown";
import {
  fetchFlowersByCategory,
  deleteFlower,
  updateFlower,
} from "../store/slices/flowersSlice";

const isOnceFetched = categories.reduce((acc, { id }) => {
  acc[id] = false;
  return acc;
}, {});

function Gallery() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  const { flowersByCategory, loading } = useSelector((state) => state.flowers);

  const images = flowersByCategory[selectedCategory] || [];

  const handleCategoryChange = (...args) => {
    setSelectedCategory(...args);
    setSelectedFlower(null);
  };

  const handleFlowerUpdate = async (updatedFlower, isNewView) => {
    try {
      dispatch(
        updateFlower({
          ...updatedFlower,
          category: selectedCategory,
          isNewView,
        })
      );
      setSelectedFlower(updatedFlower);
    } catch (error) {
      toast.error("Failed to update flower");
    }
  };

  const handleFlowerDelete = async (deletedFlower) => {
    try {
      dispatch(deleteFlower({ ...deletedFlower, category: selectedCategory }));
      setIsDeleting(false);
      setSelectedFlower(null);
    } catch (error) {
      toast.error("Failed to delete flower");
    }
  };

  useEffect(() => {
    if (
      !flowersByCategory[selectedCategory] ||
      !isOnceFetched[selectedCategory]
    ) {
      isOnceFetched[selectedCategory] = true;
      dispatch(fetchFlowersByCategory(selectedCategory))
        .unwrap()
        .catch((_) => toast.error("Failed to fetch Images"));
    }
  }, [selectedCategory, dispatch, flowersByCategory]);

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
      <div className="h-full w-[242px]" />
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
