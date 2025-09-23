import React from "react";

import colors from "../../data/colors.json";
import ImageRenderer from "./components/ImageRender";
import FlowerDetailsPanel from "./components/FlowerDetailsPanel";

function RightPanel({ selectedFlower, selectedCategory, onUpdate, env }) {
  return (
    <div className="flex-1 min-w-0 pl-5 ml-5 bg-[#fff] flex rounded-xl">
      <div className="flex-1 min-w-0">
        <ImageRenderer
          env={env}
          name={selectedFlower.name}
          view={selectedFlower.view}
          color={selectedFlower.color}
          flowerId={selectedFlower.flowerId}
          variants={selectedFlower.variants}
          selectedCategory={selectedCategory}
        />
      </div>
      <div className="min-w-[250px] max-w-[350px] w-full">
        <FlowerDetailsPanel
          env={env}
          colors={colors}
          onUpdate={onUpdate}
          flower={selectedFlower}
        />
      </div>
    </div>
  );
}

export default RightPanel;
