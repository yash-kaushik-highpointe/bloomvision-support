import React from "react";
import { Edit, Trash, Copy, Pencil, Scroll, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { formatDate, getDimension } from "../utils/helper";

const TemplateTable = ({
  templates,
  onEditRecord,
  onViewRecipe,
  onViewComment,
  onDeleteRecord,
  onDuplicateRecord,
}) => {
  const navigate = useNavigate();

  const handleEditTemplate = ({ id }) => {
    navigate(`/template/${id}`);
  };

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-328px)] mt-10">
      {templates.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No Templates</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="sticky top-0 h-[63px] z-10">
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px] bg-[#f9fafb]"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] bg-[#f9fafb]"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] bg-[#f9fafb]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] bg-[#f9fafb]"
              >
                Dimension
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] bg-[#f9fafb]"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] bg-[#f9fafb]"
              >
                Modified At
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px] sticky bg-[#f9fafb] right-0"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {template.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {template.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {template.status === "In Progress" && (
                    <span
                      className="w-32 px-4 py-2 inline-flex justify-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                      style={{ minWidth: "8rem" }}
                    >
                      In Progress
                    </span>
                  )}
                  {template.status === "Ready for Dev" && (
                    <span
                      className="w-32 px-4 py-2 inline-flex justify-center text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                      style={{ minWidth: "8rem" }}
                    >
                      Ready for Dev
                    </span>
                  )}
                  {template.status === "Implemented" && (
                    <span
                      className="w-32 px-4 py-2 inline-flex justify-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                      style={{ minWidth: "8rem" }}
                    >
                      Implemented
                    </span>
                  )}
                  {template.status === "Revised" && (
                    <span
                      className="w-32 px-4 py-2 inline-flex justify-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                      style={{ minWidth: "8rem" }}
                    >
                      Revised
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getDimension(template.dimension)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(template.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(template.updated_at)}
                </td>
                <td className="px-6 py-4 text-sm min-w-[150px] sticky right-0 bg-white">
                  <div className="flex space-x-1 gap-6">
                    <button
                      onClick={() => onEditRecord(template)}
                      className="rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="edit-record-tooltip"
                      data-tooltip-content="Edit Record"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="edit-template-tooltip"
                      data-tooltip-content="Edit Template"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewRecipe(template)}
                      className="rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="view-recipe-tooltip"
                      data-tooltip-content="View Recipe"
                    >
                      <Scroll className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewComment(template)}
                      className="rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="view-comment-tooltip"
                      data-tooltip-content="View Comments"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicateRecord(template)}
                      className="rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="duplicate-template-tooltip"
                      data-tooltip-content="Duplicate Template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRecord(template)}
                      className="rounded-md p-0 text-red-600 hover:text-red-700 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="delete-template-tooltip"
                      data-tooltip-content="Delete Template"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TemplateTable;
