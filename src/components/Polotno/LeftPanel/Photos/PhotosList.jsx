import React, { useState } from "react";

import { getPhotoStyles } from "../../utils";

function PhotosList({ store, loading, images, selectedCategory }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredImages = images?.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageClick = (img) => {
    if (!store) return;

    // Get the current page
    const currentPage = store.selectedPage;
    if (!currentPage) return;

    // Calculate center position for the image
    const pageWidth = currentPage.width;
    const pageHeight = currentPage.height;

    // Default image dimensions
    let imageWidth = 200;
    let imageHeight = 200;

    // Adjust dimensions based on category
    const SquareComponents = {
      frame: true,
      bulk: true,
      filler: true,
      container: true,
      largeRound: true,
      smallRound: true,
      mediumRound: true,
      bouquetCollar: true,
      largeContainer: true,
      urn: false,
      stem: false,
      vase: false,
      ribbon: false,
      lateral: false,
      dancing: false,
      drapping: false,
      pedestal: false,
      largeLateral: false,
      smallDancing: false,
      largeDrapping: false,
    };

    if (SquareComponents[selectedCategory]) {
      imageWidth = 200;
      imageHeight = 200;
    } else {
      imageWidth = 150;
      imageHeight = 400;
    }

    // Calculate center position
    const x = (pageWidth - imageWidth) / 2;
    const y = (pageHeight - imageHeight) / 2;

    // Add the image element to the current page with metadata
    const element = currentPage.addElement({
      type: "image",
      src: img.image,
      x: x,
      y: y,
      width: imageWidth,
      height: imageHeight,
      name: img.name,
    });

    // Select the newly added element
    store.selectElements([element]);

    // Optional: Show a success message
    console.log(
      `Added ${img.name} to workspace with metadata:`,
      element.metadata
    );
  };

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
                className="relative bg-white rounded-2xl flex flex-col items-center p-0 cursor-pointer overflow-hidden group hover:shadow-lg transition-all duration-300"
                style={getPhotoStyles(selectedCategory)}
                onClick={() => handleImageClick(img)}
                title={`Click to add ${img.name} to workspace`}
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
                {/* Add a subtle indicator that the image is clickable */}
                <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
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
