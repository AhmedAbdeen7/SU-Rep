import { StatusBadge } from "@/components/status-badge";
import { CategoryBadge } from "@/components/category-badge";
import type { Case } from "@/types/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, User, ChevronRight } from "lucide-react";

interface CaseRowProps {
    case: Case;
}

export function CaseRow({ case: caseData }: CaseRowProps) {
    return (
        <Link href={`/case/${caseData.caseId}`}>
            <div className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-all cursor-pointer">
                {/* Case ID & Category */}
                <div className="flex-shrink-0 w-48">
                    <span className="font-mono text-sm font-medium block">{caseData.caseId}</span>
                    <CategoryBadge category={caseData.category} className="mt-1" />
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-1">{caseData.description}</p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                    <StatusBadge status={caseData.status} />
                </div>

                {/* Date & Assignee */}
                <div className="flex-shrink-0 w-48 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(caseData.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    {caseData.assignee && (
                        <div className="flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{caseData.assignee}</span>
                        </div>
                    )}
                </div>

                {/* Arrow */}
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
        </Link>
    );
}