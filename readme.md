# CRUD for Testing

A basic CRUD application where I plan to implement automated testing.  

- **Backend:** Node.js + Axios connected to PostgreSQL  
- **Frontend:** React + Vite + TypeScript, using TanStack tables  
- **Current State:** Only one `books` table implemented  
- **Deployment:** Docker Compose, can be automatically deployed via GitHub Actions  
- **Development Environment:** Auto-updating dev setup  

---

## Features

- CRUD operations for the `books` table  
- Dockerized setup for frontend and backend  
- CI/CD deployment through GitHub Actions  
- Hot reload / auto updates in dev  

---

## Installation & Running Locally

1. Clone the repository:  
2. Install Node.js dependencies in frontend and backend:
3. Copy `.env.example` to `.env` in root directory and set database variables.
4. Copy `.env.development` to `.env` in frontend directory.
5. Start with Docker Compose:

    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Database Initialization

When the application is started for the first time, the PostgreSQL database is empty.
The initial schema is created automatically using the SQL files inside: postgres/init/


## Roadmap

    Add basic Jest testing

    Add authtentification

    Implement backend pagination

    Seed the database with more dummy data