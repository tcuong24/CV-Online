import React from "react";

export function BreadcrumbNav() {
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <a className="hover:text-foreground" href="#">
        Dashboard
      </a>
      <span>/</span>
      <a className="hover:text-foreground" href="#">
        CV của tôi
      </a>
      <span>/</span>
      <span className="text-foreground">Xem trước</span>
    </div>
  );
}
