# Supermarket Express

A full-stack supermarket management system with inventory tracking, customer management, and order processing capabilities.

## Project Overview

Supermarket Express is a web application built with modern technologies to manage supermarket operations efficiently. It features a REST API backend with a responsive React frontend. The application allows users to manage customers, inventory items, and process customer orders while automatically updating stock levels.

## Features

- **Customer Management**: Add, update, view, and delete customer information
- **Inventory Management**: Track items, their quantities, and prices
- **Order Processing**: Create orders for customers with automatic stock updates
- **Responsive Design**: User-friendly interface that works on various devices

## Tech Stack

### Backend

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/downloads/)

### Frontend

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

## Project Structure

```
supermarket-express/
├── backend/
│   ├── modal/              # Data models
│   ├── prisma/             # Prisma ORM configuration
│   ├── repository/         # Database access layer
│   ├── routes/             # API endpoints
│   ├── schema/             # Database schema
│   ├── server.ts           # Express server setup
│   └── package.json        # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── models/         # TypeScript interfaces
    │   ├── pages/          # Application pages
    │   ├── reducers/       # Redux reducers
    │   ├── store/          # Redux store configuration
    │   └── App.tsx         # Main application component
    ├── public/             # Static assets
    ├── vite.config.ts      # Vite configuration
    └── package.json        # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your database:

   - Create a MySQL database named `supermarket`
   - Update the `.env` file with your database connection string:
     ```
     DATABASE_URL="mysql://username:password@localhost:3306/supermarket"
     ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## License

This project is proprietary software and not licensed for redistribution. See the [LICENSE.md](LICENSE.md) file for details.
