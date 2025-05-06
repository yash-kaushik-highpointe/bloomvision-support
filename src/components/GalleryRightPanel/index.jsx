import React, { useState } from "react";

import colors from "../../data/colors.json";
import ImageRenderer from "./components/ImageRender";
import FlowerDetailsPanel from "./components/FlowerDetailsPanel";

function RightPanel({ selectedFlower, selectedCategory, onUpdate }) {
  const [image, setImage] = useState(selectedFlower?.image);

  React.useEffect(() => {
    setImage(selectedFlower?.image);
  }, [selectedFlower]);

  return (
    <div className="flex-1 bg-[#fafbfc] flex flex-row">
      <ImageRenderer
        name={selectedFlower.name}
        image={image}
        selectedCategory={selectedCategory}
      />
      <FlowerDetailsPanel
        colors={colors}
        onUpdate={onUpdate}
        onImageChange={setImage}
        flower={{ ...selectedFlower, image }}
      />
    </div>
  );
}

export default RightPanel;
