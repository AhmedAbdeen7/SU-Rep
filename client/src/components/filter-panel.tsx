import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CASE_STATUSES, CASE_CATEGORIES, type CaseStatus, type CaseCategory } from "@/types/schema";
import { X } from "lucide-react";

interface FilterPanelProps {
  selectedStatus: CaseStatus | "all";
  selectedCategory: CaseCategory | "all";
  onStatusChange: (status: CaseStatus | "all") => void;
  onCategoryChange: (category: CaseCategory | "all") => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  selectedStatus,
  selectedCategory,
  onStatusChange,
  onCategoryChange,
  onClearFilters,
}: FilterPanelProps) {
  const hasFilters = selectedStatus !== "all" || selectedCategory !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedStatus} onValueChange={(value) => onStatusChange(value as CaseStatus | "all")}>
            <SelectTrigger data-testid="select-status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {CASE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedCategory} onValueChange={(value) => onCategoryChange(value as CaseCategory | "all")}>
            <SelectTrigger data-testid="select-category-filter">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CASE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
