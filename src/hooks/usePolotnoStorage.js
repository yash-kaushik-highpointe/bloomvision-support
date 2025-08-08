import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TemplateService from "../services/template";

import { CONFIG } from "../App";
import {
  fetchTemplateDetails,
  saveTemplateDetails as saveTemplateDetailsAction,
} from "../store/slices/polotnoSlice";

export const usePolotnoStorage = (env) => {
  const dispatch = useDispatch();
  const { id: templateId } = useParams();

  const isDataFetchedOnce = useRef(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isStoreChanged, setIsStoreChanged] = useState(false);

  const { templates, loading, error } = useSelector((state) => state.polotno);

  const templateData = useMemo(() => {
    return templates[templateId] || null;
  }, [templates, templateId]);

  const shouldFetch = useMemo(() => {
    return templateId && !loading && !isDataFetchedOnce.current;
  }, [templateId, loading]);

  const saveTemplateDetails = async (payload) => {
    try {
      setIsSaving(true);
      dispatch(saveTemplateDetailsAction({ templateId, data: payload }));
      await TemplateService(CONFIG[env]).saveTemplateDetails(
        templateId,
        payload
      );
      setIsStoreChanged(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Template Details");
    } finally {
      setIsSaving(false);
    }
  };

  const storeChanged = useCallback(() => {
    setIsStoreChanged(true);
  }, []);

  useEffect(() => {
    if (shouldFetch && templateId && env) {
      isDataFetchedOnce.current = true;
      dispatch(fetchTemplateDetails({ templateId, baseURL: CONFIG[env] }));
    }
  }, [shouldFetch, templateId, env, dispatch]);

  return {
    error,
    loading,
    isSaving,
    templateId,
    templateData,
    storeChanged,
    isStoreChanged,
    saveTemplateDetails,
  };
};
