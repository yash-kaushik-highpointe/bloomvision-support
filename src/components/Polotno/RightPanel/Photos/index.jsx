import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PhotosList from "./PhotosList";
import CategoryDropdown from "../../../Dropdown";
import categories from "../../../../data/flowerCategories.json";

import { fetchFlowersByCategory } from "../../../../store/slices/flowersSlice";

function Photos() {
  const dispatch = useDispatch();

  const { flowersByCategory, loading } = useSelector((state) => state.flowers);

  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  const handleCategoryChange = (...args) => {
    setSelectedCategory(...args);
  };

  useEffect(() => {
    if (!flowersByCategory[selectedCategory]) {
      dispatch(fetchFlowersByCategory(selectedCategory))
        .unwrap()
        .catch((_) => toast.error("Failed to fetch Photos"));
    }
  }, [selectedCategory, dispatch, flowersByCategory]);

  return (
    <div className="w-full h-full">
      <CategoryDropdown
        className="mt-1"
        bgColor="#e3e6d3"
        options={categories}
        value={selectedCategory}
        onChange={handleCategoryChange}
      />
      <hr className="w-[calc(100%+1rem)] -mx-2 my-3 border-t-2 border-[#cdd1bc]" />
      <PhotosList
        loading={loading}
        selectedCategory={selectedCategory}
        images={flowersByCategory[selectedCategory]}
      />
    </div>
  );
}

export default Photos;
