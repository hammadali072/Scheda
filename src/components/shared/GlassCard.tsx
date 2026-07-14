import * as React from "react";
import clsx from "clsx";

type GlassVariant = "inset" | "inset-2" | "effect";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
    ...rest
}: GlassCardProps) {
    return (
        <div
            className={clsx("rounded-2xl p-6", variantClassMap[glassVariant], className)}
            {...rest}
        >
            {children}
        </div>
    );
}
