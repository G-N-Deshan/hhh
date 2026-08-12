import React from "react";

export default function Loader({ text = "Loading OpportunityBridge..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-900/30 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-slate-800/40 border-t-rose-600 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
}
