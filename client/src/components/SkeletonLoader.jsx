import React from "react";

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-4 border border-slate-200 bg-white">
          <div className="flex justify-between items-center">
            <div className="h-5 w-24 rounded-full skeleton-box"></div>
            <div className="h-4 w-20 rounded skeleton-box"></div>
          </div>
          <div className="h-6 w-3/4 rounded skeleton-box"></div>
          <div className="h-4 w-1/2 rounded skeleton-box"></div>
          <div className="space-y-2 py-2">
            <div className="h-3 w-full rounded skeleton-box"></div>
            <div className="h-3 w-5/6 rounded skeleton-box"></div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-5 w-14 rounded skeleton-box"></div>
            <div className="h-5 w-14 rounded skeleton-box"></div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="h-4 w-28 rounded skeleton-box"></div>
            <div className="h-8 w-20 rounded-lg skeleton-box"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-3 border border-slate-200 bg-white">
      <div className="h-8 w-full rounded-lg skeleton-box mb-4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 w-full rounded-lg skeleton-box"></div>
      ))}
    </div>
  );
}
