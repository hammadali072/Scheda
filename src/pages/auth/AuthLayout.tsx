import * as React from "react";
import { Link } from "react-router-dom";
import GlassCard from "@/components/shared/GlassCard";
import TitleComponent from "@/components/shared/TitleComponent";
import { useTheme } from "@/context/theme-provider";
import logoDark from "@/assets/logo-dark.svg";
import logoLight from "@/assets/logo-light.svg";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    const { dark } = useTheme();
    const logoSrc = dark ? logoDark : logoLight;

    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-start via-primary to-primary-end px-4 py-6 sm:px-6">
            <div className="mx-auto flex max-w-md flex-col gap-6">
                <Link to="/" className="flex items-center gap-3 self-start">
                    <img src={logoSrc} alt="Scheda logo" className="h-8 w-auto" />
                    <TitleComponent size="large-semibold" className="text-black">
                        Scheda
                    </TitleComponent>
                </Link>

                <GlassCard glassVariant="effect" className="rounded-[28px] border border-white/20 bg-white/70 p-6 text-black shadow-xl dark:bg-black/50">
                    <TitleComponent size="extra-large-bold" className="mb-2 text-black">
                        {title}
                    </TitleComponent>
                    <TitleComponent size="base" className="text-black/70">
                        {subtitle}
                    </TitleComponent>
                    <div className="mt-6">{children}</div>
                </GlassCard>
            </div>
        </main>
    );
}
