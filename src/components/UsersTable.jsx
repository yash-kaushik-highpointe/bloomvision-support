import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
} from "@floating-ui/react";
import PropTypes from "prop-types";
import { UserCog } from "lucide-react";
import { useState, useRef } from "react";

import deleteIcon from "../assets/delete.svg";
import bouquetIcon from "../assets/bouquet.svg";
import templateData from "../data/template.json";
import timeChangeIcon from "../assets/time-change.svg";

const UsersTable = ({
  users,
  formatDate,
  handleDelete,
  isAnyModalOpen,
  selectedOrgIds,
  handleOpenModal,
  setSelectedOrgIds,
  handleImpersonateUser,
  handleOpenTemplateModal,
}) => {
  const buttonRefs = useRef({});

  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(users.map((user) => user.id));
      setSelectedOrgIds(allIds);
    } else {
      setSelectedOrgIds(new Set());
    }
  };

  const handleRowSelection = (userId, checked) => {
    const newSelectedRows = new Set(selectedOrgIds);
    if (checked) {
      newSelectedRows.add(userId);
    } else {
      newSelectedRows.delete(userId);
    }
    setSelectedOrgIds(newSelectedRows);
  };

  const isAllSelected =
    users.length > 0 && selectedOrgIds.size === users.length;

  const isIndeterminate =
    selectedOrgIds.size > 0 && selectedOrgIds.size < users.length;

  const getTemplateLabels = (skeletonIds, org) => {
    if (!skeletonIds || skeletonIds.length === 0) {
      return (
        <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
          No Templates allowed
        </span>
      );
    }

    const templates = skeletonIds
      .map((id) => {
        const skeleton = templateData
          .flatMap((cat) => cat.skeletons)
          .find((s) => s.id === id);
        return skeleton ? skeleton.label : null;
      })
      .filter(Boolean);

    const templateCount = templates.length;
    const label = templateCount === 1 ? "Template" : "Templates";

    return (
      <div className="relative">
        <button
          ref={(el) => (buttonRefs.current[org.id] = el)}
          onClick={() => handleOpenTemplateModal(org)}
          onMouseEnter={() => {
            setHoveredTemplate(org.id);
            refs.setReference(buttonRefs.current[org.id]);
          }}
          className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200"
        >
          {templateCount} {label} allowed
        </button>
        {hoveredTemplate === org.id && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2"
            >
              <div className="text-sm text-gray-700 max-h-40 overflow-y-auto">
                {templates.map((template, index) => (
                  <div key={index} className="py-1">
                    {template}
                  </div>
                ))}
              </div>
            </div>
          </FloatingPortal>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-245px)]">
      {users.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No Organization</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr
              className="sticky top-0 h-[63px]"
              style={isAnyModalOpen ? {} : { zIndex: 100 }}
            >
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-[#f9fafb]"
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 bg-gray-100 border-gray-300 rounded cursor-pointer focus:outline-none"
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-[#f9fafb]"
              >
                Profile
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px] bg-[#f9fafb]"
              >
                Business Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px] bg-[#f9fafb]"
              >
                Owner Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px] bg-[#f9fafb]"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] bg-[#f9fafb]"
              >
                Trial Ends
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px] bg-[#f9fafb]"
              >
                Allowed Templates
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] bg-[#f9fafb]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] sticky bg-[#f9fafb] right-0 z-10"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrgIds.has(org.id)}
                    onChange={(e) =>
                      handleRowSelection(org.id, e.target.checked)
                    }
                    className="h-4 w-4 bg-gray-100 border-gray-300 rounded cursor-pointer focus:outline-none"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {org.owner.profile_picture ? (
                    <img
                      src={org.owner.profile_picture}
                      alt={org.owner.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {org.business_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {org.owner.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {org.owner.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(org.trial_ends)}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  {getTemplateLabels(org.skeletons, org)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      org.owner.is_profile_complete
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {org.owner.is_profile_complete ? "Complete" : "Incomplete"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[150px] sticky right-0 bg-white">
                  <div className="flex items-center justify-start space-x-3">
                    <button
                      className="rounded-full hover:bg-gray-100 transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                      data-tooltip-id="impersonate-tooltip"
                      data-tooltip-content="Impersonate User"
                      onClick={() => handleImpersonateUser(org.owner)}
                    >
                      <UserCog className="w-5 h-5 text-black" />
                    </button>
                    <button
                      onClick={() => handleOpenTemplateModal(org)}
                      className="rounded-full hover:bg-gray-100 transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                      data-tooltip-id="bouquet-tooltip"
                      data-tooltip-content="Template Access"
                    >
                      <img
                        src={bouquetIcon}
                        alt="Template Access"
                        className="w-5 h-5"
                      />
                    </button>
                    {org.trial_ends && (
                      <button
                        onClick={() => handleOpenModal(org)}
                        className="rounded-full hover:bg-gray-100 transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                        data-tooltip-id="change-trial-tooltip"
                        data-tooltip-content="Change Trial Period"
                      >
                        <img
                          src={timeChangeIcon}
                          alt="Change Trial Period"
                          className="w-5 h-5"
                        />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="rounded-full hover:bg-gray-100 transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-content="Delete Organisation"
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete Organisation"
                        className="w-5 h-5"
                      />
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

UsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func,
  formatDate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleOpenTemplateModal: PropTypes.func.isRequired,
};

export default UsersTable;
