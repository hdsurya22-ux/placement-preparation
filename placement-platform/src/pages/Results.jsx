import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card";
import { loadHistory, saveHistory, SKILL_CATEGORIES } from "../lib/analysis";

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

function getExtractedSkillList(extractedSkills) {
  if (!extractedSkills?.categories) return [];
  const all = Object.values(extractedSkills.categories).flat();
  return [...new Set(all)];
}

function buildConfidenceMap(skills, existingMap = {}) {
  const next = { ...existingMap };
  skills.forEach((skill) => {
    if (next[skill] !== "know" && next[skill] !== "practice") {
      next[skill] = "practice";
    }
  });
  return next;
}

function computeLiveReadiness(baseReadinessScore, skills, confidenceMap) {
  let score = baseReadinessScore;
  skills.forEach((skill) => {
    score += confidenceMap[skill] === "know" ? 2 : -2;
  });
  return clampScore(score);
}

function renderChecklistText(checklist) {
  return checklist
    .map((round) => {
      const items = round.items.map((item) => `- ${item}`).join("\n");
      return `${round.round}\n${items}`;
    })
    .join("\n\n");
}

function renderPlanText(plan) {
  return plan
    .map((day) => {
      const items = day.items.map((item) => `- ${item}`).join("\n");
      return `${day.day} (${day.focus})\n${items}`;
    })
    .join("\n\n");
}

function renderQuestionsText(questions) {
  return questions.map((question, idx) => `${idx + 1}. ${question}`).join("\n");
}

