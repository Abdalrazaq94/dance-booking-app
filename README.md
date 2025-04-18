# 🩰 Clyde Dance Academy - Full Stack Booking Platform

A complete web-based booking platform for dance academies. This application allows users to browse and book dance courses and sessions, while admins can manage everything through a protected admin dashboard.

> 🌍 **Live URL:** _[https://dance-booking-6aa0c4beeef7.herokuapp.com/]_  
> 🧠 Developed using: Node.js, Express, Mustache, Tailwind, NeDB, JWT, Bcrypt  
> 🛠 Deployed on: **Heroku**

---


---

## 📖 Project Overview

The **Clyde Dance Academy** is a full-featured course booking system designed for real-world use by dance schools or small institutions. The platform allows:

- Regular users to register, log in, and book course sessions and workshops.
- Admin users to add/edit/delete courses, manage users, view enrolments, and more.

---

## 🧩 Features

### 🔓 Public User Features:
- User registration and login
- Secure JWT-based authentication
- Browse available courses with full details
- View and book sessions or workshops
- Logout functionality

### 🔐 Admin Dashboard:
- View all courses in a dashboard
- Add, edit, or delete courses
- Add sessions and workshops to courses
- View users enrolments per course
- View all users and delete or manage them
- Add new admin or users from the admin panel

---

## 🔧 Technologies Used

### 🖥 Frontend

| Technology       | Purpose                                    |
|------------------|---------------------------------------------|
| **Mustache.js**  | Templating engine for rendering dynamic HTML |
| **Tailwind CSS** | Utility-first modern CSS framework           |
| **Bootstrap**    | Quick styling for forms and buttons         |
| **jQuery**       | Optional DOM manipulation / interactivity   |

### 🔙 Backend

| Technology       | Purpose                                   |
|------------------|--------------------------------------------|
| **Node.js**      | JavaScript runtime                         |
| **Express.js**   | Backend server framework                   |
| **JWT**          | Secure authentication via tokens           |
| **Bcrypt**       | Password hashing and verification          |
| **dotenv**       | Load environment variables securely        |
| **Cookie-parser**| Parse cookies for JWT-based auth           |

### 🗂 Database

| Technology | Purpose                                  |
|------------|-------------------------------------------|
| **NeDB**   | Lightweight document-based DB (like MongoDB but stored locally as `.db` files) |

---

## 📁 Project Structure

```bash
dance-booking-app/
├── auth/                  # Middleware (auth.js)
├── controllers/           # Route logic for admins and users
├── models/                # DB logic (userModel, courseModel, etc.)
├── public/
│   └── css/               # Tailwind CSS styles
├── routes/                # Route definitions
├── views/
│   ├── admin/             # Admin panel templates
│   ├── user/              # Public views
│   └── public/            # public files 
├── users.db               # NeDB database file (auto-created)
├── index.js               # Main server entry point
├── .env                   # JWT secret
├── .gitignore             # Ignored files
├── package.json           # Project metadata
├── Procfile               # Heroku config
└── README.md              # You’re reading it!
