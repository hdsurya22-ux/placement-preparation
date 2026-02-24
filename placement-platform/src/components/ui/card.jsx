import React from "react";

function baseClass(extra) {
  return [
    "rounded-xl border border-slate-800 bg-slate-900/40 text-slate-100 shadow-sm",
    extra
  ]
    .filter(Boolean)
    .join(" ");
}

export function Card({ className = "", ...props }) {
  return <div className={baseClass(className)} {...props} />;
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div
      className={["flex flex-col space-y-1.5 px-6 pt-5", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3
      className={["text-sm font-semibold leading-none tracking-tight", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }) {
  return (
    <p
      className={["text-xs text-slate-400", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div
      className={["px-6 pb-5 pt-3 text-sm", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

