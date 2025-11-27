import { Badge } from "@/components/ui/badge";
import type { CaseStatus } from "@/types/schema";

const statusStyles: Record<CaseStatus, string> = {
  "Submitted": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "In Review": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Under Investigation": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Awaiting Response": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Resolved": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Closed": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  "Escalated": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
};

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={`${statusStyles[status]} ${className || ''}`}
      data-testid={`badge-status-${status.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {status}
    </Badge>
  );
}
