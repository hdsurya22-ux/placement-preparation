import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  extractSkills,
  computeReadinessScore,
  buildChecklist,
  buildPlan,
  buildQuestions,
  loadHistory,
  saveHistory
} from "../lib/analysis";

const skillData = [
  { skill: "DSA", value: 75 },
  { skill: "System Design", value: 60 },
  { skill: "Communication", value: 80 },
  { skill: "Resume", value: 85 },
  { skill: "Aptitude", value: 70 }
];

const weeklyActivity = [
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: true },
  { day: "Thu", active: false },
  { day: "Fri", active: true },
  { day: "Sat", active: false },
  { day: "Sun", active: false }
];

function ProgressRing({ score }) {
  const radius = 70;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = ((100 - score) / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="rgba(148, 163, 184, 0.2)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="hsl(245, 58%, 51%)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 0.6s ease-out"
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-semibold text-slate-50">
          {score}/100
        </div>
        <div className="text-xs text-slate-400 mt-1">Readiness Score</div>
      </div>
    </div>
  );
}

function ProgressBar({ value, max }) {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-200"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function DashboardFixed() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [entry, setEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const history = loadHistory();
    if (history.length > 0) {
      setEntry(history[history.length - 1]);
    }
  }, []);

  const readiness = entry ? entry.readinessScore : 72;

  function handleAnalyze() {
    const extracted = extractSkills(jdText);
    const checklist = buildChecklist(extracted);
    const plan = buildPlan(extracted);
    const questions = buildQuestions(extracted);
    const readinessScore = computeReadinessScore({
      categoriesPresent: extracted.categoriesPresent,
      company,
      role,
      jdText
    });

    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      company: company.trim(),
      role: role.trim(),
      jdText,
      extractedSkills: extracted,
      plan,
      checklist,
      questions,
      readinessScore
    };

    const history = loadHistory();
    const updated = [...history, newEntry];
    saveHistory(updated);
    setEntry(newEntry);
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Overview</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          A quick snapshot of your placement readiness, active skills, and the
          next steps to keep momentum.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description Analysis</CardTitle>
          <CardDescription>
            Paste a job description to extract skills, generate a plan, and
            update your readiness score. Analyses are stored locally.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Company (optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. KodNest"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Role (optional)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. SDE Intern"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Job description text
              </label>
              <textarea
                rows={5}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-vertical"
                placeholder="Paste the JD here..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {entry ? (
                  <span>
                    Latest readiness score:{" "}
                    <span className="font-semibold text-slate-100">
                      {entry.readinessScore}/100
                    </span>{" "}
                    •{" "}
                    {new Date(entry.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </span>
                ) : (
                  <span>
                    No analysis yet. Paste a JD and run your first analysis.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Analyze JD
                </button>
                {entry && (
                  <button
                    type="button"
                    onClick={() => navigate("/results")}
                    className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-900 transition-colors"
                  >
                    View full results
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Readiness</CardTitle>
              <CardDescription>
                Composite score based on your recent practice and assessments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative flex items-center justify-center py-4">
                <ProgressRing score={readiness} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continue Practice</CardTitle>
              <CardDescription>
                Resume from where you left off.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-slate-200 font-medium">
                      Dynamic Programming
                    </div>
                    <div className="text-xs text-slate-400">
                      Topic • 3 of 10 problems completed
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">30%</span>
                </div>
                <ProgressBar value={3} max={10} />
                <button
                  type="button"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Goals</CardTitle>
              <CardDescription>
                Stay consistent across the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Problems Solved</span>
                    <span className="text-slate-300">12 / 20</span>
                  </div>
                  <ProgressBar value={12} max={20} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  {weeklyActivity.map((d) => (
                    <div
                      key={d.day}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={[
                          "h-6 w-6 rounded-full border flex items-center justify-center",
                          d.active
                            ? "bg-primary/20 border-primary text-primary"
                            : "border-slate-700 text-slate-500"
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </div>
                      <span>{d.day[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Breakdown</CardTitle>
              <CardDescription>
                Relative strength across core placement dimensions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillData}>
                    <PolarGrid stroke="rgba(148, 163, 184, 0.4)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: "#cbd5f5", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      tickCount={5}
                      axisLine={false}
                    />
                    <Radar
                      name="Skill"
                      dataKey="value"
                      stroke="hsl(245, 58%, 51%)"
                      fill="hsl(245, 58%, 51%)"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assessments</CardTitle>
              <CardDescription>
                Block focused time for the next three evaluations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-100">
                      DSA Mock Test
                    </div>
                    <div className="text-xs text-slate-400">
                      Tomorrow, 10:00 AM
                    </div>
                  </div>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-100">
                      System Design Review
                    </div>
                    <div className="text-xs text-slate-400">Wed, 2:00 PM</div>
                  </div>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-100">
                      HR Interview Prep
                    </div>
                    <div className="text-xs text-slate-400">
                      Friday, 11:00 AM
                    </div>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default DashboardFixed;

