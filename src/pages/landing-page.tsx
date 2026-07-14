import { Link } from "react-router-dom";
import GlassCard from "@/components/shared/GlassCard";
import TitleComponent from "@/components/shared/TitleComponent";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 text-black sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="z-10 flex w-full max-w-4xl flex-col items-center">
        <GlassCard
          glassVariant="effect"
          className="flex w-full flex-col items-center border border-black/10 bg-white/70 p-8 text-center shadow-xl backdrop-blur sm:p-16 dark:border-white/10 dark:bg-black/40"
        >
          <h1 className="heading-h1 mb-6 max-w-3xl text-black dark:text-white">
            Schedule Your Next Appointment Effortlessly
          </h1>

          <TitleComponent size="large" className="mx-auto mb-10 max-w-2xl text-black/70 dark:text-white/70">
            Scheda bridges clients with organization members for real-time, conflict-free scheduling. Discover providers, explore open slots, and confirm bookings instantly.
          </TitleComponent>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 sm:w-auto"
            >
              Book Now
            </Link>
            <Link
              to="/signup"
              className="flex w-full items-center justify-center rounded-full border border-black/15 bg-white/70 px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto dark:border-white/20 dark:bg-black/20 dark:text-white"
            >
              Create Account
            </Link>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
