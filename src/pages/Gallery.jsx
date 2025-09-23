import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import FlowerList from "../components/FlowerList";
import CategoryDropdown from "../components/Dropdown";
import categories from "../data/flowerCategories.json";
import RightPanel from "../components/GalleryRightPanel";

import {
  deleteView,
  updateFlower,
  fetchFlowersByCategory,
} from "../store/slices/flowersSlice";

import { CONFIG } from "../App";
import { getToken } from "../utils/auth";

const isOnceFetched = categories.reduce((acc, { id }) => {
  acc[id] = false;
  return acc;
}, {});

function Gallery({ env }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRole = useMemo(() => getToken("support_role"), []);

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [images, setImages] = useState([]);

  const { flowersByCategory, loading } = useSelector((state) => state.flowers);

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
    } catch (error) {
      toast.error("Failed to update flower");
    }
  };

  const handleFlowerViewDelete = async (deletedFlower) => {
    try {
      dispatch(deleteView({ ...deletedFlower, category: selectedCategory }));
      setIsDeleting(false);
      setSelectedFlower(null);
    } catch (error) {
      toast.error("Failed to delete flower");
    }
  };

  const isEnvToggleDisabled = userRole === "admin";

  useEffect(() => {
    if (
      !flowersByCategory[selectedCategory] ||
      !isOnceFetched[selectedCategory]
    ) {
      isOnceFetched[selectedCategory] = true;
      dispatch(
        fetchFlowersByCategory({
          category: selectedCategory,
          baseUrl: CONFIG[env],
        })
      )
        .unwrap()
        .catch((_) => toast.error("Failed to fetch Images"));
    }
  }, [selectedCategory, dispatch, flowersByCategory, env]);

  useEffect(() => {
    if (images.length > 0 && selectedFlower) {
      setSelectedFlower({
        ...images.find((image) => image.key === selectedFlower.key),
      });
    }
  }, [images]);

  useEffect(() => {
    let tempImages = flowersByCategory[selectedCategory] || [];
    setImages([...tempImages]);
  }, [flowersByCategory, selectedCategory]);

  return (
    <div className="flex h-full p-5">
      {/* Full screen loader */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <button
        onClick={() => navigate("/upload")}
        className={`fixed top-4 ${
          isEnvToggleDisabled ? "right-[2rem]" : "right-[7rem]"
        } bg-[#827a3a] hover:bg-[#827a3a] text-white rounded-lg shadow-md transition-colors z-10 px-4 py-2`}
      >
        Add New Images
      </button>
      {/* Left Panel */}
      <div className="h-full w-[242px]">
        <div className="fixed left-[20px] top-0 h-full flex items-center">
          <div className="w-[242px] flex flex-col items-start py-2 px-2 rounded-2xl rounded-br-2xl box-border mt-2 h-[95%]">
            <div className="w-full mb-3">
              <CategoryDropdown
                bgColor="#fff"
                border="1px solid #e3e6d3"
                options={categories}
                value={selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>
            <FlowerList
              env={env}
              images={images}
              loading={loading}
              onSelect={setSelectedFlower}
              onDelete={handleFlowerViewDelete}
              setIsDeleting={setIsDeleting}
              selectedId={selectedFlower?.key}
            />
          </div>
        </div>
      </div>
      {/* Right Panel */}
      {selectedFlower && (
        <RightPanel
          env={env}
          onUpdate={handleFlowerUpdate}
          selectedFlower={selectedFlower}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
}

export default Gallery;
