# Twitter Clone

A **full-stack social media application** inspired by Twitter. This project showcases a complete
MERN stack implementation, enhanced with **Tailwind CSS**, **DaisyUI**, and **TanStack Query** for
optimized data fetching. Users can create posts, interact with others, and manage their
profiles—all within a responsive, modern UI.

---

##  Live Demo

[https://twitter-clone-5aed.onrender.com/](https://twitter-clone-5aed.onrender.com/)

---

## 🎯 Features

###  Authentication & Security
- User signup & login flows
- JWT-based authentication with HTTP-only cookies
- Protected API routes
- Password hashing with bcrypt

###  User Profiles
- View and edit profile information
- Follow / unfollow other users
- Upload profile/cover images via Cloudinary
- See followers, following lists, and suggested users

###  Posts
- Create text/posts with optional image upload
- Delete own posts
- Like/unlike posts
- Comment on posts
- Reshare posts (with notification)
- Real-time feed updates via optimistic UI
- View feeds by user, likes, reshares, or favorites

###  Notifications
- Likes
- Follows
- Reshares

###  Performance & UX
- Optimistic updates using TanStack Query
- Automatic caching and refetching
- Responsive design (desktop & mobile)
- Dark mode support
- Structured, maintainable codebase

---

##  Tech Stack

**Frontend:**
- React.js
- Tailwind CSS (v4)
- DaisyUI
- TanStack Query (React Query)
- React Router v6
- React Hot Toast

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ORM
- JWT authentication
- bcrypt for hashing
- Cloudinary for media storage

---

##  Deployment
- Application hosted together on **Render**
- MongoDB Atlas for database

---

##  Project Structure

```
twitter-clone/
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   ├── index.css
│   └── App.jsx
└── README.md
```

---

##  Installation & Setup (Local Development)

### 1. Clone repository

```bash
git clone https://github.com/ruchithata/twitter-clone.git
cd twitter-clone
```

### 2. Create environment file
In the project root create a file named `.env` containing:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
PORT=3030          # optional, defaults to 3000
```

### 3. Install dependencies & build

```bash
npm run build
```

### 4. Start the application

```bash
npm run start                     # starts backend on the PORT above
```

Navigate to `http://localhost:3030` (or your chosen port) to view the app. The backend
serves the frontend assets in production mode, so only one server is required.

---

##  Testing the App
After starting the server, you can:
- Sign up or log in
- Create posts, like/unlike, favorite, reshare
- Navigate to profile, notifications, favorites

---

##  Additional Notes
- Use `npm run dev` (with cross-env) to run backend with hot reload in development.
- To modify frontend during development, run `npm run dev --prefix frontend`.
- Add any new environment variables to `.env` and restart the server.