async function copyText(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

function Results() {
  const [searchParams] = useSearchParams();
  const [entry, setEntry] = useState(null);
  const [copyState, setCopyState] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const history = loadHistory();
    if (!history.length) return;

    const id = searchParams.get("id");
    let selected = null;
    if (id) {
      selected = history.find((item) => item.id === id);
    }

    const picked = selected || history[history.length - 1];
    const extractedSkills = picked.extractedSkills || { categories: {} };
    const skills = getExtractedSkillList(extractedSkills);
    const baseReadinessScore =
      typeof picked.baseReadinessScore === "number"
        ? picked.baseReadinessScore
        : picked.readinessScore;

    const skillConfidenceMap = buildConfidenceMap(
      skills,
      picked.skillConfidenceMap || {}
    );

    const readinessScore = computeLiveReadiness(
      baseReadinessScore,
      skills,
      skillConfidenceMap
    );

    const normalized = {
      ...picked,
      baseReadinessScore,
      skillConfidenceMap,
      readinessScore
    };

    const updatedHistory = history.map((item) =>
      item.id === normalized.id ? normalized : item
    );
    saveHistory(updatedHistory);
    setEntry(normalized);
  }, [searchParams]);

  const extractedSkillList = useMemo(
    () => getExtractedSkillList(entry?.extractedSkills),
    [entry]
  );

  const weakSkills = useMemo(() => {
    if (!entry) return [];
    return extractedSkillList
      .filter((skill) => entry.skillConfidenceMap?.[skill] !== "know")
      .slice(0, 3);
  }, [entry, extractedSkillList]);

  function persistEntry(nextEntry) {
    const history = loadHistory();
    const updated = history.map((item) =>
      item.id === nextEntry.id ? nextEntry : item
    );
    saveHistory(updated);
    setEntry(nextEntry);
  }

  function setSkillConfidence(skill, value) {
    if (!entry) return;

    const nextMap = {
      ...entry.skillConfidenceMap,
      [skill]: value
    };

    const nextScore = computeLiveReadiness(
      entry.baseReadinessScore,
      extractedSkillList,
      nextMap
    );

    const nextEntry = {
      ...entry,
      skillConfidenceMap: nextMap,
      readinessScore: nextScore
    };

    persistEntry(nextEntry);
  }

  async function handleCopyPlan() {
    if (!entry) return;
    const text = renderPlanText(entry.plan || []);
    await copyText(text);
    setCopyState("7-day plan copied");
  }

  async function handleCopyChecklist() {
    if (!entry) return;
    const text = renderChecklistText(entry.checklist || []);
    await copyText(text);
    setCopyState("Round checklist copied");
  }

  async function handleCopyQuestions() {
    if (!entry) return;
    const text = renderQuestionsText(entry.questions || []);
    await copyText(text);
    setCopyState("10 questions copied");
  }

  function handleDownloadTxt() {
    if (!entry) return;

    const sections = [
      `Placement Readiness Report`,
      `Date: ${new Date(entry.createdAt).toLocaleString()}`,
      `Company: ${entry.company || "Unknown company"}`,
      `Role: ${entry.role || "Role not specified"}`,
      `Readiness Score: ${entry.readinessScore}/100`,
      "",
      "Key Skills",
      extractedSkillList
        .map(
          (skill) =>
            `- ${skill}: ${entry.skillConfidenceMap?.[skill] === "know" ? "I know this" : "Need practice"}`
        )
        .join("\n"),
      "",
      "Round-wise Preparation Checklist",
      renderChecklistText(entry.checklist || []),
      "",
      "7-day Plan",
      renderPlanText(entry.plan || []),
      "",
      "10 Likely Interview Questions",
      renderQuestionsText(entry.questions || [])
    ];

    const content = sections.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `placement-readiness-${entry.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setCopyState("TXT downloaded");
  }

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
          <div className="text-xs text-slate-400">Live readiness score</div>
          <div className="text-2xl font-semibold text-slate-50">
            {entry.readinessScore}/100
          </div>
          <div className="text-[11px] text-slate-500">
            Base: {entry.baseReadinessScore}/100
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopyPlan}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-900 transition-colors"
        >
          Copy 7-day plan
        </button>
        <button
          type="button"
          onClick={handleCopyChecklist}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-900 transition-colors"
        >
          Copy round checklist
        </button>
        <button
          type="button"
          onClick={handleCopyQuestions}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-900 transition-colors"
        >
          Copy 10 questions
        </button>
        <button
          type="button"
          onClick={handleDownloadTxt}
          className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Download as TXT
        </button>
        {copyState && <span className="text-xs text-slate-400 self-center">{copyState}</span>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Skills Extracted</CardTitle>
            <CardDescription>
              Toggle each skill as "I know this" or "Need practice".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs">
              {extractedSkills.hasAny ? (
                Object.entries(SKILL_CATEGORIES).map(([key, meta]) => {
                  const items = extractedSkills.categories[key] || [];
                  if (!items.length) return null;
                  return (
                    <div key={key} className="space-y-2">
                      <div className="font-semibold text-slate-200">{meta.label}</div>
                      <div className="space-y-2">
                        {items.map((skill) => {
                          const selected = entry.skillConfidenceMap?.[skill] || "practice";
                          const knowActive = selected === "know";
                          return (
                            <div
                              key={skill}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1.5"
                            >
                              <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-0.5 text-[11px] text-slate-100">
                                {skill}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSkillConfidence(skill, "know")}
                                  className={[
                                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                                    knowActive
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                      : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                                  ].join(" ")}
                                >
                                  I know this
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSkillConfidence(skill, "practice")}
                                  className={[
                                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                                    !knowActive
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                      : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                                  ].join(" ")}
                                >
                                  Need practice
                                </button>
                              </div>
                            </div>
                          );
                        })}
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

      <Card>
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
          <CardDescription>
            Focus on your top weak skills and continue with a calm next step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {weakSkills.length > 0 ? (
              weakSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-300">No weak skills marked right now.</span>
            )}
          </div>
          <p className="text-sm text-slate-200">Start Day 1 plan now.</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-xs text-slate-400">
        <button
          type="button"
          onClick={() => navigate("/dashboard/profile")}
          className="rounded-full border border-slate-700 px-3 py-1 hover:bg-slate-900 text-slate-100 transition-colors"
        >
          View History
        </button>
        <span>Edits are stored locally per history entry in localStorage.</span>
      </div>
    </section>
  );
}

export default Results;
