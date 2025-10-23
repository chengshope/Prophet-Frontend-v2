import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isCompact, setIsCompact] = useState(() => {
    const saved = localStorage.getItem('density');
    return saved ? saved === 'compact' : false;
  });

  // Now you can remove the first useEffect entirely.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('density', isCompact ? 'compact' : 'comfortable');
  }, [isCompact]);

  const toggleTheme = () => setIsDarkMode((v) => !v);
  const setTheme = (theme) => setIsDarkMode(theme === 'dark');

  const toggleDensity = () => setIsCompact((v) => !v);
  const setDensity = (density) => setIsCompact(density === 'compact');

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        setTheme,
        theme: isDarkMode ? 'dark' : 'light',
        isCompact,
        toggleDensity,
        setDensity,
        density: isCompact ? 'compact' : 'comfortable',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
