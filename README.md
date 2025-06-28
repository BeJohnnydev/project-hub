Project Hub - A Full-Stack Task Management App
A Trello-inspired task management application built with React, Node.js, and Supabase. This project allows users to manage projects, create task lists, and organize tasks with a drag-and-drop interface.

Live Demo: [Link will go here once deployed]

Core Features
User Authentication: Secure user sign-up and login.

Project Management: Users can create, update, and delete their own projects.

Task Organization: Within each project, create custom lists (e.g., To Do, In Progress, Done).

Drag & Drop: Intuitively move tasks between lists to update their status.

Real-time Updates: Changes are reflected instantly for a seamless user experience.

Tech Stack
Frontend: React, Vite, CSS (or a library like Tailwind CSS)

Backend: Node.js, Express.js

Database & Auth: Supabase (PostgreSQL)

Getting Started
Instructions on how to set up and run a local copy of this project.

Prerequisites
You will need Node.js and npm installed on your machine.

Local Setup
Clone the repository:

Bash

git clone https://github.com/BeJohnnydev/project-hub.git
cd project-hub
Set up the Backend:

Bash

cd server
npm install
You will need to create a .env file in the /server directory with your Supabase credentials:

SUPABASE_URL="YOUR_PROJECT_URL"
SUPABASE_ANON_KEY="YOUR_ANON_KEY"
Then, start the server:

Bash

npm start 
# The server will be running on http://localhost:8000
Set up the Frontend (once built):

Bash

cd ../client 
npm install
npm run dev
# The client will be running on http://localhost:5173