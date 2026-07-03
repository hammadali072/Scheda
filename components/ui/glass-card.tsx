// src/components/ui/GlassCard.tsx
//
// Thin wrapper around MUI's Paper that applies one of your existing
// glass-card-* utility classes from globals.css instead of MUI's default
// paper background/shadow (which would otherwise hide the glass effect).
//
// Use this ONLY where there's something behind it worth blurring — a gradient
// background, hero image, or colored section. On a flat/plain background,
// a glass effect has nothing to blur and just looks like a faint grey box.

import * as React from "react";
import Paper, { PaperProps } from "@mui/material/Paper";
import clsx from "clsx";

type GlassVariant = "inset" | "inset-2" | "effect";

interface GlassCardProps extends Omit<PaperProps, "variant"> {
    /**
     * inset    -> glass-card-inset      (light glass, use over dark/colored bg)
     * inset-2  -> glass-card-inset-2    (darker glass, slightly more contrast)
     * effect   -> glass-card-effect     (heavy blur, near-opaque dark — hero overlays, modals)
     */
    glassVariant?: GlassVariant;
}

const variantClassMap: Record<GlassVariant, string> = {
    inset: "glass-card-inset",
    "inset-2": "glass-card-inset-2",
    effect: "glass-card-effect",
};

export default function GlassCard({
    glassVariant = "inset",
    className,
    children,
    sx,
    ...rest
}: GlassCardProps) {
    return (
        <Paper
            elevation={0}
            className={clsx(variantClassMap[glassVariant], className)}
            sx={{
                // Strip MUI's default paper background/shadow so the glass utility
                // class (background-color + backdrop-filter + border) is what shows.
                backgroundColor: "transparent",
                boxShadow: "none",
                borderRadius: 4,
                padding: 3,
                ...sx,
            }}
            {...rest}
        >
            {children}
        </Paper>
    );
}