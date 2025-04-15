# Hospital API

## 📌 Project Overview

This is a RESTful API built with **Node.js**, **Express**, and **MySQL**, designed to manage a hospital's doctors and users. The API provides endpoints to **create, update, delete, activate, and deactivate doctors**, as well as retrieve both **active and inactive doctor listings**. 

It also includes full **user authentication and authorization** using **JWT**, and supports **user profile management** and **password updates**.

The project follows a **modular and scalable architecture**, with **Zod** used for request validation, **Jest** for unit testing, and **Swagger** for automatic API documentation.

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (via `mysql2` driver)
- **Query Handling:** Raw SQL queries (no ORM)
- **Validation:** Zod (schema-based request validation)
- **Authentication:** JSON Web Tokens (JWT)
- **Authorization:** Role-based access control (RBAC)
- **Logging:** Winston (custom logger configuration)
- **Testing:** Jest (unit and integration tests)
- **Caching:** Custom middleware with in-memory caching
- **Documentation:** Swagger (OpenAPI 3.0)
- **Frontend:** React + Vite *(included in the same repository, developed separately)*

## 📂 Folder Structure

/project-root
├── backend/
│   ├── __mocks__/           # Mocked modules for unit testing
│   ├── __tests__/           # Jest test cases
│   ├── config/              # Configuration files (DB, logger, etc.)
│   ├── controllers/         # Route handler logic
│   ├── database/            # SQL setup and database connection
│   ├── docs/                # Swagger (OpenAPI) documentation
│   ├── middlewares/         # Custom middleware (auth, cache, etc.)
│   ├── models/              # Database query logic
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions (e.g., logger)
│   ├── validators/          # Zod validation schemas
│   └── app.js               # Backend entry point

├── frontend/ (React + Vite)
│   ├── src/                 # Components, context, pages, styles
│   ├── public/              # Static assets (e.g., favicon)
│   ├── index.html           # Main HTML file
│   └── vite.config.js       # Vite configuration

├── .env.example             # Sample environment variables
├── babel.config.js          # Babel config for Jest
├── jest.config.js           # Jest configuration
├── LICENSE                  # Project license
└── README.md                # Project documentation

---

## ✨ Features

- RESTful API for managing hospital doctors and users
- Soft delete and status toggling for doctors (`is_active` flag)
- User authentication with JWT
- Password update with verification
- Admin-only user deletion
- Schema validation using Zod
- Swagger API documentation
- Unit tests with Jest
- Custom middleware for logging and caching
- Fully decoupled frontend (React + Vite)

---

## 🧠 Design Decisions

- **Zod** was chosen for request validation due to its minimal syntax and excellent developer experience.
- **mysql2** allows for using raw SQL queries while supporting modern, promise-based interfaces.
- **Jest** offers a fast and flexible testing framework with powerful mocking and assertion capabilities.
- **Swagger** provides interactive API documentation and makes testing routes more accessible.
- **Winston** was implemented to support scalable and customizable logging, including different log levels and formats.
- **Custom SQL Queries** were preferred over an ORM to maintain full control over query structure and performance.

---

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
Before running the project, you need to create and initialize the database.

#### ➤ **Option 1: Using MySQL Workbench**
1. Open **MySQL Workbench** and connect to your MySQL server.
2. In the **Navigator panel**, go to the **Schemas** tab.
3. Click **Create Schema**, enter `hospital_db` as the database name, and apply the changes.
4. To import the table structure:
   - Go to **File > Run SQL Script**.
   - Select the file named **`query.sql`** from the project root.
   - Execute the script to create the required tables.

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
3. Select the database:
```sh
USE hospital_db;
```
4. Import the structure from the SQL script:
```sh
mysql -u root -p hospital_db < query.sql
```
💡 If you use a different database name, make sure to update it in the .env file.

---

### 4️⃣ Set up the `.env` file
Create a `.env` file in the root directory and add the following environment variables:
```sh
NODE_ENV=development
FRONTEND_URL=url_vite
PRODUCTION_URL=https://mi-app.com
PORT=port_nodejs
LOG_LEVEL=info

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

DB_HOST=localhost
DB_PORT=port_mysql
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_db
```

