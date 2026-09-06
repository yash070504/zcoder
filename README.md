# 🚀 ZCoder — Next-Generation Competitive Programming & Developer Arena

<div align="center">

![ZCoder Banner](https://img.shields.io/badge/ZCoder-Competitive%20Programming%20Arena-6366f1?style=for-the-badge&logo=codeforces&logoColor=white)

[![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js%20LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco%20Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)

<p align="center">
  <b>A state-of-the-art developer platform combining real-time code execution, LeetCode-style problem solving, interactive community discussions, and a multi-platform contest tracker.</b>
</p>

[Explore Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [API Reference](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

**ZCoder** is an all-in-one ecosystem designed for competitive programmers, interview candidates, and software engineers. Built with a sleek dark glassmorphic design system, ZCoder brings together in-browser multi-language compilation, algorithmic challenge authoring, live-synchronized developer discussions, and global contest calendars into a unified, high-performance experience.

---

## ✨ Key Features

### ⚡ 1. Cybernetic Arena Command Center (Dashboard)
- **Dynamic Coder HUD**: Displays user avatar with live online status, customizable rank tiers (e.g. `Level 5 Coder`), and active streak counters (`🔥 5-Day Streak`, `1,480 Elo`).
- **Daily Challenge Quest**: Automatic daily featured problem card showcasing difficulty pills (`Easy`, `Medium`, `Hard`), topic tags, and a direct `⚡ Solve in Playground` launch button.
- **Spacious 2x2 Rapid Launchpad**: High-visibility neon glass action cards with generous gaps and micro-animations for instant navigation to:
  - 📚 **Problem Library**: Filter by topic & difficulty
  - ⚡ **Code Playground**: Run JS, Python & C++ with live output
  - 💬 **Community Forum**: Live discussions & developer solutions
  - ➕ **Contribute Problem**: Custom testcases and authoring
- **Long-Lived 30-Day Sessions**: Extended 30-day token lifetime and device persistence with background silent re-authentication (`baseQueryWithReauth`) so developers never get repeatedly kicked to the login screen.

### 💻 2. In-Browser Code Playground
- **Powered by Monaco Editor**: The same high-performance editor engine that powers Visual Studio Code.
- **Multi-Language Support**: Write, compile, and execute code in real-time with:
  - **JavaScript** (Node.js 18)
  - **TypeScript** (5.0)
  - **Python** (3.10)
  - **C++** (GCC)
  - **Java** (OpenJDK 15)
  - **C#** (.NET)
  - **PHP** (8.2)
- **Instant Output Terminal**: Clean output console with execution status, runtime metrics, and error diagnostics.

### 📚 3. Algorithmic Problem Hub & Studio
- **Curated Problem Library**: Filter questions by difficulty (`Easy`, `Medium`, `Hard`) and topic categories (`Dynamic Programming`, `Graphs`, `Arrays`, `Trees`, `Math`, `Strings`).
- **Full-Width Problem Studio**: A 2-column creator studio:
  - **Main Editor**: Custom title, constraints, formatted input/output helper snippets, and reference solution IDE with code boilerplate insertion.
  - **Studio Sidebar**: Interactive difficulty toggle buttons with glowing color badges, test case URL integration (LeetCode, Codeforces), and a live card mockup preview.

### 💬 4. Real-Time Community Forum
- **Live Auto-Synchronization**: Background auto-polling (every 3s) and RTK Query tag invalidation (`Post`, `Comment`) ensure new posts, likes, and replies appear instantly across all logged-in accounts without page refreshing.
- **Cross-Account Synchronized Likes**: Upvotes and helpful hearts (`❤️ Like`) are persisted directly to MongoDB (`likes` array). Like counts and heart states immediately reflect across all devices and accounts.
- **Real-Time Author Notifications**: Whenever another developer likes or comments on your post, live alert toasts (`❤️ @username liked your post!` / `💬 @username commented on your post!`) notify the author instantly.
- **Guest Access & Action Safeguards**: Anonymous/guest users can freely view discussions and shared permalinks. When a guest attempts to like or reply, intuitive prompts guide them to **Sign In** or **Create a new account** without crashing or throwing unhandled errors.
- **Deep Search Across Posts & Specific Comments**: Search queries match across post titles, bodies, authors, tags, and **specific discussion comments**, with comment match badges and auto-expansion.
- **Universal Share Permalinks**: One-click `🔗 Share` button copies direct permalinks (`/community?post=<id>`). **Both logged-in and guest users** can view shared posts with smooth scroll-into-view and glowing focus highlights.
- **Dynamic Tag Filter Pills**: Quick-filter by tags with active post count badges.
- **Clickable Developer Profiles**: Every author and commenter badge links directly to their public overview.

### 🏆 5. Multi-Platform Contest Radar
- **Integrated Live Calendar**: Syncs and tracks upcoming competitive rounds across:
  - 🔴 **Codeforces**
  - 🟡 **LeetCode**
  - 🟤 **CodeChef**
  - 🔵 **AtCoder**
- **Direct Registration Links**: Jump straight to registration pages with live countdown timers.

### 👤 6. Customizable Profiles & Reactive SVG Avatars
- **Curated Default Avatars**: High-contrast, custom vector avatars (`Cyber Bot`, `Neon Coder`, `Code Wizard`, `Matrix Ninja`) with instant fallback protection.
- **Real-Time Global Sync**: Avatar edits immediately broadcast across navigation headers, dropdown cards, dashboard banners, and community posts without requiring page reloads.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Code Editor**: [@monaco-editor/react](https://www.npmjs.com/package/@monaco-editor/react)
- **UI & Styling**: Vanilla CSS3 (Custom Design System, Glassmorphism), [Bootstrap 5](https://getbootstrap.com/), [Chakra UI](https://chakra-ui.com/), [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens ([JWT](https://jwt.io/)) with HTTP-only cookies & Bearer tokens, [bcrypt](https://www.npmjs.com/package/bcrypt) hashing
- **Security & Utilities**: CORS, Express Rate Limit, Cookie Parser, Express Async Handler

---

## 📋 Prerequisites

Before running ZCoder locally, ensure you have:
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- [npm](https://www.npmjs.com/) (version `9.x` or higher)
- [Git](https://git-scm.com/)
- A running [MongoDB](https://www.mongodb.com/) instance (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yash070504/zcoder.git
cd zcoder
```

### 2. Backend Configuration & Setup
Navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root directory:
```env
PORT=3500
NODE_ENV=development
DATABASE_URI=mongodb://127.0.0.1:27017/zcoder
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
```

Start the backend server:
```bash
# Production / Standard start
npm start

# Development mode (with nodemon auto-restart)
npm run dev
```
> The backend server will initialize on `http://localhost:3500` and connect to MongoDB.

### 3. Frontend Setup
In a new terminal window, navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
> Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Project Structure

```text
Z-Coder/
├── backend/
│   ├── config/
│   │   ├── allowedOrigins.js      # CORS allowed origins whitelist
│   │   ├── corsOptions.js         # Express CORS configuration
│   │   └── dbConn.js              # Mongoose MongoDB connection logic
│   ├── controller/
│   │   ├── authController.js      # Login, registration, refresh token, logout
│   │   ├── postController.js      # Community posts, comments, notifications
│   │   ├── promblemController.js  # Coding challenges CRUD operations
│   │   └── userController.js      # User profile, avatars, settings
│   ├── middleware/
│   │   ├── errorHandler.js        # Global error interception
│   │   ├── logger.js              # Request activity logger
│   │   ├── loginLimiter.js        # Rate-limiting for auth routes
│   │   └── verifyJWT.js           # Token authentication guard
│   ├── model/
│   │   ├── Comment.js             # Comment schema
│   │   ├── Post.js                # Community post schema with timestamps
│   │   ├── Promblem.js            # Problem challenge schema
│   │   └── User.js                # User schema (credentials, avatars, roles)
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── postRouter.js          # Public feed & protected mutation routes
│   │   ├── promblemRouter.js
│   │   └── userRouter.js
│   ├── package.json
│   └── server.js                  # Express application entrypoint
│
├── frontend/
│   ├── public/                    # Static assets & icons
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/apiSlice.jsx   # Base RTK Query API slice with JWT injection
│   │   │   ├── id.jsx             # User identity & avatar Redux slice
│   │   │   └── store.jsx          # Root Redux store configuration
│   │   ├── components/
│   │   │   ├── Dash.jsx           # Cybernetic Arena Command Center
│   │   │   ├── Intro.jsx          # Public landing page
│   │   │   ├── Login.jsx          # Glassmorphic authentication portal
│   │   │   └── Navbar.jsx         # Global navigation bar & reactive NavAvatar
│   │   ├── feature/
│   │   │   ├── Calender/          # Multi-platform contest schedule
│   │   │   ├── coding/            # Monaco-powered Code Playground & executor
│   │   │   ├── community/         # Community feed, Post, Comment, NewFormPost
│   │   │   ├── promblem/          # Problem list (ViewPro) & Studio (NewPromblem)
│   │   │   └── user/              # User ProfileView & Edit profile forms
│   │   ├── constants.jsx          # Language boilerplates & default SVG avatars
│   │   ├── index.css              # Core design tokens, glassmorphism, animations
│   │   ├── main.jsx               # React router route definitions & entrypoint
│   │   └── theme.jsx              # Chakra UI custom theme
│   ├── package.json
│   └── vite.config.js             # Vite bundler configuration
│
└── README.md
```

---

## 📡 API Endpoints Reference

### Authentication (`/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/auth` | User login (returns 30-day access token & 30-day refresh cookie) | Public |
| `GET` | `/auth/refresh` | Generates a new 30-day access token using refresh cookie | Public |
| `POST` | `/auth/logout` | Clears authentication cookies & ends session | Public |

### Users (`/user`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/user` | Fetch all registered developers | Protected |
| `POST` | `/user` | Register a new developer account | Public |
| `PATCH` | `/user` | Update username, email, or avatar URL | Protected |
| `DELETE` | `/user` | Delete user account permanently | Protected |

### Community Posts & Discussions (`/post`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/post` | Fetch all discussions (latest first, author resolved) | **Public** |
| `GET` | `/post/one/:id` | Fetch specific discussion by ID for permalinks | **Public** |
| `POST` | `/post` | Create a new community discussion | Protected |
| `DELETE` | `/post` | Delete post (Author only) | Protected |
| `POST` | `/post/like` | Toggle upvote/like on a post (synchronizes across accounts) | Protected |
| `GET` | `/post/comment` | Retrieve comments for a post | **Public** |
| `POST` | `/post/comment` | Add comment & trigger author notification | Protected |

### Algorithmic Problems (`/promblem`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/promblem` | Fetch all coding challenges | Public |
| `POST` | `/promblem` | Submit a new coding challenge | Protected |
| `PATCH` | `/promblem` | Update problem statement or solution | Protected |
| `DELETE` | `/promblem` | Delete coding challenge | Protected |

---

## 🧪 Building for Production

To create an optimized production build of the frontend:
```bash
cd frontend
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Crafted with passion for competitive coders worldwide • <b>ZCoder Arena</b></sub>
</div>
