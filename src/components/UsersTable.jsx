import PropTypes from "prop-types";
import { useState, useRef } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
} from "@floating-ui/react";

import deleteIcon from "../assets/delete.svg";
import timeChangeIcon from "../assets/time-change.svg";
import bouquetIcon from "../assets/bouquet.svg";
import templateData from "../template.json";

const UsersTable = ({
  users,
  formatDate,
  handleOpenModal,
  handleDelete,
  handleOpenTemplateModal,
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const buttonRefs = useRef({});

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(5), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

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
    <div className="overflow-x-auto">
      {users.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-lg">No Organization</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Profile
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]"
              >
                Business Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]"
              >
                Owner Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]"
              >
                Trial Ends
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]"
              >
                Allowed Templates
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] sticky right-0 bg-white z-10"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
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
                  {formatDate(org.owner.trial_ends)}
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
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  {getTemplateLabels(org.skeletons, org)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[150px] sticky right-0 bg-white z-10">
                  <div className="flex items-center justify-start space-x-3">
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
                    {org.owner.trial_ends && (
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
  formatDate: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpenTemplateModal: PropTypes.func.isRequired,
};

export default UsersTable;
