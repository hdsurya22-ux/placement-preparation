import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card";
import { loadHistory, SKILL_CATEGORIES } from "../lib/analysis";

function Results() {
  const [searchParams] = useSearchParams();
  const [entry, setEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const history = loadHistory();
    if (!history.length) return;

    const id = searchParams.get("id");
    let selected = null;
    if (id) {
      selected = history.find((item) => item.id === id);
    }

    setEntry(selected || history[history.length - 1]);
  }, [searchParams]);

  if (!entry) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">Results</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          No saved analysis found. Run an analysis from the Dashboard first.
        </p>
      </section>
    );
  }

  const { extractedSkills, checklist, plan, questions } = entry;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">
            Analysis Results
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            {(entry.company || "Unknown company") + " | "}
            {(entry.role || "Role not specified") + " | "}
            {new Date(entry.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short"
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Readiness score</div>
          <div className="text-2xl font-semibold text-slate-50">
            {entry.readinessScore}/100
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Skills Extracted</CardTitle>
            <CardDescription>
              Grouped by category based on the job description text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              {extractedSkills.hasAny ? (
                Object.entries(SKILL_CATEGORIES).map(([key, meta]) => {
                  const items = extractedSkills.categories[key] || [];
                  if (!items.length) return null;
                  return (
                    <div key={key}>
                      <div className="mb-1 font-semibold text-slate-200">
                        {meta.label}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-slate-700 bg-slate-900/60 px-2 py-0.5 text-[11px] text-slate-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-300">
                  No specific stack detected. <span className="font-semibold">General fresher stack</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Round-wise Preparation Checklist</CardTitle>
            <CardDescription>
              Four rounds with focused checkpoints tailored to detected skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-xs">
              {checklist.map((round) => (
                <div key={round.round} className="space-y-1.5">
                  <div className="font-semibold text-slate-200">{round.round}</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    {round.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7-day Plan</CardTitle>
            <CardDescription>
              Day-by-day prep path adapted from the extracted stack.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              {plan.map((day) => (
                <div key={day.day} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{day.day}</span>
                    <span className="text-[11px] text-slate-400">{day.focus}</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    {day.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Likely Interview Questions</CardTitle>
            <CardDescription>
              Ten skill-specific questions based on detected keywords.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-slate-300">
              {questions.map((question, idx) => (
                <li key={idx}>{question}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400">
        <button
          type="button"
          onClick={() => navigate("/dashboard/profile")}
          className="rounded-full border border-slate-700 px-3 py-1 hover:bg-slate-900 text-slate-100 transition-colors"
        >
          View History
        </button>
        <span>Entries are stored locally in this browser via localStorage.</span>
      </div>
    </section>
  );
}

export default Results;
