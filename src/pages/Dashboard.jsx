import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { useState, useMemo, useCallback, useEffect } from "react";

import UsersTable from "../components/UsersTable";
import TrialDateModal from "../components/TrialDateModal";
import FullScreenLoader from "../components/FullScreenLoader";
import BetaTestUsersModal from "../components/BetaTestUsersModal";
import TemplateAccessModal from "../components/TemplateAccessModal";
import BulkTemplateUpdateModal from "../components/BulkTemplateUpdateModal";
import OrganizationService from "../services/organizationService";

import { useOrganizationUsers } from "../hooks/useOrganizationUsers";
import { CONFIG } from "../App.jsx";

const Dashboard = ({ env }) => {
  const [selectedOrgIds, setSelectedOrgIds] = useState(new Set());
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);

  const {
    users,
    error,
    loading,
    setUsers,
    isUpdating,
    isDeleting,
    formatDate,
    isModalOpen,
    newTrialDate,
    handleDelete,
    handleOpenModal,
    setNewTrialDate,
    handleCloseModal,
    isTemplateModalOpen,
    selectedOrganization,
    handleUpdateTrialDate,
    handleImpersonateUser,
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

  const toggleBulkUpdateModal = () => {
    setIsBulkUpdateModalOpen((prev) => !prev);
  };

  const handleBulkUpdateTemplates = useCallback(
    async (selectedSkeletons) => {
      try {
        await OrganizationService(CONFIG[env]).bulkUpdateTemplates({
          organisation_ids: Array.from(selectedOrgIds),
          template_ids: selectedSkeletons,
        });
        setUsers((prev) =>
          prev.map((org) => {
            if (selectedOrgIds.has(org.id)) {
              return {
                ...org,
                skeletons: selectedSkeletons,
              };
            }
            return org;
          })
        );
        setSelectedOrgIds(new Set());
      } catch (error) {
        console.error(error);
        toast.error("Failed to bulk update templates");
      }
    },
    [selectedOrgIds, setUsers]
  );

  const isAnyModalOpen = useMemo(() => {
    return (
      isModalOpen ||
      isTemplateModalOpen ||
      isBetaModalOpen ||
      isBulkUpdateModalOpen
    );
  }, [
    isModalOpen,
    isTemplateModalOpen,
    isBetaModalOpen,
    isBulkUpdateModalOpen,
  ]);

  useEffect(() => {
    setSelectedOrgIds(new Set());
  }, [env]);

  return (
    <div className="h-full">
      {isDeleting && <FullScreenLoader />}
      <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Organization Users
            </h1>
            <div>
              {env === "prod" && (
                <button
                  onClick={handleOpenBetaModal}
                  className="px-4 py-2 text-sm font-medium text-[#7a7a3a] bg-[#e3e6d3] rounded-md hover:bg-[#e3e6d3] transition-colors focus:outline-none focus:ring-2 focus:bg-[#e3e6d3] focus:ring-offset-2"
                >
                  Beta Test Users
                </button>
              )}
              {selectedOrgIds.size > 0 && (
                <button
                  onClick={toggleBulkUpdateModal}
                  className="px-4 py-2 ms-4 text-sm font-medium text-[#7a7a3a] bg-[#e3e6d3] rounded-md hover:bg-[#e3e6d3] transition-colors focus:outline-none focus:ring-2 focus:bg-[#e3e6d3] focus:ring-offset-2"
                >
                  Bulk Update Templates
                </button>
              )}
            </div>
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
              selectedOrgIds={selectedOrgIds}
              isAnyModalOpen={isAnyModalOpen}
              handleOpenModal={handleOpenModal}
              setSelectedOrgIds={setSelectedOrgIds}
              handleImpersonateUser={handleImpersonateUser}
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

      <BulkTemplateUpdateModal
        orgs={users}
        selectedOrgIds={selectedOrgIds}
        isOpen={isBulkUpdateModalOpen}
        onClose={toggleBulkUpdateModal}
        onSave={handleBulkUpdateTemplates}
      />

      <BetaTestUsersModal
        env={env}
        isOpen={isBetaModalOpen}
        onClose={handleCloseBetaModal}
      />

      <Tooltip
        id="impersonate-tooltip"
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
        id="change-trial-tooltip"
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
        id="delete-tooltip"
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
        id="bouquet-tooltip"
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

export default Dashboard;
