import { useRef, useEffect, useState } from "react";
import { createStore } from "polotno/model/store";

const POLOTNO_API_KEY = import.meta.env.VITE_POLOTNO_API_KEY;

export const usePolotnoEditor = () => {
  const storeRef = useRef(
    createStore({
      key: POLOTNO_API_KEY,
      showCredit: false,
    })
  );

  const store = storeRef.current;
  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    if (store.pages.length === 0) {
      store.addPage();
      setStoreReady(true);
    }
  }, [store]);

  return { store, storeReady };
};
