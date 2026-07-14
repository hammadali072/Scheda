import { Link } from "react-router-dom";
import TitleComponent from "@/components/shared/TitleComponent";

export default function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-start via-primary to-primary-end px-4 text-black">
            <div className="w-full max-w-md rounded-[32px] border border-black/10 bg-white/70 p-8 text-center shadow-xl backdrop-blur">
                <TitleComponent size="extra-large-bold" className="mb-3 text-black">
                    Page not found
                </TitleComponent>
                <TitleComponent size="base" className="mb-6 text-black/70">
                    The page you are looking for does not exist or has moved.
                </TitleComponent>
                <Link to="/" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">
                    Go home
                </Link>
            </div>
        </main>
    );
}
