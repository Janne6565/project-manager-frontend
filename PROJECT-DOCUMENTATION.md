# Project Manager UI - Project Documentation

## Overview
A React-based project management application with authentication, drag-and-drop sortable tables, and full CRUD operations for managing projects and their contributions.

**Stack:** React + Vite + TypeScript + TanStack Router + Redux Toolkit + shadcn/ui

---

## 🏗️ Architecture

### Frontend Stack
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** TanStack Router (file-based routing)
- **State Management:** Redux Toolkit
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS v4 (CSS variables)
- **Drag & Drop:** @dnd-kit
- **Tables:** @tanstack/react-table
- **Package Manager:** Bun

### Backend API
- **Base URL:** `http://localhost:8080/api`
- **Authentication:** JWT via HttpOnly cookies
- **Cookie Name:** `JWT-TOKEN`
- **Cookie Settings:** HttpOnly, SameSite=Lax, Secure=false (dev)
- **Token Expiration:** 24 hours

---

## 🔐 Authentication System

### Implementation
- **Provider:** `AuthProvider` wraps entire app
- **Context:** Manages user state, login, logout, session check
- **Hook:** `useAuth()` for consuming auth state
- **Protected Routes:** `ProtectedRoute` component with auto-redirect
- **Session Restoration:** Checks `/api/v1/auth/status` on mount

### Auth Flow
1. User visits protected route → redirected to `/login`
2. Login with username/password → backend sets HttpOnly cookie
3. All requests include `credentials: 'include'` to send cookie
4. Logout → POST to `/api/v1/auth/logout` clears cookie

### Credentials
- Username: `janne`
- Password: `adminpassword`
- Role: `ADMIN`

### API Endpoints
- `POST /api/v1/auth/login` - Login (sets cookie)
  - Body: `{ username, password }`
  - Response: `{ message, username, expiresIn }`
- `POST /api/v1/auth/logout` - Logout (clears cookie)
- `GET /api/v1/auth/status` - Check auth status
  - Response: `{ authenticated: boolean, username: string | null }`

---

## 🗂️ Data Models

### Project
```typescript
interface Project {
  uuid: string;
  name: string;
  description: string;
  index: number; // for sorting/reordering
  additionalInformation?: {
    [key: string]: string; // Dynamic key-value pairs
  };
  repositories?: string[]; // GitHub URLs
  contributions?: Contribution[];
}
```

### Contribution
```typescript
interface Contribution {
  day: string; // ISO date
  type: 'PULL_REQUEST' | 'COMMIT' | 'ISSUE';
  repositoryUrl: string;
  reference: string; // GitHub URL
}
```

---

## 📡 API Endpoints

### Projects
- `GET /api/v1/projects` - List all (public, no auth)
- `GET /api/v1/projects/{uuid}` - Get specific project (public)
- `POST /api/v1/projects` - Create project (requires ADMIN)
  - Body: `{ name, description, additionalInformation?, repositories?, index }`
- `PATCH /api/v1/projects/{uuid}` - Update project (requires ADMIN)
  - Body: `{ name?, description?, repositories?, additionalInformation? }`
- `PATCH /api/v1/projects/{uuid}/index` - Update sort order (requires ADMIN)
  - Body: `{ index: number }`
- `DELETE /api/v1/projects/{uuid}` - Delete project (requires ADMIN)

### Contributions
- `GET /api/v1/contributions/unassigned` - List unassigned contributions

---

## 🎨 Features Implemented

### ✅ Authentication
- Login screen with form validation
- Session persistence via cookies
- Auto-restore session on page load
- Logout functionality
- Protected routes with redirect

### ✅ Projects Management
- **List View:** Sortable table with pagination
- **Drag & Drop:** Reorder projects with auto-save
- **Create:** Dialog with all fields (name, desc, repos, attributes)
- **Edit:** Drawer with view/edit modes
- **Delete:** Confirmation dialog
- **Detail Page:** Full project view with contributions table

