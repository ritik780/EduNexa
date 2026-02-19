import { createContext, useContext } from "react";

/*
Change ONLY here when deploying
Local: http://localhost:5000
Render: https://edunexa-backend.onrender.com
*/

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ApiContext = createContext(API_URL);

export const ApiProvider = ({ children }) => {
  return (
    <ApiContext.Provider value={API_URL}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
