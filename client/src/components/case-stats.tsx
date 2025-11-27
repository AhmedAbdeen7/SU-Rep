import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Case } from "@/types/schema";
import { useState } from "react";

interface CaseStatsProps {
  cases: Case[];
}

export function CaseStats({ cases }: CaseStatsProps) {
  // All available stats
  const allStats = [
    { id: "total", label: "Total Cases", getValue: () => cases.length, icon: FileText, color: "text-primary" },
    { id: "submitted", label: "Submitted", getValue: () => cases.filter(c => c.status === "Submitted").length, icon: Clock, color: "text-blue-600 dark:text-blue-400" },
    { id: "inReview", label: "In Review", getValue: () => cases.filter(c => c.status === "In Review").length, icon: Clock, color: "text-amber-600 dark:text-amber-400" },
    { id: "investigation", label: "Under Investigation", getValue: () => cases.filter(c => c.status === "Under Investigation").length, icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400" },
    { id: "awaiting", label: "Awaiting Response", getValue: () => cases.filter(c => c.status === "Awaiting Response").length, icon: Clock, color: "text-purple-600 dark:text-purple-400" },
    { id: "resolved", label: "Resolved", getValue: () => cases.filter(c => c.status === "Resolved").length, icon: CheckCircle, color: "text-green-600 dark:text-green-400" },
    { id: "closed", label: "Closed", getValue: () => cases.filter(c => c.status === "Closed").length, icon: CheckCircle, color: "text-gray-600 dark:text-gray-400" },
    { id: "urgent", label: "Urgent", getValue: () => cases.filter(c => c.status === "Escalated").length, icon: AlertTriangle, color: "text-red-600 dark:text-red-400" },
  ];

  // Default visible stats
  const [visibleStats, setVisibleStats] = useState<string[]>([
    "total", "inReview", "resolved", "urgent"
  ]);

  const toggleStat = (statId: string) => {
    setVisibleStats(prev =>
      prev.includes(statId)
        ? prev.filter(id => id !== statId)
        : [...prev, statId]
    );
  };

  const displayedStats = allStats.filter(stat => visibleStats.includes(stat.id));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Customize Stats
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Select Statistics to Display</h4>
              <div className="space-y-2">
                {allStats.map((stat) => (
                  <div key={stat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={stat.id}
                      checked={visibleStats.includes(stat.id)}
                      onCheckedChange={() => toggleStat(stat.id)}
                    />
                    <label
                      htmlFor={stat.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {stat.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayedStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">
                      {stat.getValue()}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}