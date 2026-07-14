import { useTheme } from "@/context/theme-provider";
import { SunIcon, MoonIcon } from "@phosphor-icons/react";

export default function ThemeSwitch() {
    const { dark, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center fixed! bottom-5 right-5 text-primary bg-black/10 z-9999 cursor-pointer rounded-full glass-card-inset-2 dark:glass-card-inset"
            title="Theme Switcher"
        >
            {dark ? (
                <MoonIcon size={20} color="currentColor" />
            ) : (
                <SunIcon size={20} color="currentColor" />
            )}
        </button>
    );
}
