import React, { useState } from "react";

import { getPhotoStyles } from "../../utils";

function PhotosList({ loading, images, selectedCategory }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredImages = images?.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-[calc(100%-75px)]">
      <div className="w-full sticky top-0 z-1 pb-3">
        <input
          type="text"
          placeholder="Search flowers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[40px] px-3 py-1 rounded-lg bg-[#e3e6d3] border-none focus:outline-none focus:ring-2 focus:ring-[#e3e6d3] text-gray-900 text-[1rem]"
        />
      </div>
      <div className="flex flex-col gap-3 w-full overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40 w-full">
            <div className="w-8 h-8 border-4 border-[#cdd1bc] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full mb-4 overflow-y-auto">
            {filteredImages?.map((img) => (
              <div
                key={img.id}
                className="relative bg-white rounded-2xl flex flex-col items-center p-0 cursor-pointer overflow-hidden group"
                style={getPhotoStyles(selectedCategory)}
              >
                <img
                  src={img.image}
                  alt={img.name}
                  className="h-full w-full object-cover rounded-2xl bg-[#e3e6d3] transition-all duration-300"
                />
                <div className="absolute left-0 right-0 bottom-0 h-[40%] bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl">
                  <span
                    className="text-white font-semibold text-base mb-2 px-2 truncate w-full text-center"
                    title={img.name}
                  >
                    {img.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotosList;
