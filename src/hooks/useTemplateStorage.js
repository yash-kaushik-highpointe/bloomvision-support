import { useState, useEffect } from "react";
import TemplateService from "../services/template";

import { CONFIG } from "../App";

export const useTemplateStorage = (env) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTemplates = await TemplateService(
        CONFIG[env]
      ).getTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      setError(error.message);
      toast.error("Unable to load templates");
    } finally {
      setLoading(false);
    }
  };

  const refreshTemplates = () => {
    loadTemplates();
  };

  const createTemplate = (newTemplate) => {
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
  };

  const updateTemplate = (updatedTemplate) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((t) =>
        t.id === updatedTemplate.id ? updatedTemplate : t
      )
    );
  };

  const deleteTemplate = ({ id }) => {
    const updatedTemplates = templates.filter((template) => template.id !== id);
    setTemplates(updatedTemplates);
  };

  const getTemplate = (templateId) => {
    const template = templates.find((template) => template.id === templateId);
    return template;
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates,
  };
};
