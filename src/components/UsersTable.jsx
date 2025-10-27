import PropTypes from "prop-types";

import templateData from "../data/template.json";
import { PAYMENT_STATUS } from "../config/constants";
import { formatUserTableDate, addToDate } from "../utils/helper";

const UsersTable = ({
  users,
  isAnyModalOpen,
  selectedOrgIds,
  setSelectedOrgIds,
}) => {
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
        <div className="px-3 py-1 text-sm text-blue-600">
          {templateCount} {label} allowed
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-270px)]">
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
                Company Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px] bg-[#f9fafb]"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] bg-[#f9fafb]"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] bg-[#f9fafb]"
              >
                Trial Ends
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] bg-[#f9fafb]"
              >
                Renewal Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px] bg-[#f9fafb]"
              >
                Allowed Templates
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
                <td className="flex flex-col px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span>{org.business_name}</span>
                  <span className="text-xs text-gray-500">
                    {org.owner.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {org.owner.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-4 py-1 inline-flex text-sm leading-5 font-normal rounded-full bg-gray-100`}
                    style={{
                      color: PAYMENT_STATUS[org?.status]?.color,
                    }}
                  >
                    {PAYMENT_STATUS[org?.status]?.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatUserTableDate(
                    org?.subscription?.is_payment_done
                      ? undefined
                      : org.trial_ends
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatUserTableDate(
                    addToDate(org?.subscription?.period_end, 1)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getTemplateLabels(org.skeletons, org)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[150px] sticky right-0 bg-white">
                  <button className="px-3 py-1 text-sm text-gray-600 border border-gray-600 bg-gray-200 rounded-md outline-none focus:outline-none">
                    Manage
                  </button>
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
  handleDelete: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleOpenTemplateModal: PropTypes.func.isRequired,
};

export default UsersTable;