### ✅ Data Tables
- **Generic DataTable Component:** Reusable for any data
- **Drag Handle:** Intuitive grip icon for reordering
- **Pagination:** Configurable page size (5, 10, 25, 50, 100)
- **Page Size Persistence:** Saved to localStorage
- **Row Click:** Navigation to detail pages
- **Actions Dropdown:** Edit, Delete, View Details

### ✅ Additional Information (Custom Attributes)
- Dynamic key-value pairs per project
- Add/remove attributes in create/edit
- Display as badges on detail page
- No focus loss during editing (stable IDs)

### ✅ Contributions Table
- Date formatting (MMM DD, YYYY)
- Type badges (PR, Commit, Issue)
- Repository name extraction
- Clickable GitHub links (opens in new tab)
- Pagination with page size selector
- Empty state handling

---

## 📂 File Structure

```
src/
├── components/
│   ├── display/
│   │   ├── AppNavBar/           # Navigation with logout
│   │   ├── DataTable/           # Generic sortable table
│   │   ├── ProjectsTable/       # Projects table wrapper
│   │   ├── ContributionsTable/  # Contributions display
│   │   ├── ProjectDetailPage/   # Project detail view
│   │   ├── ProjectDetailDrawer/ # Edit/view drawer
│   │   ├── CreateProjectDialog/ # Create project form
│   │   └── LoginForm/           # Login form
│   ├── technical/
│   │   ├── auth-provider.tsx    # Auth context provider
│   │   ├── protected-route.tsx  # Route guard
│   │   └── data-fetcher.tsx     # Fetches data when authenticated
│   └── ui/                      # shadcn/ui components
├── hooks/
│   └── use-auth.ts              # Auth hook
├── routes/
│   ├── __root.tsx               # Root layout with DataFetcher
│   ├── index.tsx                # Projects list page
│   ├── login.tsx                # Login page
│   └── project/
│       └── $projectUuid.tsx     # Project detail route
├── store/
│   ├── store.ts                 # Redux store config
│   ├── hooks.ts                 # Typed Redux hooks
│   └── slices/
│       ├── projectsSlice.ts     # Projects state + thunks
│       └── contributionsSlice.ts # Contributions state
├── types/
│   ├── auth.ts                  # Auth types
│   ├── project.ts               # Project type
│   └── contribution.ts          # Contribution type
├── lib/
│   └── api.ts                   # API utility functions
└── App.tsx                      # Root component with providers
```

---

## 🔧 Key Components

### AuthProvider
- Manages user authentication state
- Provides login, logout, checkAuthStatus functions
- Restores session on mount
- **Note:** Login sets `isLoading=false` during attempt to prevent remount

### DataTable
- Generic `<TData extends { uuid: string }>` type
- Integrates @dnd-kit for drag-drop
- Uses @tanstack/react-table for state
- **Critical:** `useSortable` called once in `DraggableRow`, listeners passed to `DragHandle`
- Pagination with localStorage persistence
- Row click with smart detection (avoids clicking drag handle/buttons)

### ProjectDetailDrawer
- Two modes: view (`initialEditMode=false`) and edit (`initialEditMode=true`)
- State management with stable IDs for additional attributes
- **Critical:** Uses `useRef(open)` to detect drawer opening, prevents double state reset
- Resets form state on open to avoid stale data

### Redux Slices
- **projectsSlice:** Auto-sorts by index, optimistic updates for reordering
- **contributionsSlice:** Fetches unassigned contributions
- Both use RTK Query with thunks for async operations

---

## 🎨 Styling Configuration

### Tailwind v4
- Uses CSS variables (not tailwind.config.js)
- Configuration in `src/index.css`
- Border radius: `--radius: 0.375rem` (equivalent to rounded-md)

### Theme Variables
```css
--radius: 0.375rem;         /* Default border radius */
--background: ...;          /* Background color */
--foreground: ...;          /* Text color */
--primary: ...;             /* Primary brand color */
--destructive: ...;         /* Error/delete color */
--muted: ...;               /* Muted elements */
```

---

## 🔑 Key Technical Decisions

### Authentication
- **HttpOnly cookies** over localStorage for XSS protection
- **No Authorization header** - cookies are automatic
- `credentials: 'include'` required on all fetch requests

