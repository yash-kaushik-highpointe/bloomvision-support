import { Tooltip } from "react-tooltip";

import UsersTable from "../components/UsersTable";
import TrialDateModal from "../components/TrialDateModal";

import { useOrganizationUsers } from "../hooks/useOrganizationUsers";

const Dashboard = () => {
  const {
    users,
    error,
    loading,
    isUpdating,
    formatDate,
    isModalOpen,
    newTrialDate,
    handleDelete,
    handleOpenModal,
    setNewTrialDate,
    handleCloseModal,
    handleUpdateTrialDate,
  } = useOrganizationUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Organization Users
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
          ) : (
            <UsersTable
              users={users}
              formatDate={formatDate}
              handleOpenModal={handleOpenModal}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <TrialDateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        newTrialDate={newTrialDate}
        setNewTrialDate={setNewTrialDate}
        onUpdate={handleUpdateTrialDate}
        isUpdating={isUpdating}
      />

      <Tooltip
        id="change-trial-tooltip"
        place="top"
        className="z-50"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "12px",
        }}
      />
      <Tooltip
        id="delete-tooltip"
        place="top"
        className="z-50"
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          borderRadius: "4px",
          padding: "4px 8px",
          fontSize: "12px",
        }}
      />
    </div>
  );
};

export default Dashboard;
