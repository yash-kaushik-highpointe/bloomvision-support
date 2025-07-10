import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createStore } from "polotno/model/store";
import { deleteMetadataEntry } from "../store/slices/polotnoSlice";

const POLOTNO_API_KEY = import.meta.env.VITE_POLOTNO_API_KEY;

export const usePolotnoEditor = (templateId, storeChanged, templateData) => {
  const dispatch = useDispatch();

  const storeInitialSetupDone = useRef();
  const storePreviousElements = useRef(null);

  const storeRef = useRef(
    createStore({
      key: POLOTNO_API_KEY,
      showCredit: false,
    })
  );

  const store = storeRef.current;

  const [storeReady, setStoreReady] = useState(false);

  const handleElementDelete = (element) => {
    if (element && element.id) {
      dispatch(
        deleteMetadataEntry({
          templateId,
          elementId: element.id,
        })
      );
    }
  };

  // Add event listener for element deletion
  useEffect(() => {
    if (!store || !templateId) return;

    // Listen for element deletion events
    store.on("change", () => {
      if (storeInitialSetupDone.current) {
        storeChanged();
      } else {
        storeInitialSetupDone.current = true;
      }

      // Check if any elements were removed
      const currentElements = store.activePage?.children || [];
      const previousElements = storePreviousElements.current || [];

      // Find deleted elements
      const deletedElements = previousElements.filter(
        (prevElement) =>
          !currentElements.find(
            (currElement) => currElement.id === prevElement.id
          )
      );

      // Delete metadata for deleted elements
      deletedElements.forEach((element) => {
        handleElementDelete(element);
      });

      // Update previous elements for next comparison
      storePreviousElements.current = [...currentElements];
    });

    // Initialize previous elements
    storePreviousElements.current = [...(store.activePage?.children || [])];

    return () => {
      // Cleanup if needed
      storePreviousElements.current = null;
    };
  }, [store, templateId, dispatch]);

  useEffect(() => {
    if (templateData?.data) {
      if (templateData?.data?.pages) store.loadJSON(templateData.data);
      else store.addPage();
      setStoreReady(true);
    }
  }, [templateData?.data]);

  return { store, storeReady };
};
