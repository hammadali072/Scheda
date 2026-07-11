// components/admin/search-filter-bar.tsx

"use client";
//
// Shared Search & Filters row component.
// Houses a responsive text search box and permits custom dropdown select items as children.

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

interface SearchFilterBarProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    searchPlaceholder?: string;
    children?: React.ReactNode;
}

export default function SearchFilterBar({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",
    children,
}: SearchFilterBarProps) {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    return (
        <Card
            elevation={0}
            variant="outlined"
            sx={{
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                bgcolor: isDark ? "#161616" : "#ffffff",
                borderRadius: 3,
                mb: 3,
            }}
        >
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                {/* Search Text Field */}
                <Box className="flex-grow w-full">
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <MagnifyingGlassIcon size={18} className="text-zinc-400 mr-2 flex-shrink-0" />
                                ),
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                </Box>

                {/* Optional filters/dropdowns row */}
                {children && (
                    <Box className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
                        {children}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
