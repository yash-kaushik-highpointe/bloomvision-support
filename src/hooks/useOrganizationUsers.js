import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import OrganizationService from "../services/organizationService";

import { CONFIG } from "../App";
import { ROUTES } from "../config/constants";
import { authService } from "../services/authService";

const IMPERSONATE_REDIRECT_URL = (token) => {
  return {
    dev: `https://dev.mybloomvision.com/impersonate?token=${token}`,
    prod: `https://app.mybloomvision.com/impersonate?token=${token}`,
  };
};

export const useOrganizationUsers = (env) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrialDate, setNewTrialDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    fetchUsers();
  }, [navigate, env]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await OrganizationService(
        CONFIG[env]
      ).getOrganizationUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch organization users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (org) => {
    setSelectedOrganization(org);
    const formattedDate = org.trial_ends
      ? new Date(org.trial_ends).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setNewTrialDate(formattedDate);
    setIsModalOpen(true);
    setIsTemplateModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTrialDate("");
  };

  const handleUpdateTrialDate = async () => {
    if (!selectedOrganization) return;

    setIsUpdating(true);
    try {
      await OrganizationService(CONFIG[env]).updateTrialEndDate(
        selectedOrganization.owner.id,
        newTrialDate,
        selectedOrganization.skeletons
      );

      setUsers(
        users.map((org) => {
          if (org.owner.id === selectedOrganization.owner.id) {
            return {
              ...org,
              trial_ends: newTrialDate,
            };
          }
          return org;
        })
      );

      handleCloseModal();
    } catch (err) {
      console.error("Failed to update trial date:", err);
      handleCloseModal();
      toast.error("Failed to update trial end date");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (organizationId) => {
    setIsDeleting(true);
    try {
      await OrganizationService(CONFIG[env]).deleteOrganization(organizationId);
      setUsers(users.filter((org) => org.id !== organizationId));
      toast.success("Organization deleted successfully");
    } catch (err) {
      console.error("Failed to delete organization:", err);
      toast.error("Failed to delete organization");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenTemplateModal = (org) => {
    setSelectedOrganization(org);
    setIsTemplateModalOpen(true);
    setIsModalOpen(false);
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    setSelectedOrganization(null);
  };

  const handleUpdateTemplateAccess = async (
    org,
    ownerId,
    selectedTemplateIds
  ) => {
    try {
      await OrganizationService(CONFIG[env]).updateTemplateAccess(
        ownerId,
        selectedTemplateIds,
        org.trial_ends
      );

      setUsers(
        users.map((org) => {
          if (org.owner.id === ownerId) {
            return {
              ...org,
              skeletons: selectedTemplateIds,
            };
          }
          return org;
        })
      );
    } catch (err) {
      console.error("Failed to update template access:", err);
      toast.error("Failed to update template access");
    }
  };

  const handleImpersonateUser = async ({ email }) => {
    try {
      let { token } = await OrganizationService(CONFIG[env]).impersonateUser(
        email
      );
      window.open(IMPERSONATE_REDIRECT_URL(token)[env], "_blank");
    } catch (err) {
      toast.error("Failed to impersonate user");
    }
  };

  return {
    users,
    error,
    loading,
    setUsers,
    isUpdating,
    isDeleting,
    isModalOpen,
    newTrialDate,
    handleDelete,
    handleOpenModal,
    setNewTrialDate,
    handleCloseModal,
    isTemplateModalOpen,
    selectedOrganization,
    handleImpersonateUser,
    handleUpdateTrialDate,
    handleOpenTemplateModal,
    handleCloseTemplateModal,
    handleUpdateTemplateAccess,
  };
};
