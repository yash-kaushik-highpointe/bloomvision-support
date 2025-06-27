import { Tooltip } from "react-tooltip";
import { useState } from "react";

import UsersTable from "../components/UsersTable";
import TrialDateModal from "../components/TrialDateModal";
import TemplateAccessModal from "../components/TemplateAccessModal";
import BetaTestUsersModal from "../components/BetaTestUsersModal";
import FullScreenLoader from "../components/FullScreenLoader";

import { useOrganizationUsers } from "../hooks/useOrganizationUsers";

const Dashboard = ({ env }) => {
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);

  const {
    users,
    error,
    loading,
    isUpdating,
    isDeleting,
    formatDate,
    isModalOpen,
    newTrialDate,
    handleDelete,
    handleOpenModal,
    setNewTrialDate,
    handleCloseModal,
    handleUpdateTrialDate,
    isTemplateModalOpen,
    selectedOrganization,
    handleOpenTemplateModal,
    handleCloseTemplateModal,
    handleUpdateTemplateAccess,
  } = useOrganizationUsers(env);

  const handleOpenBetaModal = () => {
    setIsBetaModalOpen(true);
  };

  const handleCloseBetaModal = () => {
    setIsBetaModalOpen(false);
  };

  return (
    <div className="h-full">
      {isDeleting && <FullScreenLoader />}
      <div className="max-w-8xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Organization Users
            </h1>
            {env === "prod" && (
              <button
                onClick={handleOpenBetaModal}
                className="px-4 py-2 text-sm font-medium text-[#7a7a3a] bg-[#e3e6d3] rounded-md hover:bg-[#e3e6d3] transition-colors focus:outline-none focus:ring-2 focus:bg-[#e3e6d3] focus:ring-offset-2"
              >
                Beta Test Users
              </button>
            )}
          </div>

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
              handleDelete={handleDelete}
              handleOpenModal={handleOpenModal}
              selectedOrganization={selectedOrganization}
              handleOpenTemplateModal={handleOpenTemplateModal}
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

      <TemplateAccessModal
        org={selectedOrganization}
        isOpen={isTemplateModalOpen}
        onClose={handleCloseTemplateModal}
        onSave={handleUpdateTemplateAccess}
        ownerId={selectedOrganization?.owner.id}
        currentTemplates={selectedOrganization?.skeletons}
      />

      <BetaTestUsersModal
        env={env}
        isOpen={isBetaModalOpen}
        onClose={handleCloseBetaModal}
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
      <Tooltip
        id="bouquet-tooltip"
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
