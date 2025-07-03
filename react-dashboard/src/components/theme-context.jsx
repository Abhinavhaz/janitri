import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeContext } from "./theme-context";

export default function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          ...(darkMode
            ? {
                background: {
                  default: "#18191A",
                  paper: "#242526",
                },
                text: {
                  primary: "#E4E6EB",
                  secondary: "#B0B3B8",
                },
              }
            : {
                background: {
                  default: "#fff",
                  paper: "#f5f5f5",
                },
                text: {
                  primary: "#222",
                  secondary: "#555",
                },
              }),
        },
      }),
    [darkMode]
  );

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    document.body.classList.toggle("light-theme", !darkMode);
  }, [darkMode]);

  const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
} 