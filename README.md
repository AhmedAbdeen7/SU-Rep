# Student Union Case Management System

## Overview
A comprehensive case management system for the Student Union Representation Committee. This application allows students to submit cases for support and enables REP Admins to monitor, manage, and resolve cases efficiently.

## Current State
**Status:** MVP Complete
- Fully functional frontend with polished UI/UX
- All core features implemented and tested

## Features Implemented
1. **Case Monitoring Dashboard**
   - Display all cases with filtering by category and status
   - Statistics cards showing total cases, in review, resolved, and urgent
   - Responsive grid layout with case cards
   
2. **Case Management (REP Admin)**
   - View detailed case information
   - Update case status via dropdown
   - Assign cases to admin staff
   - Add notes and comments
   - Complete update history timeline

3. **Case Submission**
   - Student submission form with anonymous option
   - Admin submission form (on behalf of students)
   - Automatic case ID generation (REP-{timestamp}-{random})
   - Default "In Review" status for new cases

## Project Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** TanStack Query (React Query v5)
- **Forms:** React Hook Form with Zod validation
- **Theme:** Light/Dark mode support
