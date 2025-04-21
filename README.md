# Schedrix AI Task Manager - Full Project Recap (Technical Summary)

This document is a complete technical logbook of everything learned, discussed, and implemented during the Schedrix project journey. It captures the core logic, decisions, tech stack, and workflow rationale for future reference (excluding CSS/styling).

---

## 1. **Project Overview**
Schedrix is an AI-based task management platform with a unique blend of motivational psychology, productivity enhancement, and behavior tracking. It combines scheduling, gamification, and emotional intelligence.

---

## 2. **Tech Stack**
- **Frontend**: Next.js (App Router), TailwindCSS, ShadCN/UI, TypeScript
- **Backend**: Express.js with Passport.js for authentication
- **Database**: MongoDB
- **Authentication**: Google OAuth with Passport.js and sessions
- **State Management**: Zustand (used for user store)
- **Toast Notifications**: ShadCN's `useToast`
- **Validation**: Zod
- **Cron Jobs**: Node Cron (e.g. for 3 AM point deductions)

---

## 3. **Authentication Flow**
- Google OAuth with `passport-google-oauth20`
- Sessions & Cookies handled on the backend
- Frontend uses `withCredentials: true` to persist user sessions
- After login, user is redirected to `/home` and user data is fetched from `/auth/user` based on session cookies.

> **Reminder**: In production, `cookie.secure` must be set to `true`.

---

## 4. **Entities & Schema Design**

### **User**
- `_id`, `name`, `username`, `userImage`, `phoneNo`
- `mindStatus` (current mood/mental state)
- `age`, `points`, `joinedAt`, `bio`
- `progress`, `badgeList`

### **Task**
- `title`, `description`, `priority`, `status`
- `duration`, `startTime`, `endTime`, `deadline`
- `isLocked`, `isFixed`, `output`
- `category`, `createdBy`, `createdAt`

### **DailyPointsLog (GitHub Contribution Style)**
- Document per `{userId, year}`
- Has array of `{ day, month, pointsGain, pointsLoss }`
- Used for grid visualization

---

