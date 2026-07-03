// components/ui/mui-provider.tsx
//
// Does NOT replace your existing theme-provider.tsx — that file is untouched
// and stays the single source of truth for dark/light state (via its own
// React Context + localStorage + the "dark" class on <html>).
//
// This component sits INSIDE your existing <ThemeProvider>, reads the
// `dark` boolean from your `useTheme()` hook, and feeds it into MUI's
// ThemeProvider so MUI components (Button, Card, TextField, etc.) switch
// palettes in sync with your Tailwind dark: classes and theme-switch.tsx.
//
// Requires: npm install @mui/material @mui/material-nextjs @emotion/react @emotion/styled

"use client";

import * as React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { useTheme } from "./theme-provider";
import { getMuiTheme } from "@/lib/theme/mui-theme";

export function MuiProvider({ children }: { children: React.ReactNode }) {
    const { dark } = useTheme();
    const muiTheme = React.useMemo(() => getMuiTheme(dark ? "dark" : "light"), [dark]);

    return (
        <AppRouterCacheProvider options={{ key: "mui" }}>
            <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
        </AppRouterCacheProvider>
    );
}