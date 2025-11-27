# Design Guidelines: Student Union Case Management System

## Design Approach

**Selected Approach:** Design System with Modern SaaS Aesthetics

Drawing inspiration from Linear, Notion, and modern administrative dashboards, this design prioritizes clarity, efficiency, and approachable professionalism suitable for a student union context. The interface balances institutional credibility with student-friendly accessibility.

**Core Principles:**
- Information clarity over decoration
- Efficient workflows with minimal clicks
- Approachable but professional aesthetic
- Consistent patterns for predictable interactions

---

## Color Palette

### Light Mode
- **Primary Brand:** 220 85% 55% (vibrant blue - trustworthy, institutional)
- **Primary Hover:** 220 85% 48%
- **Background Primary:** 0 0% 100% (pure white)
- **Background Secondary:** 220 15% 97% (subtle blue-gray)
- **Surface:** 220 10% 98% (card backgrounds)
- **Border:** 220 15% 88%
- **Text Primary:** 220 15% 15%
- **Text Secondary:** 220 10% 45%
- **Success:** 142 70% 45% (case resolved)
- **Warning:** 38 92% 50% (pending cases)
- **Error:** 0 75% 55% (urgent cases)

### Dark Mode
- **Primary Brand:** 220 85% 60%
- **Primary Hover:** 220 85% 65%
- **Background Primary:** 220 15% 10%
- **Background Secondary:** 220 15% 13%
- **Surface:** 220 12% 15%
- **Border:** 220 15% 22%
- **Text Primary:** 220 10% 95%
- **Text Secondary:** 220 10% 65%

---

## Typography

**Font Families:**
- **Primary:** Inter (Google Fonts) - all UI text, data, forms
- **Headings:** Inter Semi-Bold to Bold
- **Monospace:** JetBrains Mono - case IDs, timestamps

**Scale:**
- Page Titles: text-3xl font-bold
- Section Headers: text-xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base
- Secondary Text: text-sm text-secondary
- Captions/Meta: text-xs

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4
- Form field spacing: space-y-4

**Container Widths:**
- Full dashboard: max-w-7xl mx-auto
- Forms: max-w-2xl
- Modals: max-w-3xl

**Grid Layouts:**
- Case cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stats dashboard: grid-cols-2 md:grid-cols-4
- Filter panels: Single column forms, multi-column on desktop

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Fixed header with backdrop blur
- Logo left, user profile/logout right
- Navigation items: "Dashboard", "Submit Case", "My Cases" (for students), "Admin Panel" (for REP Admins)
- Height: h-16
- Background: backdrop-blur-lg with subtle border-b

### Dashboard Components

**Case Cards:**
- White/surface background with subtle shadow
- Rounded corners: rounded-lg
- Padding: p-6
- Include: Case ID badge, category tag, status badge, timestamp, excerpt
- Status badges: Pill-shaped with colored backgrounds (success/warning/primary)
- Hover state: Slight shadow elevation

**Filter Panel:**
- Sticky sidebar or collapsible top panel
- Dropdown selects for Category and Status
- Clear filters button
- Applied filters shown as removable tags

**Data Table View (Alternative):**
- Striped rows for readability
- Sortable columns with arrow indicators
- Compact row height for information density
- Action buttons in rightmost column

**Statistics Cards:**
- 4-column grid on desktop
- Large number display with label
- Icon or small chart visualization
- Colored accent border-t-4

### Case Management Interface

**Case Detail View:**
- Two-column layout (desktop): Main content left, metadata sidebar right
- Update timeline showing all case_updates chronologically
- Inline editing for status and assignee
- Comment/note textarea with submit button
- All updates logged with timestamp and actor name

**Status Dropdown:**
- Custom styled select with status-colored indicators
- Options from CASE_STATUSES
- Instant visual feedback on change

**Assignment Interface:**
- Searchable admin dropdown or combobox
- Display assignee avatar/initials + name
- Unassign button if needed

### Forms

**Case Submission Form:**
- Clean vertical layout with clear field labels
- Category dropdown (required)
- Description textarea with character count
- File upload for supporting documents
- Anonymous option toggle for students
- Contact information fields (email, phone - optional for anonymity)
- Submit button: Large, primary colored, full-width on mobile
- Success confirmation message with case ID

**Input Styling:**
- Consistent border and focus states
- Error states with red border + helper text below
- Placeholder text in text-secondary
- Height: h-10 for inputs, min-h-32 for textareas

### Badges & Tags
- **Status Badges:** Rounded-full px-3 py-1 text-xs font-medium
- **Category Tags:** Rounded px-2 py-0.5 text-xs with subtle background
- **Case ID Badge:** Monospace font, subtle gray background

### Modals & Overlays
- Centered modal with backdrop overlay
- Max width: max-w-lg to max-w-2xl depending on content
- Close button top-right
- Actions footer with Cancel (outline) and Confirm (solid) buttons

---

## Page Layouts

### Dashboard (REP Admin View)
- Stats overview cards at top (4 metrics: Total Cases, In Review, Resolved, Urgent)
- Filter panel below stats
- Case cards grid or table view toggle
- Pagination at bottom

### Case Detail Page
- Breadcrumb navigation at top
- Case header with ID, category, status prominently displayed
- Main description area
- Update timeline in chronological order
- Admin action panel (if logged in as admin): Status change, assign, add note

### Student Submission Page
- Simple, welcoming hero section with brief explanation
- Centered form with clear field labels
- Reassuring privacy note
- Confirmation page after submission with case ID and next steps

### Public Landing (Optional)
- Brief introduction to representation committee
- CTA to "Submit a Case" 
- Login for REP Admins

---

## Images

**Hero Section (Student Submission Page):**
- Abstract illustration of students collaborating or support imagery
- Dimensions: Full-width, ~400-500px height on desktop
- Style: Friendly, inclusive, modern illustration or photo
- Placement: Top of submission page, text overlay with semi-transparent background

**No other images required** - this is a data-focused application prioritizing clarity and efficiency.

---

## Interactions & States

**Minimal Animations:**
- Smooth transitions on hover: transition-colors duration-200
- Subtle scale on card hover: hover:scale-[1.02]
- Loading spinners for async actions
- Toast notifications for success/error feedback (top-right corner)

**No elaborate animations** - focus on instant, predictable interactions.

---

## Accessibility & Responsiveness

- Mobile-first approach: Stack columns, full-width cards
- Touch-friendly targets: min-h-10 for all interactive elements
- Focus indicators on all interactive elements
- Sufficient color contrast (WCAG AA minimum)
- Skip to content link for keyboard navigation
- Form validation with clear error messages