### State Management
- **Redux for global state** (projects, contributions)
- **Local state for UI** (modals, forms, pagination)
- **No React Query** - Redux handles caching

### Drag & Drop
- **useSortable hook** must be called exactly once per item
- **Stable IDs** for React keys (prevents focus loss)
- **Optimistic updates** for immediate feedback

### Pagination
- **DataTable:** TanStack Table's built-in pagination
- **ContributionsTable:** Custom state-based pagination
- **localStorage keys:**
  - `dataTable.pageSize` - Projects table
  - `contributionsTable.pageSize` - Contributions table

### Additional Information
- Stored as `Record<string, string>` in backend
- Managed as `Array<{ id, key, value }>` in frontend
- **Why?** Stable IDs prevent React re-renders and focus loss

---

## 🐛 Known Issues & Considerations

### Fixed Issues
- ✅ Login form refresh on error → Added `e.stopPropagation()` and `noValidate`
- ✅ Error message disappearing → Used local state instead of auth context
- ✅ Drag-drop not working → Fixed useSortable double-call
- ✅ Stale state in drawer → Added useRef to detect opening
- ✅ Focus loss in attribute inputs → Used stable IDs
- ✅ Edit mode not working → Fixed race condition with useRef

### Assumptions
- Backend running on http://localhost:8080
- CORS configured for credentials
- Empty repositories/attributes filtered before save
- Projects auto-sorted by index on fetch

---

## 🚀 Future Enhancements (Out of Scope)

- Bulk actions (delete multiple projects)
- Search/filter functionality
- Column sorting (by name, date, etc.)
- Column visibility toggle
- Export to CSV
- Toast notifications for success/error
- Keyboard shortcuts
- Dark/light theme toggle
- Mobile responsiveness improvements
- WebSocket for real-time updates

---

## 📝 Development Notes

### Running the App
```bash
bun install          # Install dependencies
bun run dev          # Start dev server (usually http://localhost:5173)
bun run build        # Build for production
```

### Important Files
- `src/index.css` - Tailwind config, CSS variables, theme
- `src/App.tsx` - Provider hierarchy (Redux → Auth → Router)
- `src/routes/__root.tsx` - DataFetcher component
- `src/lib/api.ts` - All API functions with credentials: 'include'

### Testing
- Backend must be running on http://localhost:8080
- Login with janne/adminpassword
- Need at least 3-4 projects for meaningful reordering tests
- Test with different page sizes for pagination

---

## 🔍 Debugging Tips

### Auth Issues
- Check Network tab for cookie in response headers
- Verify `credentials: 'include'` on all requests
- Check `/api/v1/auth/status` returns authenticated: true

### Drag & Drop Issues
- Verify useSortable called only once per row
- Check dataIds array matches current data
- Look for console errors from @dnd-kit

### State Issues
- Check Redux DevTools for state changes
- Verify thunks are dispatched correctly
- Look for stale closures in useEffect

### Pagination Issues
- Check localStorage for pageSize values
- Verify totalPages calculation
- Test with different data lengths

---

## 📚 Dependencies

### Core
- react: ^18.x
- react-dom: ^18.x
- typescript: ^5.x

### State & Routing
- @reduxjs/toolkit: Redux with RTK Query
- react-redux: React bindings for Redux
- @tanstack/react-router: File-based routing

### UI & Styling
- @radix-ui/*: Primitive components
- tailwindcss: Utility-first CSS
- lucide-react: Icon library

### Drag & Drop
- @dnd-kit/core: Core functionality
- @dnd-kit/sortable: Sortable lists
- @dnd-kit/modifiers: Restrict to vertical
- @dnd-kit/utilities: Helper functions

### Tables
- @tanstack/react-table: Headless table library

---

## 🎯 Current State

**Status:** Feature complete with pagination and localStorage persistence

**Last Updated:** 2026-02-02

**Active Features:**
- Authentication system ✅
- Projects CRUD with drag-drop ✅
- Contributions display ✅
- Pagination with page size selector ✅
- localStorage persistence ✅
- Additional information (custom attributes) ✅
- Project detail page ✅

**No Known Bugs** 🎉
