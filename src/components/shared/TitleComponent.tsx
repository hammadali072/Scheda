import React from "react";
import clsx from "clsx";

type ParagraphSize =
    | "extra-small" | "extra-small-medium" | "extra-small-semibold" | "extra-small-bold"
    | "small" | "small-medium" | "small-semibold" | "small-bold"
    | "base" | "base-medium" | "base-semibold" | "base-bold"
    | "large" | "large-medium" | "large-semibold" | "large-bold"
    | "extra-large" | "extra-large-medium" | "extra-large-semibold" | "extra-large-bold";

interface TitleComponentProps {
    size?: ParagraphSize;
    className?: string;
    children: React.ReactNode;
}

const PARAGRAPH_CLASSES: Record<ParagraphSize, string> = {
    "extra-small": "text-xs font-normal tracking-half",
    "extra-small-medium": "text-xs font-medium tracking-half",
    "extra-small-semibold": "text-xs font-semibold tracking-half",
    "extra-small-bold": "text-xs font-bold tracking-half",
    small: "text-sm font-normal tracking-half",
    "small-medium": "text-sm font-medium tracking-half",
    "small-semibold": "text-sm font-semibold tracking-half",
    "small-bold": "text-sm font-bold tracking-half",
    base: "text-base font-normal tracking-half",
    "base-medium": "text-base font-medium tracking-half",
    "base-semibold": "text-base font-semibold tracking-half",
    "base-bold": "text-base font-bold tracking-half",
    large: "text-base l:text-lg font-normal tracking-half",
    "large-medium": "text-base l:text-lg font-medium tracking-half",
    "large-semibold": "text-base l:text-lg font-semibold tracking-half",
    "large-bold": "text-base l:text-lg font-bold tracking-half",
    "extra-large": "text-lg l:text-xl font-normal tracking-half",
    "extra-large-medium": "text-lg l:text-xl font-medium tracking-half",
    "extra-large-semibold": "text-lg l:text-xl font-semibold tracking-half",
    "extra-large-bold": "text-lg l:text-xl font-bold tracking-half",
};

const TitleComponent: React.FC<TitleComponentProps> = ({ size = "base", className = "", children }) => {
    const typeClass = PARAGRAPH_CLASSES[size];
    return <p className={clsx(typeClass, className)}>{children}</p>;
};

export default TitleComponent;
