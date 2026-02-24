import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Video, BarChart2 } from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="px-8 py-4 flex items-center justify-between border-b border-slate-800">
        <span className="text-sm font-semibold tracking-wide text-primary">
          Placement Readiness Platform
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <section className="max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-50">
              Ace Your Placement
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              Practice, assess, and prepare for your dream job with a focused,
              structured placement readiness workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors duration-150"
          >
            Get Started
          </button>
        </section>

        <section className="mt-16 w-full max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code2 className="h-5 w-5" />
                </span>
                <h2 className="text-base font-semibold text-slate-50">
                  Practice Problems
                </h2>
              </div>
              <p className="text-sm text-slate-300">
                Solve curated coding, aptitude, and CS fundamentals questions.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Video className="h-5 w-5" />
                </span>
                <h2 className="text-base font-semibold text-slate-50">
                  Mock Interviews
                </h2>
              </div>
              <p className="text-sm text-slate-300">
                Rehearse real-world interview scenarios with structured rounds.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BarChart2 className="h-5 w-5" />
                </span>
                <h2 className="text-base font-semibold text-slate-50">
                  Track Progress
                </h2>
              </div>
              <p className="text-sm text-slate-300">
                Visualize your preparation journey and close critical gaps.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights
        reserved.
      </footer>
    </div>
  );
}

export default Landing;

