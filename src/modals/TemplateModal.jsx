import React, { useState, useEffect, useMemo } from "react";

import Dropdown from "../components/Dropdown";
import TemplateService from "../services/template";

import { CONFIG } from "../App";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "../config/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/Dialog";

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

const TemplateModal = ({ isOpen, onClose, data, env, onSaveSuccess }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bouquet");
  const [selectedStatus, setSelectedStatus] = useState("In Progress");

  const handleSubmit = async (e) => {
    let response;
    let mode;
    e.preventDefault();

    if (templateName.trim()) {
      setIsLoading(true);
      if (data) {
        mode = "update";
        response = await TemplateService(CONFIG[env]).updateTemplate(data.id, {
          name: templateName,
          category: selectedCategory,
          status: selectedStatus,
        });
      } else {
        mode = "create";
        response = await TemplateService(CONFIG[env]).createTemplate({
          name: templateName,
          category: selectedCategory,
          status: selectedStatus,
        });
      }
      setIsLoading(false);
      onSaveSuccess(response, mode);
      onClose();
    }
  };

  const handleClose = () => {
    setTemplateName("");
    setSelectedCategory("Bouquet");
    setSelectedStatus("In Progress");
    onClose();
  };

  const handleChange = (func, value) => {
    func(value);
    setIsDirty(true);
  };

  const { categoryOptions, statusOptions } = useMemo(() => {
    return {
      categoryOptions: CATEGORY_OPTIONS.slice(1).map((opt) => ({
        ...opt,
        id: opt.value,
      })),
      statusOptions: STATUS_OPTIONS.slice(1).map((opt) => ({
        ...opt,
        id: opt.value,
      })),
    };
  }, []);

  useEffect(() => {
    if (data) {
      setTemplateName(data.name);
      setSelectedCategory(data.category);
      setSelectedStatus(data.status);
    }
  }, [data]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Template" : "Create New Template"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-3">
          <div>
            <label
              htmlFor="template-name"
              className="block text-l font-medium text-stone-700 mb-2"
            >
              Template Name
            </label>
            <input
              id="template-name"
              type="text"
              value={templateName}
              onChange={(e) => handleChange(setTemplateName, e.target.value)}
              placeholder="Enter template name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground"
              required
            />
          </div>
          <div>
            <label
              htmlFor="template-category"
              className="block text-l font-medium text-stone-700 mb-2"
            >
              Category
            </label>
            <Dropdown
              bgColor="#fff"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(value) => handleChange(setSelectedCategory, value)}
              className="w-100 border border-stone-200 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="template-status"
              className="block text-l font-medium text-stone-700 mb-2"
            >
              Status
            </label>
            <Dropdown
              bgColor="#fff"
              options={statusOptions}
              value={selectedStatus}
              onChange={(value) => handleChange(setSelectedStatus, value)}
              className="w-100 border border-stone-200 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#7a7a3a] disabled:opacity-50 flex items-center gap-2"
              disabled={!templateName.trim() || !isDirty}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Saving />
              ) : data ? (
                "Save Changes"
              ) : (
                "Create Template"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
