import { useState, useCallback } from "react";

export function useFormModal() {
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState({});

  const openForm = useCallback((formType, data = {}) => {
    setActiveForm(formType);
    setFormData(data);
  }, []);

  const closeForm = useCallback(() => {
    setActiveForm(null);
    setFormData({});
  }, []);

  return {
    activeForm,
    formData,
    openForm,
    closeForm,
    isOpen: activeForm !== null,
  };
}
