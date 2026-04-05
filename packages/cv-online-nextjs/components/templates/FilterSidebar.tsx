import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function FilterSidebar() {
  const industries = [
    { id: "c1", label: "IT & Công nghệ" },
    { id: "c2", label: "Marketing & Sales" },
    { id: "c3", label: "Tài chính" },
    { id: "c4", label: "Sáng tạo" },
  ];

  const styles = [
    { id: "r1", label: "Hiện đại" },
    { id: "r2", label: "Tối giản" },
    { id: "r3", label: "Chuyên nghiệp" },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="sticky top-28 space-y-6">
        <h3 className="text-lg font-semibold tracking-tight">Bộ lọc</h3>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input className="pl-10" placeholder="Tìm kiếm mẫu..." type="text" />
        </div>

        <div>
          <h4 className="font-medium mb-3 text-foreground">Ngành nghề</h4>
          <div className="space-y-2">
            {industries.map((industry) => (
              <div key={industry.id} className="flex items-center space-x-2">
                <Checkbox id={industry.id} />
                <Label htmlFor={industry.id} className="text-sm font-medium">
                  {industry.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-foreground">Phong cách</h4>
          <RadioGroup defaultValue="">
            <div className="space-y-2">
              {styles.map((style) => (
                <div key={style.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={style.id} id={style.id} />
                  <Label htmlFor={style.id} className="text-sm font-medium">
                    {style.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </aside>
  );
}
