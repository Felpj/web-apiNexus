import { createContext, ReactNode } from 'react';

interface ThemeContextProps {
  children: ReactNode;
}

export const ThemeContext = createContext({});

export function ThemeProvider({ children }: ThemeContextProps) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
