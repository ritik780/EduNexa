import { createContext, useContext } from "react";

// Automatically uses deployed backend on Vercel
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://edunexa-13es.onrender.com";

const ApiContext = createContext(API_URL);

export const ApiProvider = ({ children }) => {
  return (
    <ApiContext.Provider value={API_URL}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
