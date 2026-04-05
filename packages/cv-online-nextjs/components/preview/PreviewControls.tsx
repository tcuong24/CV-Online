import React from "react";

export function PreviewControls() {
  return (
    <div className="flex justify-between gap-2 px-4 py-2 rounded-lg bg-card border">
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <span className="material-symbols-outlined text-lg">zoom_in</span>
        </button>

        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <span className="material-symbols-outlined text-lg">zoom_out</span>
        </button>

        <div className="w-px h-6 bg-border mx-1"></div>

        <span className="text-sm font-medium text-muted-foreground">100%</span>
      </div>

      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
        <span className="material-symbols-outlined text-lg">fullscreen</span>
      </button>
    </div>
  );
}
