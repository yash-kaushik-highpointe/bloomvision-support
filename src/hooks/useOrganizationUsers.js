import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { CONFIG } from "../App";
import { ROUTES } from "../config/constants";
import { authService } from "../services/authService";
import {
  fetchOrganizationUsers,
  updateTrialEndDate,
  updateTemplateAccess,
  impersonateUser,
  clearError,
} from "../store/slices/customerSlice";

const IMPERSONATE_REDIRECT_URL = (token) => {
  return {
    dev: `https://dev.mybloomvision.com/impersonate?token=${token}`,
    prod: `https://app.mybloomvision.com/impersonate?token=${token}`,
  };
};

export const useOrganizationUsers = (env) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state for data
  const { users, loading, error, isUpdating } = useSelector(
    (state) => state.customer
  );

  // Local state for UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [newTrialDate, setNewTrialDate] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (users.length === 0) {
      dispatch(fetchOrganizationUsers({ env, config: CONFIG }));
    }
  }, [navigate, env, users.length, dispatch]);

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

    try {
      await dispatch(
        updateTrialEndDate({
          env,
          config: CONFIG,
          ownerId: selectedOrganization.owner.id,
          newTrialDate,
          skeletons: selectedOrganization.skeletons,
        })
      ).unwrap();

      handleCloseModal();
    } catch (err) {
      console.error("Failed to update trial date:", err);
      handleCloseModal();
      toast.error("Failed to update trial end date");
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
      await dispatch(
        updateTemplateAccess({
          env,
          config: CONFIG,
          ownerId,
          selectedTemplateIds,
          trialEnds: org.trial_ends,
        })
      ).unwrap();
    } catch (err) {
      console.error("Failed to update template access:", err);
      toast.error("Failed to update template access");
    }
  };

  const handleImpersonateUser = async ({ email }) => {
    try {
      const { token } = await dispatch(
        impersonateUser({
          env,
          config: CONFIG,
          email,
        })
      ).unwrap();
      window.open(IMPERSONATE_REDIRECT_URL(token)[env], "_blank");
    } catch (err) {
      toast.error("Failed to impersonate user");
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return {
    users,
    error,
    loading,
    isUpdating,
    isModalOpen,
    newTrialDate,
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
