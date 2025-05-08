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

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4 ml-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const TabList = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  showCloseIcon = true,
  className = "",
  files = [],
}) => {
  const truncateText = (text) => {
    if (text.length <= 22) return text;
    return text.slice(0, 22) + "...";
  };

  const getFileData = (fileId) => {
    return files.find((fileData) => fileData.file.name === fileId);
  };

  return (
    <div
      className={`flex overflow-x-auto border-b border-gray-200 ${className}`}
    >
      {tabs.slice(1).map((tab) => {
        const fileData = getFileData(tab.label);
        const isSaving = fileData?.isSaving;

        return (
          <div
            key={tab.id}
            className={`px-4 py-2 font-medium flex justify-between items-center cursor-pointer min-w-[250px] ${
              activeTab === tab.id
                ? "border-b-2 border-[#827a3a] text-[#827a3a]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            {tab.id === "upload"
              ? tab.label.toUpperCase()
              : truncateText(tab.label)}
            {showCloseIcon && tab.id !== "upload" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="ml-2"
                disabled={isSaving}
              >
                {isSaving ? <LoadingSpinner /> : <CloseIcon />}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabList;
