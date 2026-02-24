import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadHistory } from "../lib/analysis";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "../components/ui/card";

function Resources() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setEntries(loadHistory().slice().reverse());
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">History</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          Recent job description analyses stored on this device. Selecting an
          entry opens the detailed results view.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">
          No analyses yet. Run an analysis from the Dashboard to see history
          here.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer hover:bg-slate-900/60 transition-colors"
              onClick={() => navigate(`/results?id=${entry.id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-sm">
                    {entry.company || "Unknown company"} •{" "}
                    {entry.role || "Role not specified"}
                  </CardTitle>
                  <CardDescription>
                    {new Date(entry.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Readiness</div>
                  <div className="text-sm font-semibold text-slate-100">
                    {entry.readinessScore}/100
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-xs text-slate-400">
                  {entry.jdText || "No description stored."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default Resources;

