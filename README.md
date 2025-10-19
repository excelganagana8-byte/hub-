# 🚀 Hub

A modern, full-stack web application built with **Vue 3** on the frontend and **Express.js & MongoDB** on the backend — designed to demonstrate how the frontend seamlessly interacts with the backend using a RESTful API architecture and powered by Vite for speed and efficiency.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **Reactive Frontend:** Built with Vue 3 for a fast, component-based user interface.
- **Utility-First Styling:** Styled beautifully with Tailwind CSS.
- **RESTful Backend:** Robust API built with Express.js.
- **Data Persistence:** MongoDB for flexible and scalable data storage.
- **State Management:** Pinia for simple and effective state management.
- **Modern Tooling:** Vite for a lightning-fast development experience.

## 🗂️ Project Structure

```bash
git-hub/
├── client/                 # Vue 3 + Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable Vue components
│   │   ├── stores/         # Pinia state management
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                 # Express.js Backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API route definitions
│   ├── controllers/        # Route controller logic
│   └── server.js           # Server entry point
├── .gitignore
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** instance (local or cloud-based like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/excelganagana8-byte/git-hub.git
cd git-hub

# Navigate to the server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets

# Navigate to the client directory from the project root
cd ../client

# Install dependencies
npm install

cd server
npm run dev
# Server runs on http://localhost:3000

cd client
npm run dev
# Client runs on http://localhost:5173 (or the next available port)
```
