import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";

import Dropdown from "../components/Dropdown";
import UsersTable from "../components/UsersTable";
import FullScreenLoader from "../components/FullScreenLoader";
import BetaTestUsersModal from "../components/BetaTestUsersModal";
import BulkTemplateUpdateModal from "../components/BulkTemplateUpdateModal";
import OrganizationService from "../services/organizationService";

import { CONFIG } from "../App.jsx";
import { useOrganizationUsers } from "../hooks/useOrganizationUsers";
import { PAYMENT_STATUS_OPTIONS } from "../config/constants";

const Dashboard = ({ env }) => {
  const navigate = useNavigate();

  const [selectedOrgIds, setSelectedOrgIds] = useState(new Set());
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    users,
    error,
    loading,
    setUsers,
    isDeleting,
    isModalOpen,
    isTemplateModalOpen,
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

  const handleManageCustomer = (customerId) => {
    navigate(`/customers/${customerId}`);
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        user.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

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
    setSearchTerm("");
    setStatusFilter("All");
  }, [env]);

  return (
    <div className="h-full">
      {isDeleting && <FullScreenLoader />}
      <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <div className="flex items-center gap-4">
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
                  className="px-4 py-2 text-sm font-medium text-[#7a7a3a] bg-[#e3e6d3] rounded-md hover:bg-[#e3e6d3] transition-colors focus:outline-none focus:ring-2 focus:bg-[#e3e6d3] focus:ring-offset-2"
                >
                  Bulk Update Templates
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Company Name or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:outline-none"
              />
            </div>

            <Dropdown
              options={PAYMENT_STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              bgColor="#fff"
              border="1px solid #d1d5db"
              borderRadius={7}
              className="w-40"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>
          ) : (
            <UsersTable
              users={filteredUsers}
              selectedOrgIds={selectedOrgIds}
              isAnyModalOpen={isAnyModalOpen}
              setSelectedOrgIds={setSelectedOrgIds}
              handleManageCustomer={handleManageCustomer}
            />
          )}
        </div>
      </div>

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
    </div>
  );
};

export default Dashboard;
