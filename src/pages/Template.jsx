import { useMemo } from "react";
import { Tooltip } from "react-tooltip";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Dropdown from "../components/Dropdown";
import TemplateModal from "../modals/TemplateModal";
import TemplateTable from "../components/TemplateTable";
import TemplateCloneModal from "../modals/TemplateCloneModal";
import TemplateRecipeModal from "../modals/TemplateRecipeModal";
import TemplateDeleteModal from "../modals/TemplateDeleteModal";

import { useModal } from "../hooks/useModal";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { useTemplateStorage } from "../hooks/useTemplateStorage";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "../config/constants";

const Template = ({ env }) => {
  const navigate = useNavigate();

  const { templates, loading, createTemplate, updateTemplate, deleteTemplate } =
    useTemplateStorage(env);

  const {
    isOpen: isTemplateModalOpen,
    data: templateModalData,
    closeModal: closeTemplateModal,
    openModal: openTemplateModal,
  } = useModal();

  const {
    isOpen: isDuplicateModalOpen,
    data: duplicateModalData,
    closeModal: closeDuplicateModal,
    openModal: openDuplicateModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    data: deleteModalData,
    closeModal: closeDeleteModal,
    openModal: openDeleteModal,
  } = useModal();

  const {
    isOpen: isViewRecipeModalOpen,
    data: viewRecipeModalData,
    closeModal: closeViewRecipeModal,
    openModal: openViewRecipeModal,
  } = useModal();

  const {
    searchTerm,
    setSearchTerm,
    selectedFilters,
    setFilter,
    filteredItems: filteredTemplates,
  } = useSearchFilter({
    items: templates,
    searchFields: ["name", "category"],
    filters: {
      status: {
        options: STATUS_OPTIONS,
        getValue: (template) => template.status,
      },
      category: {
        options: CATEGORY_OPTIONS,
        getValue: (template) => template.category,
      },
    },
  });

  const handleSaveSuccess = (response, mode) => {
    switch (mode) {
      case "create": {
        createTemplate(response);
        navigate(`/template/${response.id}`);
        break;
      }
      case "update":
        updateTemplate(response);
        break;
      case "delete":
        deleteTemplate(response);
        break;
    }
  };

  const { categoryOptions, statusOptions } = useMemo(() => {
    return {
      categoryOptions: CATEGORY_OPTIONS.map((opt) => ({
        ...opt,
        id: opt.value,
      })),
      statusOptions: STATUS_OPTIONS.map((opt) => ({
        ...opt,
        id: opt.value,
      })),
    };
  }, []);

  return (
    <div className="h-full">
      <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Flower Templates
            </h1>
            <button
              className="px-4 py-2 text-sm font-medium text-[#7a7a3a] bg-[#e3e6d3] rounded-md hover:bg-[#e3e6d3] flex items-center transition-colors"
              onClick={() => openTemplateModal()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Template
            </button>
          </div>

          <div className="w-[80%] gap-4 flex">
            <div className="relative flex-1 max-w-md mr-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                name="search"
                value={searchTerm}
                placeholder="Search Templates..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white border border-stone-200 rounded-lg h-full w-full text-m focus:outline-none focus:ring-2 focus:ring-[#e3e6d3]"
              />
            </div>
            <Dropdown
              options={categoryOptions}
              value={selectedFilters.category}
              onChange={(value) => setFilter("category", value)}
              bgColor="#fff"
              className="w-48 border border-stone-200 rounded-lg"
            />
            <Dropdown
              options={statusOptions}
              value={selectedFilters.status}
              onChange={(value) => setFilter("status", value)}
              bgColor="#fff"
              className="w-48 border border-stone-200 rounded-lg"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading Templates...</p>
            </div>
          ) : (
            <TemplateTable
              templates={filteredTemplates}
              onEditRecord={openTemplateModal}
              onDeleteRecord={openDeleteModal}
              onViewRecipe={openViewRecipeModal}
              onDuplicateRecord={openDuplicateModal}
            />
          )}

          <TemplateModal
            env={env}
            data={templateModalData}
            isOpen={isTemplateModalOpen}
            onClose={closeTemplateModal}
            onSaveSuccess={handleSaveSuccess}
          />

          <TemplateCloneModal
            env={env}
            data={duplicateModalData}
            isOpen={isDuplicateModalOpen}
            onClose={closeDuplicateModal}
            onSaveSuccess={handleSaveSuccess}
          />

          <TemplateDeleteModal
            env={env}
            data={deleteModalData}
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onSaveSuccess={handleSaveSuccess}
          />

          <TemplateRecipeModal
            env={env}
            data={viewRecipeModalData}
            isOpen={isViewRecipeModalOpen}
            onClose={closeViewRecipeModal}
          />
        </div>
      </div>

      <Tooltip
        id="edit-record-tooltip"
        place="top"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "12px",
          zIndex: 200,
        }}
      />
      <Tooltip
        id="edit-template-tooltip"
        place="top"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "12px",
          zIndex: 200,
        }}
      />
      <Tooltip
        id="view-recipe-tooltip"
        place="top"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "12px",
          zIndex: 200,
        }}
      />
      <Tooltip
        id="duplicate-template-tooltip"
        place="top"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "12px",
          zIndex: 200,
        }}
      />
      <Tooltip
        id="delete-template-tooltip"
        place="top"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "12px",
          zIndex: 200,
        }}
      />
    </div>
  );
};

export default Template;
