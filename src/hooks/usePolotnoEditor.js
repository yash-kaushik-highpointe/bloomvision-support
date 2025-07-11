import { useRef, useEffect, useState } from "react";
import { createStore } from "polotno/model/store";

const POLOTNO_API_KEY = import.meta.env.VITE_POLOTNO_API_KEY;

export const usePolotnoEditor = (storeChanged, templateData) => {
  const storeInitialSetupDone = useRef(false);

  const storeRef = useRef(
    createStore({
      key: POLOTNO_API_KEY,
      showCredit: false,
    })
  );

  const store = storeRef.current;

  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    if (!store) return;

    store.on("change", () => {
      if (storeInitialSetupDone.current) storeChanged();
      else storeInitialSetupDone.current = true;
    });
  }, [storeChanged, store]);

  useEffect(() => {
    if (templateData) {
      if (templateData.data) store.loadJSON(templateData.data);
      else store.addPage();
      setStoreReady(true);
    }
  }, [templateData?.data]);

  return { store, storeReady };
};
