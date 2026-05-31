# ✦ ProjectHub

ProjectHub is a clean, modern, developer-focused platform designed to help creators showcase, share, and get constructive feedback on their projects. Instead of scattered links and messy portfolios, ProjectHub gives developers a single place that truly represents their technical achievements, visual style, and coding journey.

---

## ✨ Key Features

- **Interactive 3D Visuals:** A stunning, premium landing page experience powered by Three.js.
- **Supportive Community Review Engine:** Get constructive feedback from peers with detailed scores across **Functionality**, **UI/UX**, and **Code Quality**.
- **Modern Glassmorphism Design:** Curated, cohesive aesthetics featuring fluid animations, harmonized colors, and instant Light/Dark mode toggles.
- **Blazing Fast Performance:** Powered by SvelteKit's server-side rendering (SSR) and Svelte 5's fine-grained reactivity.
- **Native MongoDB Backend:** Zero ORM overhead, utilizing the official Node.js MongoDB driver for optimized, schema-less document queries.

---

## 🛠️ Tech Stack

ProjectHub utilizes a premium, high-performance stack carefully crafted for stability, security, and developer joy:

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Svelte 5](https://svelte.dev/) | Utilizing Svelte 5 runtimes, fine-grained signals, and SSR. |
| **Backend** | [SvelteKit](https://kit.svelte.dev/) | File-based routing, server loads, and secure API endpoints. |
| **Database** | [MongoDB](https://www.mongodb.com/) | High-performance, schema-less document database. |
| **Client** | [Native MongoDB Driver](https://www.npmjs.com/package/mongodb) | Direct query execution with zero ORM abstraction overhead. |
| **Visuals** | [Three.js](https://threejs.org/) | Renders interactive, hardware-accelerated 3D graphics. |
| **Security** | [BcryptJS](https://www.npmjs.com/package/bcryptjs) | Industry-standard password hashing and security. |
| **Validation** | [Zod](https://zod.dev/) | Strict, runtime type checking for form submissions. |

---

## 🚀 How to Run Locally

Get ProjectHub up and running on your local system in just a few simple steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017` or a remote Atlas connection string)

### Steps to Launch

1. **Clone and Navigate:**
   ```bash
   git clone https://github.com/dhruvmkolhe/project-hub.git
   cd project-hub
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory (you can copy `.env.example`) and supply your MongoDB connection string:
   ```env
   DATABASE_URL=mongodb://localhost:27017/projecthub
   SESSION_SECRET=your-secure-session-key
   PUBLIC_APP_NAME=ProjectHub
   PUBLIC_APP_URL=http://localhost:5173
   ```

4. **Seed the Database:**
   Populate your collections with demo user accounts, projects, and structured reviews:
   ```bash
   npm run db:seed
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser and log in with any of the seeded accounts (Password: `Password123`):
   - `john@example.com`
   - `sarah@example.com`
   - `mike@example.com`
   - `emma@example.com`
   - `alex@example.com`

---

## 🔒 Security & Optimization

> [!NOTE]
> Database operations use direct native queries which are fully protected from injection vectors. Session storage maps clean POJO layout states without BSON leaks to ensure fast client-side hydration.



