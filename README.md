# MERN Blog App

A full-stack blog application built with the MERN stack (MongoDB, Express, React, Node.js).

## Overview

This is a complete blog application that allows users to:
- Register and log in to their accounts
- Create, read, update, and delete blog posts
- View other users' blog posts
- Manage their personal blog content

## Tech Stack

### Backend (Node.js/Express)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs
- **Security**: CORS, cookie-parser, dotenv
- **Port**: 8002

### Frontend (React)
- **Framework**: React.js with Vite
- **Build Tool**: Vite
- **Styling**: CSS
- **State Management**: React hooks

## Features

### User Management
- User registration with password hashing
- User login with JWT authentication
- Session management with cookies

### Blog Management
- Create new blog posts
- View all blog posts (public and private)
- Edit existing blog posts
- Delete blog posts
- View individual blog posts with details

### Security
- Protected routes for authenticated users
- Password encryption using bcryptjs
- CORS configuration for secure cross-origin requests
- Error handling middleware

## Installation

### Backend Setup

`ash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Set your MongoDB URI and other environment variables

# Run the server
npm run dev
`

### Frontend Setup

`ash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
`

## API Endpoints

### Authentication Routes (/api/auth)
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Log in a user
- POST /api/auth/logout - Log out a user

### Blog Routes (/api/blogs)
- GET /api/blogs - Get all blog posts
- POST /api/blogs - Create a new blog post
- GET /api/blogs/:id - Get a specific blog post
- PUT /api/blogs/:id - Update a blog post
- DELETE /api/blogs/:id - Delete a blog post

### Health Check
- GET /api - API health check endpoint

## Project Structure

`
blog-app/
+-- backend/
¦   +-- config/              # Database configuration
¦   +-- middleware/         # Express middleware
¦   +-- models/             # Mongoose models
¦   +-- routes/             # API routes
¦   +-- server.js           # Main server file
¦   +-- .env                # Environment variables
¦   +-- package.json
+-- frontend/
¦   +-- src/                # React source code
¦   ¦   +-- components/     # React components
¦   ¦   +-- context/        # React context
¦   ¦   +-- hooks/          # Custom hooks
¦   ¦   +-- pages/          # Page components
¦   ¦   +-- lib/            # Utility functions
¦   +-- public/             # Static assets
¦   +-- package.json
+-- .git/                   # Git repository
+-- README.md               # Project documentation
`

## Development

### Backend Development
`ash
cd backend
npm run dev
`

### Frontend Development
`ash
cd frontend
npm run dev
`

The frontend typically runs on port 5173 and the backend on port 8002.

## Environment Variables

Create a .env file in the backend directory:

`env
PORT=8002
MONGODB_URI=mongodb://localhost:27017/mern-blog
NODE_ENV=development
`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Commit your changes
6. Push to the branch
7. Create a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- MongoDB and Mongoose for database management
- Express.js for the backend framework
- React and Vite for the frontend framework
- All open-source contributors

