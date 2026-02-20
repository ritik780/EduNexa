import { createContext, useContext } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

const ApiContext = createContext(API_URL);

export const ApiProvider = ({ children }) => {
  return (
    <ApiContext.Provider value={API_URL}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
