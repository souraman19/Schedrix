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




# AI-Driven Mind Status Prediction

## Using of ML to predict mindtstatus summaery Summary


### 1. **Data Collection**
   - **User Points Data**: The project tracks user points, task completions, and task misses over time. This data is stored in a **MongoDB database** under the `UserPoints` schema.
   - **Recent Data Fetching**: The server fetches the **last 7 days' worth of data** for each user to perform predictions.
   - **Fallback Logic**: If data for any of the 7 days is missing, default values are inserted (e.g., `0` for `pointsGain`, `pointsLoss`, etc.) to ensure consistent input to the ML model.

---

### 2. **Data Preprocessing**
   - **Feature Engineering**: The raw data is processed to extract **relevant features** required for the prediction task.
   - **Normalization**: Missing or inconsistent data is normalized to ensure all days are represented, filling with zeros when necessary.

---

### 3. **Model Development**
   - **Model Architecture**: A **Sequential LSTM model** is used to train the mind status prediction model. The model consists of:
     - **Two LSTM layers**: For time-series data handling.
     - **Dense Layers**: For learning relationships between input features and output categories.
   - **Activation Functions**: `relu` for hidden layers and `softmax` for the output layer (to classify mind status into different categories).
   - **Loss Function**: `sparse_categorical_crossentropy` to handle multi-class classification.
   - **Optimizer**: `adam` to optimize the model's weights.

---

### 4. **Model Training**
   - The model is trained using **historical data**, including **features like task completion, task missed, and point gain/loss** over the last 7 days.
   - The model's performance is evaluated using **accuracy** as a metric.

---

### 5. **Model Saving**
   - Once trained, the model is **saved to disk** using `model.save()` for future use.
   - The saved model can be loaded later to perform real-time predictions without the need for retraining.

---

### 6. **Prediction Process**
   - **API Endpoint**: A Node.js/Express API endpoint (`/getMindStatus`) is created to handle predictions.
   - **Server Interaction**: The server:
     - Fetches the user's **recent 7 days data**.
     - Preprocesses the data to match the model input format.
     - Passes the processed data to the saved ML model to predict the **mind status** for the day.
     - Sends the predicted mind status back as a response to the client.

---

### 7. **Integration**
   - **Python and Node.js Integration**: The server communicates with the Python-based ML model via **Python `child_process`**. This allows the model's Python code to be invoked from within the Node.js server, enabling **seamless integration** for real-time predictions.

---

### 8. **Frontend Interaction**
   - The **client-side** can query the `getMindStatus` endpoint, receive the predicted mind status, and display it as part of the user's dashboard or analysis page.

---


# Future Enhancements:
- **Model Improvement**: Fine-tuning the model with more data and advanced techniques to increase prediction accuracy.
- **Feature Expansion**: Including more features (e.g., task priority, deadlines, etc.) to improve model predictions.
- **Real-time Predictions**: Allowing for predictions based on **real-time** data instead of just historical data.


# 🔍 Additional Implementation Details (Expanded)

# 🔔 FCM Notifications (Deep Dive)

## **Token Setup**:

  * Imported `getMessaging()` and `getToken()` from Firebase.
  * Used `getToken(messaging, { vapidKey })` to generate FCM token.
  * Stored token per user in MongoDB.

## **Service Worker**:

  * Placed `firebase-messaging-sw.js` in public root.
  * Included code to listen for background notifications:

    ```js
    messaging.setBackgroundMessageHandler(function(payload) {
      const notificationTitle = payload.notification.title;
      const notificationOptions = { body: payload.notification.body };
      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
    ```

## **Foreground Toasts**:

  * Imported `onMessage()` in client to trigger ShadCN toast:

    ```ts
    onMessage(messaging, (payload) => {
      toast({ title: payload.notification.title, description: payload.notification.body });
    });
    ```

## **Reminder Triggering**:

  * BullMQ worker schedules reminders using `delay` option.
  * Notification payload contains task title, time, and action link.

# 🧠 MindStatus Modal Prompt

* Modal rendered in layout route or main shell on mount.
* Logic checks if:

  * `!localStorage.lastPromptedDate` OR
  * `Date.now() - lastPromptedDate > 3 days`
* If yes:

  * Prompt modal with selectable mood options (e.g. determined, calm, burned out).
  * After submission, save `mindStatus` and update `lastPromptedDate`.
  * Optionally send to backend for logging trends.

# 📜 Content System Logic

## **ZenQuotes API**:

  * Fetched 10–30 quotes via `https://zenquotes.io/api/quotes`.
  * Parsed and pre-processed with `tagQuotes()` function.

## **Gemini Prompt**:

  * Prompt formatted with `${quote}` and `${mindStatus}` inserted.
  * Gemini returns a 2–3 sentence elaboration.

## **SDXL Image Generation**:

  * SDXL prompted with Gemini response using `/txt2img` API.
  * Image base64 or URL saved in DB.

## **Video Selection**:

  * YouTube API key used in call:

    ```ts
    https://www.googleapis.com/youtube/v3/search?part=snippet&q=motivational+${mindStatus}&videoDuration=short&type=video
    ```
  * Filtered results shown in content section with title + thumbnail.

## 🐂 BullMQ Workers

