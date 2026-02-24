import React, { useState } from "react";
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
  const [readiness, setReadiness] = useState(72);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">Overview</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          A quick snapshot of your placement readiness, active skills, and the
          next steps to keep momentum.
        </p>
      </div>

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
              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Adjust readiness (0–100)</span>
                  <span className="font-medium text-slate-100">
                    {readiness}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={readiness}
                  onChange={(e) => setReadiness(Number(e.target.value))}
                  className="w-full accent-primary"
                />
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

