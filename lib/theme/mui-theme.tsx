// lib/theme/mui-theme.ts
//
// Generates the MUI theme for a given mode. Kept separate from the
// theme-provider component so the provider stays focused on wiring
// context/state, not token definitions.
//
// IMPORTANT: hex values here are duplicated from the @theme block in
// globals.css because MUI's internal color utilities (hover/disabled state
// calculations) need real resolvable values, not var(--color-x) strings.
// If you change a color in globals.css, update it here too.

import { createTheme, type PaletteMode } from "@mui/material/styles";

const tokens = {
    primary: "#1d4ed8",
    primaryStart: "#8aa6f2",
    primaryEnd: "#1d4ed8",
    tintGray: "#f8f8f8",
    black: "#0a0a0a",
    tintBlack: "#2f2f2f",
    grey: "#4e4e4e",
};

export function getMuiTheme(mode: PaletteMode) {
    const isDark = mode === "dark";

    return createTheme({
        palette: {
            mode,
            primary: {
                main: tokens.primary,
                light: tokens.primaryStart,
                dark: tokens.primaryEnd,
                contrastText: "#ffffff",
            },
            background: {
                default: isDark ? tokens.black : tokens.tintGray,
                paper: isDark ? tokens.tintBlack : "#ffffff",
            },
            text: {
                primary: isDark ? "#f8f8f8" : tokens.black,
                secondary: isDark ? "#a3a3a3" : tokens.grey,
            },
            divider: isDark
                ? "color-mix(in srgb, #ffffff 12%, transparent)"
                : "color-mix(in srgb, #0a0a0a 12%, transparent)",
        },
        shape: { borderRadius: 12 },
        typography: {
            fontFamily: "var(--font-geist), system-ui, sans-serif",
            h1: { fontWeight: 800, letterSpacing: "-0.03em" },
            h2: { fontWeight: 700, letterSpacing: "-0.02em" },
            h3: { fontWeight: 700, letterSpacing: "-0.02em" },
            h4: { fontWeight: 700, letterSpacing: "-0.01em" },
            h5: { fontWeight: 600, letterSpacing: "-0.01em" },
            h6: { fontWeight: 600, letterSpacing: "-0.01em" },
            button: { textTransform: "none", fontWeight: 600 },
        },
        components: {
            MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
            MuiButton: {
                styleOverrides: { root: { borderRadius: 10, paddingInline: 20, paddingBlock: 10 } },
            },
            MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
        },
    });
}