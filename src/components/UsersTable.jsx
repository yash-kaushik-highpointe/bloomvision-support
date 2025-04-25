import PropTypes from "prop-types";

import deleteIcon from "../assets/delete.svg";
import timeChangeIcon from "../assets/time-change.svg";

const UsersTable = ({ users, formatDate, handleOpenModal, handleDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Profile Picture
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Business Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Owner Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Trial Ends
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Profile Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-3">
                  {org.owner.trial_ends && (
                    <button
                      onClick={() => handleOpenModal(org)}
                      className="rounded-full hover:bg-gray-100 transition-colors duration-200"
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
                    onClick={() => handleDelete(org)}
                    className="rounded-full hover:bg-gray-100 transition-colors duration-200"
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
    </div>
  );
};

UsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  formatDate: PropTypes.func.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default UsersTable;