---

### 5️⃣ Start the backend server
```sh
npm start
```
The backend API will run at:
📍 http://localhost:3000

---

### 6️⃣ Start the frontend (React + Vite)
```sh
cd client
npm install
npm run dev
```
The frontend app will run at:
📍 http://localhost:5173

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

## 🐝 API Endpoints
All routes follow RESTful conventions.

---

### 🔹 Doctors Routes

| Method | Endpoint                         | Description                              |
|--------|----------------------------------|------------------------------------------|
| GET    | `/doctors`                       | Get a paginated list of **active** doctors |
| GET    | `/doctors/all`                   | Get a paginated list of **all** doctors (active + inactive) |
| GET    | `/doctors/:id`                   | Get a doctor by ID                       |
| POST   | `/doctors`                       | Create a new doctor (**requires validation**) |
| PUT    | `/doctors/:id`                   | Update doctor details by ID              |
| DELETE | `/doctors/:id`                   | Soft delete a doctor (set `is_active = false`) |
| PATCH  | `/doctors/:id/deactivate`        | Deactivate a doctor                      |
| PATCH  | `/doctors/:id/activate`          | Reactivate a doctor                      |

---

### 🔸 Users Routes

| Method | Endpoint                         | Description                              |
|--------|----------------------------------|------------------------------------------|
| POST   | `/register`                      | Register a new user                      |
| POST   | `/login`                         | Authenticate user and return JWT token   |
| POST   | `/logout`                        | Logout user                              |
| GET    | `/me`                            | Get currently authenticated user's data *(requires token)* |
| GET    | `/users`                         | Get all users *(admin only)*             |
| PATCH  | `/users/:id`                     | Update user’s profile (username or email) *(requires token)* |
| PATCH  | `/users/:id/activate`            | Activates or deactivates a user by ID. Only accessible by admin users |
| PATCH  | `/users/:id/password`            | Update password *(requires token)*       |
| DELETE | `/users/:id`                     | Permanently delete a user *(admin only)* |

---

### 📘 Full API Documentation

For detailed schemas, parameters, and example responses, visit the **Swagger UI**:  
📍 [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs)

## ✅ Testing
To run unit and integration tests:
```sh
npm test
```
The project uses Jest to test the models, controllers, routes, and middlewares of the backend.
Test coverage is currently focused on the doctors module, and will be expanded over time.

## 📷 Screenshots
Screenshots of the frontend UI will be added here once the interface is completed.
Stay tuned!

---

## 📊 Deployment

This project is ready for deployment on platforms such as [Render](https://render.com/), [Railway](https://railway.app/), or [Vercel](https://vercel.com/) for the frontend.

### Backend Deployment Tips:
- Ensure all environment variables are correctly set in your deployment platform.
- Use a managed MySQL database or connect to a remote MySQL server.
- Optional: Use `PM2` or a `Procfile` for process management in production environments.

### Frontend Deployment Tips:
- Run `npm run build` inside the `frontend/` directory to generate the production build.
- Upload the `dist/` folder to your preferred static hosting service (e.g., Vercel, Netlify, Firebase Hosting).

---

## 🎯 Future Improvements
- ✅ Implement user authentication and JWT authorization (completed)
- ✅ Implement user authentication and JWT authorization (completed)
- 🚧 Improve global error handling with a custom error handler
- 🧪 Complete tests for new user-related endpoints
- 🌐 Add deployment configuration for production environments
- ✉️ Add email notifications for user registration and password recovery

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open a pull request or submit an issue to improve this project.

---

## 👨‍💻 Author

**Cristian Gonzalez**  
GitHub: [CristianGonzalez24](https://github.com/CristianGonzalez24)

---

## 📝 License

This project is licensed under the **MIT License**. Feel free to use, modify, and share it.
See the [LICENSE](./LICENSE) file for details.

---

### 🎉 Happy Coding! 🚀

🙌 Thanks for checking out this project! Any feedback, suggestions, or contributions are always welcome.
