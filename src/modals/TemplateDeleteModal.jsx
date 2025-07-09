import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/Dialog";

import TemplateService from "../services/template";

import { CONFIG } from "../App";

const Deleting = () => (
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
    Deleting...
  </>
);

const TemplateDeleteModal = ({ env, isOpen, onClose, data, onSaveSuccess }) => {
  let [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await TemplateService(CONFIG[env]).deleteTemplate(data.id);
    onSaveSuccess(data, "delete");
    setIsLoading(false);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Duplicate Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          <p className="text-gray-700">
            Are you sure you want to delete the template -{" "}
            <span className="font-semibold">"{data?.name}"</span> ?
          </p>
          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
              onClick={handleConfirm}
            >
              {isLoading ? <Deleting /> : "Delete"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDeleteModal;
