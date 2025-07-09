import React from "react";
import { Edit, Trash, Copy, Pencil } from "lucide-react";

import { formatDate } from "../utils/helper";

const TemplateTable = ({
  templates,
  onDelete,
  onEdit,
  onEditRecord,
  onDuplicate,
}) => {
  return (
    <div className="overflow-x-auto max-h-[calc(100vh-328px)] mt-10">
      {templates.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No Templates</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="sticky top-0 h-[63px]">
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px] sticky bg-[#f9fafb] right-0 z-10"
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
                  <span className="px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {template.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(template.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(template.updated_at)}
                </td>
                <td className="px-6 py-4 text-sm min-w-[150px] sticky right-0">
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
                      onClick={() => onEdit(template.id)}
                      className="rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="edit-template-tooltip"
                      data-tooltip-content="Edit Template"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicate(template.id)}
                      className="rounded-md p-0 hover:bg-accent hover:text-accent-foreground"
                      data-tooltip-id="duplicate-template-tooltip"
                      data-tooltip-content="Duplicate Template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(template.id)}
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
