import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CaseStats } from "@/components/case-stats";
import { FilterPanel } from "@/components/filter-panel";
import { CaseCard } from "@/components/case-card";
import type { Case, CaseStatus, CaseCategory } from "@/types/schema";
import { Loader2 } from "lucide-react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseRow } from "@/components/case-row";

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: cases, isLoading } = useQuery<Case[]>({
    queryKey: ["/api/v1/cases"],
  });

  const filteredCases = cases?.filter((caseItem) => {
    const statusMatch = selectedStatus === "all" || caseItem.status === selectedStatus;
    const categoryMatch = selectedCategory === "all" || caseItem.category === selectedCategory;
    return statusMatch && categoryMatch;
  }) || [];

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Case Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage all representation committee cases
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <CaseStats cases={cases || []} />

              <div className="space-y-4">
                <FilterPanel
                  selectedStatus={selectedStatus}
                  selectedCategory={selectedCategory}
                  onStatusChange={setSelectedStatus}
                  onCategoryChange={setSelectedCategory}
                  onClearFilters={handleClearFilters}
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                  </div>
                </div>
                {filteredCases.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No cases found matching your filters.</p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCases.map((caseItem) => (
                      <CaseCard key={caseItem.id} case={caseItem} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCases.map((caseItem) => (
                      <CaseRow key={caseItem.id} case={caseItem} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