* Defined queues for `taskReminder`, `quoteFetcher`, `videoFetcher`.
* Worker script includes job handlers:

  ```ts
  queue.process('quoteFetcher', async () => {
    const quotes = await fetchZenQuotes();
    const tagged = await tagQuotes(quotes);
    await saveToDB(tagged);
  });
  ```
* Scheduled with CRON string or fixed delay using:

  ```ts
  queue.add('taskReminder', taskPayload, { delay: 1000 * 60 * 60 })
  ```

## 🏷️ Semantic Tagging Fallback Chain

* **Step 1: Zero-Shot**:

  * Input: quote, labels array
  * BART returns ranked label confidence
* **Step 2: Keyword Match**:

  * For fallback, quote is passed through compromise NLP parser.
  * Keywords extracted and mapped to predefined tag list.
  * Output: tag list with match weight (e.g. count of keyword hits).

## 📆 Timeline Scheduler Internal Logic

* Timeline spans 7 days starting from yesterday.
* Time represented as 1440 rows (1 per minute).
* Each row = fixed height (zoomable from 10px to 40px).
* Day column headers rendered with dates and day names.
* State stored as:

  ```ts
  schedule = { dayIndex: number, startMin: number, endMin: number }
  ```
* Undo stack implemented using a simple array of history states.

# 🖼️ Image Upload Mechanics

* Frontend:

  * `<input type="file" multiple accept="image/*">`
  * Preview shown using `URL.createObjectURL(file)`.
* Backend:

  * Used Multer with destination `uploads/tasks/`
  * Task schema stores image filenames as an array.

# 🎙️ Audio Record Upload

* Setup:

  * `MediaRecorder(stream)` from `navigator.mediaDevices.getUserMedia()`
  * Captures audio chunks to Blob
* Controls:

  * `mediaRecorder.pause()`, `.resume()`, `.stop()`
* Backend:

  * Received in route `/upload/audio` via Multer
  * Stored in `uploads/audio/`
  * Path linked in task schema




---



# 🚀 Schedrix Deployment & Infrastructure Setup

## 🗓️ : June 2025

---

## ✅ 1. Smart Architecture Design Decisions

### 🔁 Unified Background Service

* Combined:

  * Cron jobs (e.g., deadline penalties)
  * BullMQ queue workers (e.g., reminderWorker, videoFetchWorker)
  * Express server for `/` health check
* Deployed as a **Render Web Service** to satisfy `app.listen(...)` requirement.

### 🔁 Separate ML Service

* Flask + TensorFlow model deployed as its own service.
* Decoupled from Node.js backend for flexibility and reliability.

---

## ✅ 2. Dockerization Strategy

### ✅ ML Service Docker Setup

* Dockerfile created using `python:3.11.9-slim`.
* Exposed port 6000.
* Ran Flask app via `gunicorn app:app`.

### 🧨 Issue With Native Deploy:

* Render’s native Python environment failed due to:

  * TensorFlow requiring system-level libraries
  * Lack of control over Python version and system packages

### 🧯 Solution:

* Switched to **Docker-based deployment** to eliminate dependency issues.

---

## ✅ 3. Background Worker Deployment

### ❗ Initial Challenge:

* Planned to deploy workers as separate services.
* Render Background Workers can’t use `app.listen()`.

### ✅ Fix:

* Created a single service that:

  * Awaits `connectDB()`
  * Dynamically imports workers and cron jobs
  * Starts Express server afterward

---

## ✅ 4. Cookie & Session Issues on Server Components

### ❗ Issue:

* Server components in Next.js couldn’t access cookies properly.
* Middleware like `req.cookies` didn’t work well with SSR.

### ✅ Fix:

* Converted all server components needing cookies into **client components**.
* Ensured smooth access to session data on the client side.

---

## ✅ 5. Cloudinary Setup 

  Use clodinary to upload images because we dont have write access to render server filesystem to get qotd images so upload in cloudinary.

  For prevention of repeatative image genration in same day we use smart chahing based mechanism=> first through api check if image with filename exist if yes then return that existed image as qotd image.
---

## ✅ 6. TypeScript Compilation Strategy

### ❗ Initial Setup:

* Used `ts-node` with `--require ts-node/register` in Render.

### ❗ Issues:

* Cold starts
* Type resolution issues
* Unreliable module paths

### ✅ Fix:

* Switched to compiling with `tsc`
* Used `node dist/server.js` for production

---

## ✅ 7. PM2 

great for local dev but for prod not necessary

---

## ✅ 8. CORS & Proxy Config

### ❗ Problems:

* Cookies not returning from backend
* CORS issues between frontend/backend
* Sessions not persisting

### ✅ Fixes:

1. **Set trust proxy in Express:**

```ts
app.set("trust proxy", 1);
```

2. **Updated session cookie options for production:**

```ts
cookie: {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
}
```

3. **Updated CORS config:**

```ts
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

---

## ✅ 9. Deployment Tools Tried

| Tool          | Purpose                 | Outcome             |
| ------------- | ----------------------- | ------------------- |
| `build.sh`    | Shell script for setup  | ❌ Not used          |
| `runtime.txt` | Specify Python version  | ❌ Ignored on Render |
| `Dockerfile`  | Final deployment method | ✅ Works reliably    |

---

## ✅ 10. Secure Deployment Practices

* Set `cookie.secure: true` for production
* Avoided memory store for sessions (to be replaced with Redis)
* Used `process.env.PORT` instead of hardcoded ports

---
