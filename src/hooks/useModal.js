import { useState, useCallback } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState();

  const openModal = useCallback((modalData) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData();
  }, []);

  const resetModal = useCallback(() => {
    setIsOpen(false);
    setData();
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    resetModal,
  };
}
