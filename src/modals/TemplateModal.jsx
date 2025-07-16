import React, { useState, useEffect, useMemo } from "react";

import Dropdown from "../components/Dropdown";
import TemplateService from "../services/template";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/Dialog";
import { CONFIG } from "../App";
import { getTotalInches } from "../utils/helper";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "../config/constants";

const Saving = ({ data }) => (
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
    {data ? "Saving..." : "Creating..."}
  </>
);

const TemplateModal = ({ isOpen, onClose, data, env, onSaveSuccess }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [heightFeet, setHeightFeet] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [heightInches, setHeightInches] = useState(6);
  const [templateName, setTemplateName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bouquet");
  const [selectedStatus, setSelectedStatus] = useState("In Progress");

  const handleSubmit = async (e) => {
    let response;
    let mode;
    e.preventDefault();

    if (templateName.trim()) {
      setIsLoading(true);
      const dimension = getTotalInches(heightFeet, heightInches);
      if (data) {
        mode = "update";
        response = await TemplateService(CONFIG[env]).updateTemplate(data.id, {
          dimension,
          name: templateName,
          category: selectedCategory,
          status: selectedStatus,
        });
      } else {
        mode = "create";
        response = await TemplateService(CONFIG[env]).createTemplate({
          dimension,
          name: templateName,
          category: selectedCategory,
          status: selectedStatus,
        });
      }
      setIsLoading(false);
      onSaveSuccess(response, mode);
      handleClose();
    }
  };

  const handleClose = () => {
    setTemplateName("");
    setSelectedCategory("Bouquet");
    setSelectedStatus("In Progress");
    setHeightFeet(1);
    setHeightInches(6);
    onClose();
  };

  const handleChange = (func, value) => {
    func(value);
    setIsDirty(true);
  };

  const handleFeetChange = (event) => {
    let value = Number(event.target.value);
    setHeightFeet(value);

    if (value === 1) setHeightInches(6);
    else if (value === 30) setHeightInches(0);
  };

  const handleInchesChange = (event) => {
    let value = Number(event.target.value);

    if (heightFeet === 1 && value === 5) return;

    setHeightInches(value);
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
      if (data.dimension) {
        setHeightFeet(Math.floor(data.dimension / 12));
        setHeightInches(data.dimension % 12);
      }
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
          <div className="mb-[1.5rem]">
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
          <div className="mb-[1.5rem]">
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
          {!data && (
            <div className="mb-[1.5rem]">
              <label className="block text-l font-medium text-stone-700 mb-2">
                Template Dimensions
              </label>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-stone-500 mb-1">
                    Feet
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={heightFeet}
                    onChange={handleFeetChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-stone-500 mb-1">
                    Inches
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={heightInches}
                    disabled={heightFeet === 30}
                    onChange={handleInchesChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="text-xs text-stone-500 mt-1">
                Range: 1'6" - 30'0" (18" - 360")
              </div>
            </div>
          )}
          <div className="mb-[1.5rem]">
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
                <Saving data={data} />
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
