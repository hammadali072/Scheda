import * as React from "react";
import MuiButton, { ButtonProps } from "@mui/material/Button";

export default function Button({ variant = "contained", ...rest }: ButtonProps) {
    return <MuiButton variant={variant} {...rest} />;
}