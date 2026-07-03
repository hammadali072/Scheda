// src/components/ui/Button.tsx
//
// Thin wrapper around MUI's Button so the rest of the app imports from here
// instead of '@mui/material/Button' directly — gives one place to change
// default variant/color project-wide later.

import * as React from "react";
import MuiButton, { ButtonProps } from "@mui/material/Button";

export default function Button({ variant = "contained", ...rest }: ButtonProps) {
    return <MuiButton variant={variant} {...rest} />;
}