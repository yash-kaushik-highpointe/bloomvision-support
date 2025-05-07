import React from "react";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 ml-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const TabList = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  showCloseIcon = true,
  className = "",
}) => {
  return (
    <div
      className={`flex overflow-x-auto border-b border-gray-200 ${className}`}
    >
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`px-4 py-2 font-medium flex items-center cursor-pointer ${
            activeTab === tab.id
              ? "border-b-2 border-[#827a3a] text-[#827a3a]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange(tab.id)}
          title={tab.label}
        >
          {tab.id === "upload" ? tab.label.toUpperCase() : tab.label}
          {showCloseIcon && tab.id !== "upload" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="ml-2"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabList;
