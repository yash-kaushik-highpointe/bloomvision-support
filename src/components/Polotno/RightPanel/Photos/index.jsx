import { useState } from "react";

import CategoryDropdown from "../../../Dropdown";
import categories from "../../../../data/flowerCategories.json";

function Photos() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  const handleCategoryChange = (...args) => {
    setSelectedCategory(...args);
  };

  return (
    <div className="w-full">
      <CategoryDropdown
        className="mt-1"
        bgColor="#e3e6d3"
        options={categories}
        value={selectedCategory}
        onChange={handleCategoryChange}
      />
      <hr className="w-[calc(100%+1rem)] -mx-2 my-3 border-t-2 border-[#cdd1bc]" />
    </div>
  );
}

export default Photos;
