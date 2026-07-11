// components/admin/admin-data-table.tsx
//
// Reusable admin data table wrapper.
// Provides a consistently styled <Table> container with header/body styling
// matching the project's card treatment and dark/light mode palette.

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useTheme as useMuiTheme } from "@mui/material/styles";

interface Column {
    key: string;
    label: string;
    width?: string | number;
    align?: "left" | "right" | "center";
}

interface AdminDataTableProps {
    columns: Column[];
    children: React.ReactNode; // <TableRow> elements
    emptyMessage?: string;
    isEmpty?: boolean;
}

export default function AdminDataTable({
    columns,
    children,
    emptyMessage = "No records found.",
    isEmpty = false,
}: AdminDataTableProps) {
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
                overflow: "hidden",
            }}
        >
            <TableContainer>
                <Table sx={{ minWidth: 640 }}>
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                                "& th": {
                                    borderBottom: isDark
                                        ? "1px solid rgba(255,255,255,0.07)"
                                        : "1px solid rgba(0,0,0,0.07)",
                                    py: 1.5,
                                },
                            }}
                        >
                            {columns.map((col) => (
                                <TableCell
                                    key={col.key}
                                    align={col.align || "left"}
                                    width={col.width}
                                    sx={{
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: "text.secondary",
                                        px: 3,
                                    }}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isEmpty ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    align="center"
                                    sx={{ py: 8, border: 0 }}
                                >
                                    <Typography variant="body2" color="text.disabled">
                                        {emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            children
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}

// Re-export styled TableRow and TableCell for consistent row usage
export function AdminTableRow({ children, sx = {}, ...rest }: React.ComponentProps<typeof TableRow>) {
    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    return (
        <TableRow
            sx={{
                "&:last-child td": { border: 0 },
                "& td": {
                    borderBottom: isDark
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "1px solid rgba(0,0,0,0.05)",
                    py: 1.75,
                },
                "&:hover": {
                    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
                },
                transition: "background-color 0.15s",
                ...sx,
            }}
            {...rest}
        >
            {children}
        </TableRow>
    );
}

export function AdminTableCell({ children, sx = {}, ...rest }: React.ComponentProps<typeof TableCell>) {
    return (
        <TableCell sx={{ px: 3, fontSize: "0.875rem", ...sx }} {...rest}>
            {children}
        </TableCell>
    );
}
