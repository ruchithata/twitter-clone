# Twitter-clone

A **full-stack social media application** inspired by Twitter, built using the **MERN stack** with **Tailwind CSS** and **TanStack Query** for efficient data fetching and caching.  
Users can post tweets, edit or delete them, and explore others' posts — all with a smooth, responsive, and futuristic UI.

---

## Live Demo

Deployed link: https://twitter-clone-5aed.onrender.com/

---

## Features

#### Authentication & Security
- User Signup & Login
- JWT-based Authentication
- Protected Routes
- Secure password hashing using bcrypt
- Persistent login using HTTP-only cookies

#### User Profile
- View user profiles
- Follow / Unfollow users
- Update profile image & cover image
- Followers & Following system
- Suggested users feature

#### Posts
- Create Tweets (Text + Image Upload)
- Delete own posts
- Like / Unlike posts
- Comment on posts
- Reshare posts
- Real-time feed updates with optimistic UI
- View posts by specific users
- View liked posts

#### Notifications
- Like notifications
- Follow notifications
- Reshare notifications

#### Performance & UX
- Optimistic UI updates using TanStack Query
- Efficient caching & automatic refetching
- Responsive layout (Desktop + Mobile)
- Dark mode modern UI
- Clean, scalable folder structure

---

## Tech Stack

**Frontend:**
- React.js  
- Tailwind CSS  
- TanStack Query (React Query)
- React Router
- React Hot Toast
- DaisyUI

**Backend:**
- Node.js  
- Express.js  
- MongoDB with Mongoose  
- JWT Authentication  
- bcrypt.js for password hashing  
- Cloudinary (for image uploads)

---

## Deployment

- Frontend + Backend hosted on Render
- MongoDB Atlas (Cloud Database)

---

## Project Structure

twitter-clone/
│
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── lib/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   └── App.jsx
│
└── README.md

## Installation & Setup (Local Development)

#### Clone Repository

git clone https://github.com/ruchithata/twitter-clone
cd twitter-clone

#### Setup Environment Variables
Create a .env file in the root directory

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

#### Run the app

npm run build && npm run start