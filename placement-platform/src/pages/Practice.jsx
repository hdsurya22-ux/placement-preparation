import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadHistory } from "../lib/analysis";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card";

const PRACTICE_PROGRESS_KEY = "placement-practice-progress-v1";

function Practice() {
  const [entry, setEntry] = useState(null);
  const [doneMap, setDoneMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const history = loadHistory();
    if (!history.length) return;
    setEntry(history[history.length - 1]);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PRACTICE_PROGRESS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setDoneMap(parsed);
      }
    } catch {
      // ignore storage parse errors
    }
  }, []);

  const questions = entry?.questions || [];
  const revisionItems = useMemo(() => {
    if (!entry) return [];
    const daySeven = entry.plan?.find((day) => day.day === "Day 7");
    const fromPlan = daySeven?.items || [];
    const coreRound = entry.checklist?.find((round) =>
      round.round.includes("Round 2")
    );
    const fromCoreRound = (coreRound?.items || []).slice(0, 2);
    return [...fromPlan, ...fromCoreRound].slice(0, 8);
  }, [entry]);

  const doneCount = questions.reduce(
    (count, _, idx) => count + (doneMap[`q-${idx}`] ? 1 : 0),
    0
  );

  function toggleQuestion(index) {
    const key = `q-${index}`;
    const next = { ...doneMap, [key]: !doneMap[key] };
    setDoneMap(next);
    window.localStorage.setItem(PRACTICE_PROGRESS_KEY, JSON.stringify(next));
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Practice</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          Skill-based practice questions and revision plan from your latest JD
          analysis.
        </p>
      </div>

      {!entry ? (
        <Card>
          <CardHeader>
            <CardTitle>No practice set yet</CardTitle>
            <CardDescription>
              Analyze a JD first to generate interview questions and revision
              items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Practice Questions</CardTitle>
              <CardDescription>
                {doneCount}/{questions.length} completed. Progress is saved in
                localStorage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                {questions.map((question, index) => (
                  <li
                    key={`${question}-${index}`}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
                  >
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 accent-primary"
                        checked={Boolean(doneMap[`q-${index}`])}
                        onChange={() => toggleQuestion(index)}
                      />
                      <span className="text-slate-200">{question}</span>
                    </label>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revision Checklist</CardTitle>
              <CardDescription>
                Focus areas extracted from Day 7 and Core CS prep rounds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2 text-sm text-slate-300">
                {revisionItems.map((item, idx) => (
                  <li key={`${item}-${idx}`}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

export default Practice;

