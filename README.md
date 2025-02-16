# Hospital API

## 📌 Project Overview
This is a RESTful API built with **Node.js, Express, and MySQL**, designed to manage a hospital's doctors. The API provides endpoints to **create, update, delete, activate, and deactivate doctors**, as well as retrieve lists of active and inactive doctors. The project follows a structured and scalable architecture, using **Zod for validation**, **Jest for testing**, and **Swagger for documentation**.

## 🚀 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL (using `mysql2` package)
- **ORM/Query Builder:** Custom SQL queries
- **Validation:** Zod
- **Testing:** Jest
- **Logging:** Winston
- **Caching:** Custom middleware
- **Documentation:** Swagger
- **Frontend:** React (Vite) - included within the same repository

## 📂 Folder Structure
```
/project-root
│-- backend/
│   ├── __mocks__/
│   ├── __tests__/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── docs/ (Swagger API documentation)
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   └── app.js
│
│-- frontend/ (React + Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
│
│-- .env.example
│-- package.json
│-- README.md
```

## 🔧 Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/CristianGonzalez24/CRUD-nodejs-mysql.git
cd CRUD-nodejs-mysql
```

---

### 2️⃣ Install dependencies
```sh
npm install
```

---

### 3️⃣ Set up the database (MySQL)
Before running the project, you need to create and set up the database.

#### ➤ **Option 1: Using MySQL Workbench**
1. Open **MySQL Workbench** and connect to your MySQL server.
2. In the **Navigator panel**, click on the **Schemas** tab.
3. Click on **Create Schema**, enter `hospital_db` as the database name, and apply the changes.
4. To import the database structure:
   - Click on **File > Run SQL Script**.
   - Select the file **`query.sql`** located in the project.
   - Execute the script to create the necessary tables.

#### ➤ **Option 2: Using the Terminal**
If you prefer using the terminal, follow these steps:

1. Open a terminal and connect to MySQL:
```sh
mysql -u root -p
```
2. Create the database:
```sh
CREATE DATABASE hospital_db;
```
(You can replace hospital_db with another name, but make sure to update it in the .env file.)
3. Use the new database:
```sh
USE hospital_db;
```
4. Import the structure from the provided SQL script:
```sh
mysql -u root -p hospital_db < query.sql
```
Once the database is set up, you can proceed with running the backend.

---

### 4️⃣ Set up the `.env` file
Create a `.env` file in the root directory and add the following environment variables:
```sh
NODE_ENV=development
FRONTEND_URL=url_vite
PRODUCTION_URL=https://mi-app.com
PORT=port_nodejs
LOG_LEVEL=info
DB_HOST=localhost
DB_PORT=port_mysql
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_db
```
*(Replace `your_password` with your actual MySQL password.)*

---

### 5️⃣ Start the backend server
```sh
npm start
```
By default, the API will run at `http://localhost:3000`

---

### 6️⃣ Start the frontend (React + Vite)
```sh
cd client
npm install
npm run dev
```
By default, the frontend will run at `http://localhost:5173`

## 🐝 API Endpoints
All routes follow RESTful conventions.

### **🔹 Doctors Routes**
| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| GET    | `/doctors`             | Get a paginated list of active doctors |
| GET    | `/doctors/all`         | Get a paginated list of all doctors |
| POST   | `/doctors`             | Create a new doctor (requires validation) |
| PUT    | `/doctors/:id`         | Update doctor details |
| DELETE | `/doctors/:id`         | Soft delete a doctor |
| PATCH  | `/doctors/:id/deactivate` | Mark a doctor as inactive |
| PATCH  | `/doctors/:id/activate` | Reactivate a doctor |

**For detailed API documentation, visit:** `http://localhost:3000/api-docs`

## ✅ Testing
To run unit and integration tests:
```sh
npm test
```
Jest is used for testing models, controllers, routes and middlewares.

## 📷 Screenshots
> 

## 🎯 Future Improvements
- Implement user authentication and authorization
- Improve error handling with a global error handler
- Add role-based access control (RBAC)

## 📝 License
This project is licensed under the MIT License. Feel free to use and modify it.

---
### 🎉 Happy Coding! 🚀
