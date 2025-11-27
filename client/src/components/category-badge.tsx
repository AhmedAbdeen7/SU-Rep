import { Badge } from "@/components/ui/badge";
import type { CaseCategory } from "@/types/schema";

interface CategoryBadgeProps {
  category: CaseCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={className}
      data-testid={`badge-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {category}
    </Badge>
  );
}
