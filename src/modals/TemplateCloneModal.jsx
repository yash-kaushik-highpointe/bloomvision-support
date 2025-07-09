import React, { useState } from "react";
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
    Confirming...
  </>
);

const TemplateCloneModal = ({ env, isOpen, onClose, data, onSaveSuccess }) => {
  let [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    let dataResponse = await TemplateService(CONFIG[env]).createTemplate({
      ...data,
      name: `${data.name} (Copy)`,
    });
    onSaveSuccess(dataResponse, "create");
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
            Are you sure you want to duplicate the template -{" "}
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
              className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#7a7a3a] disabled:opacity-50 flex items-center gap-2"
              onClick={handleConfirm}
            >
              {isLoading ? <Saving /> : "Confirm"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCloneModal;
