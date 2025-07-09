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

  const deleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter(
      (template) => template.id !== templateId
    );
    setTemplates(updatedTemplates);
  };

  const getTemplate = (templateId) => {
    const template = templates.find((template) => template.id === templateId);
    return template;
  };

  const duplicateTemplate = (templateId) => {
    const template = getTemplate(templateId);
    if (template) {
      const duplicate = {
        ...template,
        id: `template-${Date.now()}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      const updatedTemplates = [...templates, duplicate];
      setTemplates(updatedTemplates);
      return duplicate;
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    duplicateTemplate,
    refreshTemplates,
  };
};
