# Project Hub - A Full-Stack Task Management App

A Trello-inspired task management application built with **React**, **Node.js**, and **Supabase**. This project allows users to manage projects, create task lists, and organize tasks with a drag-and-drop interface.

🚀 **Live Demo**: [Link will go here once deployed]

---

## 🔧 Core Features

- **User Authentication**: Secure user sign-up and login.
- **Project Management**: Users can create, update, and delete their own projects.
- **Task Organization**: Within each project, create custom lists (e.g., To Do, In Progress, Done).
- **Drag & Drop**: Intuitively move tasks between lists to update their status.
- **Real-time Updates**: Changes are reflected instantly for a seamless user experience.

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, CSS (or Tailwind CSS)
- **Backend**: Node.js, Express.js
- **Database & Auth**: Supabase (PostgreSQL)

---

## 🚀 Getting Started

Follow these instructions to set up and run a local copy of this project.

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

---

### 📦 Local Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/BeJohnnydev/project-hub.git
cd project-hub
2. Set Up the Backend
bash
Copy
Edit
cd server
npm install
Create a .env file inside the /server directory with your Supabase credentials:

env
Copy
Edit
SUPABASE_URL="YOUR_PROJECT_URL"
SUPABASE_ANON_KEY="YOUR_ANON_KEY"
Start the server:

bash
Copy
Edit
npm start
# The server will be running on http://localhost:8000
3. Set Up the Frontend
bash
Copy
Edit
cd ../client
npm install
npm run dev
# The client will be running on http://localhost:5173
Happy building! 🎉