import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { CategoryBadge } from "@/components/category-badge";
import type { Case } from "@/types/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { User, Calendar } from "lucide-react";

interface CaseCardProps {
  case: Case;
}

export function CaseCard({ case: caseData }: CaseCardProps) {
  return (
    <Link href={`/case/${caseData.caseId}`}>
      <Card
        className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-200"
        data-testid={`card-case-${caseData.caseId}`}
      >
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-mono text-sm font-medium text-muted-foreground"
                data-testid={`text-case-id-${caseData.caseId}`}
              >
                {caseData.caseId}
              </span>
              <CategoryBadge category={caseData.category} />
            </div>
            <StatusBadge status={caseData.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground line-clamp-2">
            {caseData.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(caseData.createdAt), "MMM d, yyyy")}</span>
            </div>
            {caseData.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{caseData.assignee}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
