import React, { useState, useEffect } from "react";

const TemplateRecipeUI = ({
  multiplier,
  displayDataList,
  onMultiplierChange,
}) => {
  const [localMultiplier, setLocalMultiplier] = useState(multiplier);

  useEffect(() => {
    setLocalMultiplier(multiplier);
  }, [multiplier]);

  const handleMultiplierChange = (category, value) => {
    const newMultiplier = {
      ...localMultiplier,
      [category]: Math.max(1, value),
    };
    setLocalMultiplier(newMultiplier);
    onMultiplierChange?.(newMultiplier);
  };

  const incrementMultiplier = (category) => {
    handleMultiplierChange(category, (localMultiplier[category] || 1) + 1);
  };

  const decrementMultiplier = (category) => {
    handleMultiplierChange(category, (localMultiplier[category] || 1) - 1);
  };

  const formatCategoryName = (category) => {
    return category
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="h-[500px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="space-y-6">
        {displayDataList.map((categoryData, categoryIndex) => (
          <div
            key={categoryIndex}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {formatCategoryName(categoryData.category)}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  <small>Multiplier : </small>
                </span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => decrementMultiplier(categoryData.category)}
                    className="px-3 py-1 text-gray-600 border-r border-gray-300 transition-colors focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                    disabled={
                      (localMultiplier[categoryData.category] || 1) <= 1
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="text-gray-600 w-14 text-center">
                    {localMultiplier[categoryData.category] || 1}
                  </span>
                  <button
                    onClick={() => incrementMultiplier(categoryData.category)}
                    className="px-3 py-1 text-gray-600 border-l border-gray-300 transition-colors focus:outline-none focus:ring-0"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div>
              {categoryData.flowers.map((flower, flowerIndex) => (
                <div
                  key={flowerIndex}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md bg-white"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: flower.color }}
                      title={flower.color}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {flower.flowerName}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <small>Total Quantity :</small>
                      <span className="font-semibold text-gray-900 mb-[1px]">
                        {flower.quantity *
                          (localMultiplier[categoryData.category] || 1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        <small>(base: {flower.quantity})</small>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateRecipeUI;
