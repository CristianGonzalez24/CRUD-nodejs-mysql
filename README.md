# Hospital API - Backend

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
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── swagger.json
│
│-- frontend/ (React + Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── vite.config.js
│
│-- docs/ (Swagger API documentation)
│-- .env.example
│-- package.json
│-- README.md
```

## 🔧 Installation & Setup
### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-username/hospital-api.git
cd hospital-api
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up the `.env` file
Create a `.env` file in the root directory and add the following environment variables:
```sh
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PRODUCTION_URL=https://mi-app.com
LOG_LEVEL=info
```

### 4️⃣ Start the backend server
```sh
npm start
```
By default, the API will run at `http://localhost:3000`

### 5️⃣ Start the frontend (React + Vite)
```sh
cd frontend
npm install
npm run dev
```
By default, the frontend will run at `http://localhost:5173`

## 🛠 API Endpoints
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
Jest is used for testing models, controllers, and middlewares.

## 📸 Screenshots
> (To be added once the frontend is completed)

## 🎯 Future Improvements
- Implement user authentication and authorization
- Improve error handling with a global error handler
- Add role-based access control (RBAC)

## 📝 License
This project is licensed under the MIT License. Feel free to use and modify it.

---
### 🎉 Happy Coding! 🚀