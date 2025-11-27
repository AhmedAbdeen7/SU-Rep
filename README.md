# Student Union Case Management System

## Overview
A comprehensive case management system for the Student Union Representation Committee. This application allows students to submit cases for support and enables REP Admins to monitor, manage, and resolve cases efficiently.

## Current State
**Status:** MVP Complete ✅
- Fully functional frontend with polished UI/UX
- CSV-based backend storage (cases.csv and case_updates.csv)
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
   - All changes logged to case_updates.csv

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

### Backend
- **Server:** Express.js
- **Storage:** CSV files (cases.csv, case_updates.csv)
- **Validation:** Zod schemas with drizzle-zod
- **API:** RESTful endpoints

### Data Models
```typescript
Case {
  id, caseId, studentName, studentEmail, studentPhone,
  category, status, description, assignee, isAnonymous,
  createdAt, updatedAt
}

CaseUpdate {
  id, caseId, timestamp, actor, action, note, newStatus
}
```

## API Endpoints
- `GET /api/cases` - Fetch all cases
- `GET /api/cases/:caseId` - Fetch specific case
- `GET /api/cases/:caseId/updates` - Fetch case updates
- `POST /api/cases` - Create new case
- `PATCH /api/cases/:caseId` - Update case

## File Structure
```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/            # Utilities
│   │   └── App.tsx         # Main app with routing
├── server/
│   ├── storage.ts          # CSV storage implementation
│   ├── routes.ts           # API endpoints
│   └── index.ts            # Server entry
├── shared/
│   └── schema.ts           # Shared data models
└── cases.csv               # Case data storage
└── case_updates.csv        # Case update logs
```

## Case Statuses
- Submitted
- In Review
- Under Investigation
- Awaiting Response
- Resolved
- Closed
- Escalated

## Case Categories
- Academic
- Welfare
- Accommodation
- Discrimination
- Bullying & Harassment
- Financial
- Campus Facilities
- Other

## Running the Application
```bash
npm run dev  # Development server on port 5000
```

## Recent Changes
- October 7, 2025: Initial MVP implementation
  - Complete frontend with all pages and components
  - Backend API with CSV storage
  - End-to-end testing completed successfully
  - All features working as expected

## Next Phase (Backend Enhancements)
See "Next Steps for Backend" section below.
