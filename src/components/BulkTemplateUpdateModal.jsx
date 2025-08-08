import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import templateData from "../data/template.json";

import { getSkeletonState } from "../utils/helper";

const BulkTemplateUpdateModal = ({
  isOpen,
  onClose,
  onSave,
  orgs,
  selectedOrgIds,
}) => {
  const [skeletonState, setSkeletonState] = useState({});
  const [expandedCategories, setExpandedCategories] = useState(
    templateData.map((cat) => cat.id)
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setExpandedCategories(templateData.map((cat) => cat.id));
      setIsSaving(false);
    }
  }, [isOpen]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSkeleton = (skeletonId) => {
    setSkeletonState((prev) => {
      return prev[skeletonId] === "checked"
        ? { ...prev, [skeletonId]: "unchecked" }
        : { ...prev, [skeletonId]: "checked" };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let payload = Object.keys(skeletonState).filter(
        (id) => skeletonState[id] === "checked"
      );
      await onSave(payload);
      onClose();
    } catch (error) {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let newSkeletonState = getSkeletonState(orgs, selectedOrgIds, templateData);
    setSkeletonState(newSkeletonState);
  }, [orgs, selectedOrgIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[600px] min-h-[600px] flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Control Template Access</h2>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="mb-4">
            {templateData.map((category) => (
              <div key={category.id} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full text-left p-2 bg-gray-100 rounded flex justify-between items-center"
                >
                  <span>{category.label}</span>
                  <span>
                    {expandedCategories.includes(category.id) ? "−" : "+"}
                  </span>
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="pl-4 mt-2">
                    {category.skeletons.map((skeleton) => (
                      <div
                        key={skeleton.id}
                        className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleSkeleton(skeleton.id)}
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          ref={(input) => {
                            if (input)
                              input.indeterminate =
                                skeletonState[skeleton.id] === "indeterminate";
                          }}
                          checked={skeletonState[skeleton.id] === "checked"}
                          onChange={() => {}}
                        />
                        <span>{skeleton.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-50"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-[#7a7a3a] text-white rounded hover:bg-[#7a7a3a] disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
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
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

BulkTemplateUpdateModal.propTypes = {
  orgs: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedOrgIds: PropTypes.object.isRequired,
};

export default BulkTemplateUpdateModal;
