import { createContext, useContext, useState, useCallback } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

const ApiContext = createContext({ apiUrl: API_URL, refreshKey: 0, triggerRefresh: () => {} });

export const ApiProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <ApiContext.Provider value={{ apiUrl: API_URL, refreshKey, triggerRefresh }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const ctx = useContext(ApiContext);
  return typeof ctx === "string" ? ctx : ctx.apiUrl;
};

export const useRefreshTrigger = () => useContext(ApiContext).refreshKey ?? 0;
export const useTriggerRefresh = () => useContext(ApiContext).triggerRefresh ?? (() => {});

/** Use full URL for media – works for Cloudinary (http) or local uploads (uploads/...) */
export const useMediaUrl = () => {
  const apiUrl = useApi();
  return (url) => (url?.startsWith("http") ? url : url ? `${apiUrl}/${url}` : "");
};
