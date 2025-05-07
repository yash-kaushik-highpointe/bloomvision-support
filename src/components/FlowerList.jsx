import React, { useState } from "react";

const ErrorSVG = () => (
  <svg
    className="w-8 h-8 text-red-500 mb-2"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
);

function FlowerList({ images, loading, onSelect, selectedId }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-[calc(100%-75px)]">
      <div className="w-[208px] sticky top-0 z-1 bg-[#e3e6d3] pb-3">
        <input
          type="text"
          placeholder="Search flowers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-[#f8faf3] border-none focus:outline-none focus:ring-2 focus:ring-[#e3e6d3] text-gray-900 placeholder-gray-500 text-m"
        />
      </div>
      <div className="flex flex-col gap-3 w-full overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40 w-full">
            <div className="w-8 h-8 border-4 border-[#cdd1bc] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className={`bg-white rounded-2xl shadow-md w-[208px] flex flex-col items-center p-0 cursor-pointer ${
                  selectedId === img.id ? "border-2 border-blue-400" : ""
                }`}
                onClick={() => onSelect && onSelect(img)}
              >
                <div className="flex justify-center relative w-full">
                  <img
                    src={img.image}
                    alt={img.name}
                    className={`h-[180px] w-[180px] object-contain rounded-[10px] bg-[#e3e6d3] mt-[13px] ${
                      img.dirtyMessage ? "filter blur-sm" : ""
                    }`}
                  />
                  {!!img.dirtyMessage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <ErrorSVG />
                      <span className="text-xs text-red-600 text-center bg-white/80 px-2 py-1 rounded font-medium">
                        {img.dirtyMessage}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center w-full px-4 py-3">
                  <span
                    className="font-semibold text-base text-gray-900 truncate flex-1 mr-3"
                    title={img.name}
                  >
                    {img.name}
                  </span>
                  <span
                    className="w-[20px] h-[20px] rounded-full border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: img.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  o;
}

export default FlowerList;
