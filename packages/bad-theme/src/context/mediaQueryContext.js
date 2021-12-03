import { createContext, useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const ThemeContext = createContext();

export function muiQuery() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("muiQuery must be used within a MediaProvider");
  }
  return context;
}

export const MediaProvider = ({ children }) => {
  const sm = useMediaQuery("(max-width:576px)");
  const md = useMediaQuery("(max-width:768px)");
  const lg = useMediaQuery("(max-width:992px)");
  const xl = useMediaQuery("(max-width:1200px)");

  return (
    <ThemeContext.Provider value={{ sm, md, lg, xl }}>
      {children}
    </ThemeContext.Provider>
  );
};
