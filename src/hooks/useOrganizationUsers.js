import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import organizationService from "../services/organizationService";

import { ROUTES } from "../config/constants";
import { authService } from "../services/authService";

export const useOrganizationUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [newTrialDate, setNewTrialDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const data = await organizationService.getOrganizationUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch organization users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleOpenModal = (org) => {
    setSelectedOwner(org);
    const formattedDate = org.owner.trial_ends
      ? new Date(org.owner.trial_ends).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setNewTrialDate(formattedDate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOwner(null);
    setNewTrialDate("");
  };

  const handleUpdateTrialDate = async () => {
    if (!selectedOwner) return;

    setIsUpdating(true);
    try {
      await organizationService.updateTrialEndDate(
        selectedOwner.owner.id,
        newTrialDate
      );

      setUsers(
        users.map((org) => {
          if (org.owner.id === selectedOwner.owner.id) {
            return {
              ...org,
              owner: {
                ...org.owner,
                trial_ends: newTrialDate,
              },
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

  const handleDelete = () => {
    // Implement delete functionality
    console.log("Delete functionality not implemented yet");
  };

  return {
    users,
    loading,
    error,
    isModalOpen,
    selectedOwner,
    newTrialDate,
    isUpdating,
    formatDate,
    handleOpenModal,
    handleCloseModal,
    handleUpdateTrialDate,
    handleDelete,
    setNewTrialDate,
  };
};
