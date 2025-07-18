import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useCallback, useRef, useEffect } from "react";

import colors from "../data/colors.json";
import TabList from "../components/Tabs/TabList";
import TabContent from "../components/Tabs/TabContent";
import GalleryService from "../services/flowerService";
import UploadArea from "../components/Upload/UploadArea";
import FilePreview from "../components/Upload/FilePreview";
import FlowerDetails from "../components/Upload/FlowerDetails";

import { CONFIG } from "../App";
import { parseFileName } from "../utils/helper";
import { addFlower } from "../store/slices/flowersSlice";
import { VIEW_2_CATEGORIES } from "../config/constants";

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

function Upload({ env }) {
  const activeTabRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("upload");
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
        ...newFiles.reduce((acc, file) => {
          // Parse the filename to extract metadata
          const metadata = parseFileName(file.name);

          if (metadata)
            return [
              ...acc,
              {
                file,
                isSaving: false,
                formData: metadata,
                id: generateFileId(file),
              },
            ];
          else return acc;
        }, []),
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
    try {
      e.preventDefault();
      setIsDragging(false);

      if (!e?.dataTransfer) {
        console.warn("No dataTransfer object found in drop event");
        return;
      }

      const { files } = e.dataTransfer;
      if (!files?.length) {
        console.warn("No files found in drop event");
        return;
      }

      const droppedFiles = Array.from(files);
      handleFilesSelect(droppedFiles);

      // Clear the data transfer object
      try {
        e.dataTransfer.clearData();
      } catch (clearError) {
        console.warn("Failed to clear dataTransfer:", clearError);
      }
    } catch (error) {
      console.error("Error handling file drop:", error);
      setIsDragging(false);
    }
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

  function isStillActive(fileId) {
    if (activeTabRef.current === fileId) setActiveTab("upload");
  }

  const handleSave = async (fileId) => {
    const fileData = files.find((fileData) => fileData.id === fileId);
    if (!fileData) return;

    // Update saving state for this specific file
    setFiles((prevFiles) =>
      prevFiles.map((fd) => {
        if (fd.id === fileId) {
          return { ...fd, isSaving: true };
        }
        return fd;
      })
    );

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(fileData.file);

    reader.onload = async () => {
      try {
        const base64Image = reader.result;

        const flowerData = {
          name: fileData.formData.name,
          category: fileData.formData.category,
          color: fileData.formData.color,
          view: "view_1",
          image: base64Image,
        };

        let data = await GalleryService(CONFIG[env]).uploadImage(flowerData);

        dispatch(
          addFlower({
            ...data,
            dirtyMessage: VIEW_2_CATEGORIES.includes(flowerData.category)
              ? "View 2 missing"
              : "",
          })
        );

        toast.success(`${fileData.formData.name} is uploaded successfully`);

        // Remove the file from the list after successful upload
        setFiles((prevFiles) =>
          prevFiles.filter((fd) => generateFileId(fd.file) !== fileId)
        );

        // If this was the active tab, switch to upload tab
        isStillActive(fileId);
      } catch (error) {
        toast.error(`Failed to upload ${fileData.formData.name}`);
        // Reset saving state on error
        setFiles((prevFiles) =>
          prevFiles.map((fd) => {
            if (fd.id === fileId) {
              return { ...fd, isSaving: false };
            }
            return fd;
          })
        );
      }
    };
  };

  const tabs = [
    { id: "upload", label: "Upload" },
    ...files.map((fileData) => ({
      id: generateFileId(fileData.file),
      label: fileData.file.name,
    })),
  ];

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

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
        {tabs.length > 1 && (
          <TabList
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTabClose={removeFile}
            className="flex-shrink-0"
            files={files}
          />
        )}

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

            const fileData = files.find((fd) => fd.id === tab.id);

            return (
              <div className="h-[calc(100vh-14rem)] flex">
                <div className="flex-1">
                  <FilePreview
                    file={fileData.file}
                    category={fileData.formData.category}
                  />
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

      {activeTab !== "upload" && (
        <button
          onClick={() => setActiveTab("upload")}
          className="fixed top-4 right-[7rem] bg-[#827a3a] hover:bg-[#827a3a] text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          Upload
        </button>
      )}
    </div>
  );
}

export default Upload;
