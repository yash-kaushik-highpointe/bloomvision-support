import { useMemo } from "react";
import { Plus, Search } from "lucide-react";

import Dropdown from "../components/Dropdown";

import { useSearchFilter } from "../hooks/useSearchFilter";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "../config/constants";
import { useTemplateStorage } from "../hooks/useTemplateStorage";

const Template = ({ env }) => {
  const { templates, loading } = useTemplateStorage(env);

  const {
    searchTerm,
    setSearchTerm,
    selectedFilters,
    setFilter,
    filteredItems: filteredTemplates,
    hasActiveFilters,
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
            <button className="px-4 py-2 text-sm font-medium text-[#7a7a3a] bg-[#e3e6d3] rounded-md hover:bg-[#e3e6d3] flex items-center transition-colors focus:outline-none focus:ring-2 focus:bg-[#e3e6d3] focus:ring-offset-2">
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
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template;
