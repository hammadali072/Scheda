"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
    dark: boolean;
    toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>({ dark: false, toggle: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("scheda-theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = saved === "dark" || (!saved && prefersDark);
        setDark(initial);
        document.documentElement.classList.toggle("dark", initial);
    }, []);

    useEffect(() => {
        localStorage.setItem("scheda-theme", dark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    const toggle = () => setDark((d) => !d);

    return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