## 5. **Task Features**
- Tasks can be:
  - **Fixed** (non-negotiable, like meetings)
  - **Locked** (user can't edit them post creation)
  - **Categorized** by custom labels
  - **Prioritized** (High/Medium/Low etc)

- Each task includes:
  - Duration
  - Deadline
  - Status (Pending, Completed, Missed)
  - Output result and feedback (to be analyzed by AI)

---

## 6. **Motivational & AI Features**
- AI-based motivational content if tasks are missed
- Points awarded/deducted based on:
  - Duration
  - Priority
  - Completion/missing
- Mood-aware scheduling (coming later)
- Mind status updated regularly and stored with history
- AI suggestions for content based on behavior
- Progress tracked and visualized
- Points Gamification
- Badges awarded for performance milestones

---

## 7. **Important Functional Workflows**

### **1. Daily Cron Job (3 AM)**
- Runs daily to:
  - Deduct points for overdue tasks
  - Uses deadline < now and status === 'pending'
  - Deduction logic: based on priority & duration

### **2. Task Analytics View**
- Grid view similar to GitHub contributions
- Uses green/red color scale for gain/loss
- Switchable gain/loss mode using `ifGain` prop
- Displays tooltips with full date and point info

### **3. Toast Notifications**
- ShadCN Toast System used
  - Setup: `npx shadcn@latest add toast`
  - Usage: `toast({ title, description, variant })`
  - Layout: `<Toaster />` included globally

### **4. Caching Suggestion**
- Use Redis/Mongo cache for `passport.deserializeUser` to avoid DB hits

---

## 8. **Important UI Decisions (Non-styling)**
- Task details on main page shown **vertically (one below another)**
- Task display area split into:
  - **Left (2/5)**: Calendar view
  - **Right (3/5)**:
    - Filter bar (top)
    - Result grid (bottom)

---

## 9. **Zustand Store**
- Stores user object after login
- Example fields: `user`, `setUser`
- Fetched once from backend, then re-used from store across app
- Update store when backend fetch returns latest user data (recommended)

---

## 10. **Global Theming Choices (Non-CSS)**
- Black/dark background across app
- Green aura theme:
  - Primary color: `#00c853`
  - Secondary: `#b2ff59`

> These values were used conceptually in logic like `getColor()` functions.

---

## 11. **HotList (Important Keywords)**
- HotModuleReplacement (HMR) in React
- Parallel fetching in Next.js
- Red Gradient Button Style (Logout etc)

---

## 12. **Learnings & Key Takeaways**
- Session-based auth using Google + Express + Next.js
- Managing auth state with cookies and Zustand
- GitHub-style calendar grid logic using `date-fns`
- Importance of designing schemas before coding
- Cron jobs for automated task processing
- Using Zod for full schema validation
- Avoiding redundant API calls after auth by syncing session directly
- Handling `router.isReady` when dealing with `useRouter()`
- Benefits of dark mode and theme consistency
- Reusable UI components (e.g. filters, grid, toast)

---

## 13. **Next Steps (Planned But Not Done Yet)**
- Mind-aware scheduling
- AI analysis of task output
- Group/family collaboration features
- Audio-based task confirmations
- Screen/app integration for validation
- Motivation via badges + content

## 📦 1. Caching – Concepts & Usage

### 🔥 Where caching is useful in this app:

- **passport.deserializeUser**  
  ✔️ To avoid hitting the database for every authenticated request.  
  ✔️ Cache user info after login, using a memory store (e.g., Redis, LRU cache).  
  ✔️ Avoid caching sensitive or dynamic data.

- **Points Analytics / Progress Charts**  
  ✔️ Cache frequently viewed or computed data like point summaries, progress, etc.  
  ✔️ Reduce repeated DB hits for the same daily/yearly analysis.

- **Task Lists & Static User Data**  
  ✔️ Cache user tasks briefly on the client side when tasks aren't updated frequently.  
  ✔️ Good for session-level memory caching or SWR/React Query usage.

### 🧠 Key Takeaways
- Cache static and infrequently changing data.
- Use in-memory or Redis on the backend for frequently accessed endpoints.
- Never cache sensitive or rapidly changing user/session state.

---

## 👥 2. Storing User Data Globally (Client-Side)

### 🔧 Our Approach:
- **Zustand Store (`useUserStore`)**
  ✔️ Central store for user info after Google login (id, name, image, etc).  
  ✔️ Makes user data available across components.

- **Populated after Google OAuth login**:
  ✔️ Session-based flow via `passport.js`.  
  ✔️ On successful login, `/auth/user` API gives current user.  
  ✔️ We call this and update Zustand via `setUser()`.

- **Session persistence**:
  ✔️ Enabled via `credentials: 'include'` and cookie-based session.

### 🧠 Key Takeaways
- Zustand is a lightweight and scalable global store.
- Fetch user data once after login and sync it to Zustand.
- Avoid duplicating user fetch in every component.
- Don't store sensitive session tokens in Zustand or localStorage.

---

## 🌐 3. Different Request Approaches: Fetch vs Axios

### ✅ When to use `fetch`:
- Native to browsers, no install needed.
- Simple and ideal for basic GET/POST calls.
- Suitable for SSR/Next.js API routes.

### ✅ When to use `axios`:
- Better default features: JSON auto-parsing, headers config, interceptors.
- Cleaner syntax for error handling.
- Ideal for authenticated API calls (like with `withCredentials: true`).

### In our project:
- Used `fetch()` for light GET calls.
- Used `axios` for authenticated calls where credentials, error handling, or token interceptors might be involved.

### 🧠 Key Takeaways
- For full control, use `axios`.
- For SSR or light calls, `fetch` is sufficient.
- Always enable `credentials: 'include'` when working with cookies and sessions.

---

## ✅ Overall Recap
- Use caching for performance and load optimization.
- Zustand is ideal for maintaining consistent global user state.
- Choose `axios` for advanced use-cases, `fetch` for simplicity.
- Secure and optimized session handling is critical in full-stack apps.

# 🧠 Caching Strategy & Learnings – Schedrix Project

This document summarizes all caching-related insights and decisions made throughout the Schedrix project. Caching was considered at every level — backend, frontend, and database — to ensure optimal performance and scalability.

---

## 📦 1. Server-Side Caching (Express Backend)

### ✅ Use Cases:
- **User session lookups**
  - `passport.deserializeUser` hits the DB every request. Instead, cache the user object after first fetch.
- **Expensive or frequently accessed DB data**
  - Example: points analytics, leaderboard, static data like motivation content or categories.

### ✅ Tools:
- `node-cache`: Simple in-memory caching for individual server instances.
- `Redis`: Distributed cache across multiple instances. Persistent, supports TTL and eviction policies.

### ✅ Best Practices:
- Use `Redis` for multi-instance deployments.
- Always invalidate or update cache on mutation endpoints (e.g., if a user updates their profile or tasks).
- Don’t cache highly dynamic or sensitive data unless using short-lived TTL.

---

## ⚙️ 2. Next.js Server Components & API Routes

### ✅ Use Cases:
- Pages with **server-rendered content** that changes infrequently (e.g., dashboard summaries, progress charts).
- Static content via **Incremental Static Regeneration** (ISR).

### ✅ Techniques:
- Use `fetch()` with caching options:
  ```ts
  fetch(url, { next: { revalidate: 3600 } }) // revalidate every hour
  ```
- Use `force-cache` or `no-store` as per requirement.
- API routes can be manually cached using memory or Redis for expensive results.

### ✅ Best Practices:
- Revalidate data that’s not user-specific but is requested frequently.
- Keep dynamic, per-user API routes with `no-store` unless cached at Express level.

---

## 🧠 3. Client-Side Caching (Zustand, LocalStorage)

### ✅ Use Cases:
- Store **logged-in user info**, **mind status**, **theme preference**, **year selection**, etc.
- Avoid repeated fetches when navigating between pages.

### ✅ Techniques:
- **Zustand** for reactive global state (`useUserStore`, `useMindStatusStore`, etc.)
- **LocalStorage** / **SessionStorage** for persistent preferences or onboarding status.
- Zustand can optionally sync with `localStorage` to persist data across reloads.

---

## 📃 4. MongoDB & Data Layer Caching

### ✅ Use Cases:
- Avoid repeated aggregation queries (e.g., progress summaries).
- Heavy reads from large collections.

### ✅ Tools:
- Cache the result in Redis or memory.
- MongoDB also supports in-memory storage engines for advanced use cases.

---

## ✨ Summary of Caching Locations:

| Layer                  | Example Use Case                          | Tool             |
|------------------------|-------------------------------------------|------------------|
| Express Server         | User session / Static content             | node-cache / Redis |
| Next.js Server         | Analytics charts, summary widgets        | `fetch` with revalidate |
| Browser (Client)       | User info, UI state, filters              | Zustand / localStorage |
| MongoDB                | Aggregation results                      | Redis or app memory |

---

Caching effectively reduces redundant work, improves user experience, and lowers server/database load. Choosing the right caching layer and invalidation strategy is key to data consis
