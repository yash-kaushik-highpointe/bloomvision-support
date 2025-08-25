import React, { useState } from "react";

import colors from "../../data/colors.json";
import ImageRenderer from "./components/ImageRender";
import FlowerDetailsPanel from "./components/FlowerDetailsPanel";

function RightPanel({ selectedFlower, selectedCategory, onUpdate, env }) {
  const [image, setImage] = useState(selectedFlower?.image);

  React.useEffect(() => {
    setImage(selectedFlower?.image);
  }, [selectedFlower]);

  return (
    <div className="flex-1 flex flex-row pl-5">
      <div className="bg-[#fff] flex w-full rounded-xl">
        <ImageRenderer
          name={selectedFlower.name}
          image={image}
          selectedCategory={selectedCategory}
        />
        <FlowerDetailsPanel
          env={env}
          colors={colors}
          onUpdate={onUpdate}
          onImageChange={setImage}
          flower={{ ...selectedFlower, image }}
        />
      </div>
    </div>
  );
}

export default RightPanel;
