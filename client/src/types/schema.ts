import { z } from "zod";

export const CASE_STATUSES = [
    "Submitted",
    "In Review",
    "Under Investigation",
    "Awaiting Response",
    "Resolved",
    "Closed",
    "Escalated"
] as const;

export const CASE_CATEGORIES = [
    "Academic",
    "Welfare",
    "Accommodation",
    "Discrimination",
    "Bullying & Harassment",
    "Financial",
    "Campus Facilities",
    "Other"
] as const;

export type CaseStatus = typeof CASE_STATUSES[number];
export type CaseCategory = typeof CASE_CATEGORIES[number];

export interface Case {
    id: string;
    caseId: string;
    studentName: string | null;
    studentEmail: string | null;
    studentPhone: string | null;
    category: CaseCategory;
    status: CaseStatus;
    description: string;
    assignee: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface CaseUpdate {
    id: string;
    caseId: string;
    timestamp: Date | string;
    actor: string;
    action: string;
    note: string | null;
    newStatus: CaseStatus | null;
}

export const insertCaseSchema = z.object({
    studentName: z.string().optional(),
    studentEmail: z.string().email().optional(),
    studentPhone: z.string().optional(),
    category: z.enum(CASE_CATEGORIES),
    status: z.enum(CASE_STATUSES).optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    assignee: z.string().optional(),
});

export type InsertCase = z.infer<typeof insertCaseSchema>;

