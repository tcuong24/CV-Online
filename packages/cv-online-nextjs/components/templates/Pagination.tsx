import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination() {
  return (
    <div className="flex items-center justify-center pt-10">
      <nav className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button variant="outline" size="icon">
          1
        </Button>
        <Button variant="ghost" size="icon">
          2
        </Button>
        <Button variant="ghost" size="icon">
          3
        </Button>

        <span className="flex h-9 w-9 items-center justify-center">...</span>

        <Button variant="ghost" size="icon">
          10
        </Button>

        <Button variant="ghost" size="icon">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </nav>
    </div>
  );
}
