import React, { useState, useEffect } from "react";
import ImageRenderer from "../GalleryRightPanel/components/ImageRender";

const FilePreview = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Clean up the object URL when component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!previewUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <ImageRenderer
        image={previewUrl}
        name={file.name}
        selectedCategory={undefined}
      />
    </div>
  );
};

export default FilePreview;
