import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import colors from "../data/colors.json";
import TabList from "../components/Tabs/TabList";
import TabContent from "../components/Tabs/TabContent";
import GalleryService from "../services/flowerService";
import UploadArea from "../components/Upload/UploadArea";
import FilePreview from "../components/Upload/FilePreview";
import FlowerDetails from "../components/Upload/FlowerDetails";

const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1 inline-block"
    viewBox="0 0 25 25"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

function Upload() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const generateFileId = (file) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  const handleFilesSelect = (selectedFiles) => {
    setFiles((prevFiles) => {
      const newFiles = selectedFiles.filter((newFile) => {
        const newFileId = generateFileId(newFile);
        return !prevFiles.some(
          (existingFile) => generateFileId(existingFile.file) === newFileId
        );
      });

      return [
        ...prevFiles,
        ...newFiles.map((file) => ({
          file,
          formData: {
            name: "",
            category: "",
            color: "",
          },
          isSaving: false,
        })),
      ];
    });
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    console.log(e.dataTransfer.files);
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFilesSelect(droppedFiles);

    // Clear the data transfer object
    e.dataTransfer.clearData();
  }, []);

  const removeFile = (fileId) => {
    if (fileId === activeTab) setActiveTab("upload");

    setFiles((prevFiles) =>
      prevFiles.filter((fileData) => generateFileId(fileData.file) !== fileId)
    );
  };

  const handleInputChange = (fileId, field, value) => {
    setFiles((prevFiles) =>
      prevFiles.map((fileData) => {
        if (generateFileId(fileData.file) === fileId) {
          return {
            ...fileData,
            formData: {
              ...fileData.formData,
              [field]: value,
            },
          };
        }
        return fileData;
      })
    );
  };

  const handleSave = async (fileId) => {
    const fileData = files.find(
      (fileData) => generateFileId(fileData.file) === fileId
    );
    if (!fileData) return;

    try {
      // Update saving state for this specific file
      setFiles((prevFiles) =>
        prevFiles.map((fd) => {
          if (generateFileId(fd.file) === fileId) {
            return { ...fd, isSaving: true };
          }
          return fd;
        })
      );

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(fileData.file);

      reader.onload = async () => {
        const base64Image = reader.result;

        const flowerData = {
          name: fileData.formData.name,
          category: fileData.formData.category,
          color: fileData.formData.color,
          view: "view_1",
          image: base64Image,
        };

        await GalleryService.uploadImage(flowerData);

        toast.success("Image uploaded successfully");
        navigate("/gallery");
      };
    } catch (error) {
      toast.error("Failed to upload image");
      // Reset saving state on error
      setFiles((prevFiles) =>
        prevFiles.map((fd) => {
          if (generateFileId(fd.file) === fileId) {
            return { ...fd, isSaving: false };
          }
          return fd;
        })
      );
    }
  };

  const tabs = [
    { id: "upload", label: "Upload" },
    ...files.map((fileData) => ({
      id: generateFileId(fileData.file),
      label: fileData.file.name,
    })),
  ];

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={() => navigate("/gallery")}
        className="fixed top-4 left-4 bg-[#827a3a] hover:bg-[#827a3a] text-white px-4 py-2 rounded-lg shadow-md transition-colors"
      >
        <BackIcon />
        Back
      </button>

      <div className="flex flex-col h-full mt-4 p-4">
        <TabList
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onTabClose={removeFile}
          className="flex-shrink-0"
        />

        <TabContent activeTab={activeTab} tabs={tabs} className="mt-4">
          {(tab) => {
            if (tab.id === "upload") {
              return (
                <UploadArea
                  onFilesSelect={handleFilesSelect}
                  isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="h-[calc(100vh-14rem)]"
                />
              );
            }

            const fileData = files.find(
              (fd) => generateFileId(fd.file) === tab.id
            );

            return (
              <div className="h-[calc(100vh-14rem)] flex">
                <div className="flex-1">
                  <FilePreview file={fileData.file} />
                </div>
                <FlowerDetails
                  formData={fileData.formData}
                  onInputChange={(field, value) =>
                    handleInputChange(tab.id, field, value)
                  }
                  onSave={() => handleSave(tab.id)}
                  isSaving={fileData.isSaving}
                  colors={colors}
                />
              </div>
            );
          }}
        </TabContent>
      </div>
    </div>
  );
}

export default Upload;
