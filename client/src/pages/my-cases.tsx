import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterPanel } from "@/components/filter-panel";
import { CaseCard } from "@/components/case-card";
import { CaseRow } from "@/components/case-row";
import { CaseMessages } from "@/components/case-messages";
import type { Case, CaseStatus, CaseCategory } from "@/types/schema";
import { Loader2, LayoutGrid, List, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyCases() {
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  
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

  useEffect(() => {
    if (!selectedCaseId && cases && cases.length > 0) {
      setSelectedCaseId(cases[0].caseId);
    }
  }, [cases, selectedCaseId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Cases</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your submitted representation committee cases
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : cases && cases.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cases yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You haven't submitted any cases yet. When you do, they'll appear here.
                </p>
                <Button asChild>
                  <a href="/submit">Submit Your First Case</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="cases" className="space-y-6">
              <TabsList>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="cases" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-primary">
                        {cases?.length || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Cases</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-yellow-600">
                        {cases?.filter(c => c.status === "In Review").length || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">In Review</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {cases?.filter(c => c.status === "Resolved").length || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </CardContent>
                  </Card>
                </div>

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
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Select Case</p>
                      <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a case" />
                        </SelectTrigger>
                        <SelectContent>
                          {(cases || []).map((caseItem) => (
                            <SelectItem key={caseItem.caseId} value={caseItem.caseId}>
                              {caseItem.caseId} • {caseItem.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCaseId ? (
                      <CaseMessages caseId={selectedCaseId} title="Case Communication" />
                    ) : (
                      <p className="text-sm text-muted-foreground">Select a case to open messages.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
