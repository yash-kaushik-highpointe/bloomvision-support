import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { CONFIG } from "../App";
import { ROUTES } from "../config/constants";
import { authService } from "../services/authService";
import {
  clearError,
  fetchOrganizationUsers,
} from "../store/slices/customerSlice";

export const useOrganizationUsers = (env) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state for data
  const { users, loading, error } = useSelector((state) => state.customer);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (users.length === 0) {
      dispatch(fetchOrganizationUsers({ env, config: CONFIG }));
    }
  }, [navigate, env, users.length, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return {
    users,
    error,
    loading,
  };
};
