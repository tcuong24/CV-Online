interface TemplateCardProps {
  image: string;
  title: string;
  description: string;
}

export function TemplateCard({ image, title, description }: TemplateCardProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="w-full overflow-hidden rounded-lg border">
        <div
          className="aspect-3/4 w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${image}")` }}
        />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
