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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedDensity = localStorage.getItem('density');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
    if (savedDensity) {
      setIsCompact(savedDensity === 'compact');
    }
  }, []);

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

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme: isDarkMode ? 'dark' : 'light',
    // density
    isCompact,
    toggleDensity,
    setDensity,
    density: isCompact ? 'compact' : 'comfortable',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
