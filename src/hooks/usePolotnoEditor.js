import { useRef, useEffect, useState } from "react";
import { createStore } from "polotno/model/store";

const POLOTNO_API_KEY = import.meta.env.VITE_POLOTNO_API_KEY;

export const usePolotnoEditor = (storeChanged, templateData) => {
  const storeRef = useRef(
    createStore({
      key: POLOTNO_API_KEY,
      showCredit: false,
    })
  );

  const store = storeRef.current;

  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    if (!store || !storeReady) return;

    store.on("change", () => {
      storeChanged();
    });

    return () => {
      store.clear();
    };
  }, [storeChanged, store, storeReady]);

  useEffect(() => {
    if (templateData) {
      if (templateData.data) store.loadJSON(templateData.data);
      else store.addPage();
      setTimeout(() => {
        setStoreReady(true);
      }, 500);
    }
  }, [templateData?.data]);

  return { store, storeReady };
};
