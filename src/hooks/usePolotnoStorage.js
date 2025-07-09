import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { CONFIG } from "../App";
import { fetchTemplateDetails } from "../store/slices/polotnoSlice";

export const usePolotnoStorage = (env) => {
  const dispatch = useDispatch();
  const { id: templateId } = useParams();

  // Get template data from Redux store
  const { templates, loading, error } = useSelector((state) => state.polotno);

  // Get the specific template data for current templateId
  const templateData = useMemo(() => {
    return templates[templateId] || null;
  }, [templates, templateId]);

  // Check if we need to fetch the template data
  const shouldFetch = useMemo(() => {
    return templateId && !templateData && !loading;
  }, [templateId, templateData, loading]);

  // Fetch template data if not already in store
  useEffect(() => {
    if (shouldFetch && templateId && env) {
      dispatch(fetchTemplateDetails({ templateId, baseURL: CONFIG[env] }));
    }
  }, [shouldFetch, templateId, env, dispatch]);

  return {
    error,
    loading,
    templateId,
    templateData,
  };
};
