import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { loadHistory } from "../lib/analysis";

function Profile() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(loadHistory().slice().reverse());
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-50">History</h2>
        <p className="text-sm text-slate-300 max-w-xl">
          Saved analyses from localStorage. Click an entry to open it on Results.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Entries</CardTitle>
          <CardDescription>
            Date, company, role, and readiness score for each analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!history.length ? (
            <p className="text-sm text-slate-300">
              No saved entries yet. Run an analysis from Dashboard first.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => navigate(`/results?id=${entry.id}`)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left hover:border-primary/60 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium text-slate-100">
                      {entry.company || "Unknown company"}
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {entry.readinessScore}/100
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-300">
                    {(entry.role || "Role not specified") + " | "}
                    {new Date(entry.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default Profile;
