import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/Dialog";

import TemplateService from "../services/template";
import { CONFIG } from "../App";

const Saving = () => (
  <>
    <svg
      className="animate-spin h-5 w-5 text-white"
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
    Saving...
  </>
);

const TemplateCommentModal = ({
  env,
  data,
  isOpen,
  onClose,
  onSaveSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (data?.comment) setComment(data.comment);
    else setComment("");
  }, [data]);

  const handleSave = async () => {
    if (!data?.id) return;

    setIsLoading(true);
    try {
      let response = await TemplateService(CONFIG[env]).updateTemplate(
        data.id,
        {
          comment: comment.trim(),
        }
      );
      setIsLoading(false);
      onSaveSuccess(response, "update");
      onClose();
    } catch (error) {
      console.error("Error saving comment:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comment for template:{" "}
              <span className="font-semibold">"{data?.name}"</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e3e6d3] focus:border-[#e3e6d3] resize-none"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#6a6a2a] disabled:opacity-50 flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? <Saving /> : "Save Comment"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCommentModal;
