\# 📚 Library Management System



A full-stack web-based Library Management System designed to manage books, issue and return records, and administrator access efficiently.



\## 🚀 Features



\* 🔐 Admin Login

\* 📚 Add, View, Update and Delete Books

\* 📖 Issue Books

\* 🔄 Return Books

\* 📋 View Issue and Return Records

\* 📊 Dashboard with Library Statistics

\* 🔎 Search Books

\* 🗄️ MongoDB Database Integration

\* 🔒 Password Hashing using bcrypt

\* 📱 Responsive User Interface



\## 🛠️ Technologies Used



\### Frontend



\* React.js

\* Vite

\* HTML

\* CSS

\* JavaScript



\### Backend



\* Node.js

\* Express.js

\* MongoDB

\* Mongoose

\* REST API

\* bcryptjs

\* dotenv

\* CORS



\## 📁 Project Structure



```text

Library-Management-System/

│

├── backend/

│   ├── models/

│   ├── routes/

│   ├── .env

│   ├── createAdmin.js

│   ├── server.js

│   └── package.json

│

├── frontend/

│   ├── src/

│   ├── public/

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

└── README.md

```



\## ⚙️ Installation and Setup



\### 1. Clone the Repository



```bash

git clone https://github.com/subhankarmanna01/Library-Management-System.git

cd Library-Management-System

```



\### 2. Backend Setup



```bash

cd backend

npm install

```



Create a `.env` file inside the `backend` folder:



```env

PORT=5000

MONGO\_URI=your\_mongodb\_connection\_string

```



Start the backend:



```bash

npm run dev

```



The backend will run on:



```text

http://localhost:5000

```



\### 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



The frontend will run on the Vite development server, usually:



```text

http://localhost:5173

```



\## 🔐 Admin Login



Default development credentials:



```text

Username: admin

Password: admin123

```



> For production use, change the default password and use proper authentication and authorization.



\## 🔗 API Endpoints



\### Authentication



```text

POST /api/auth/login

```



\### Books



```text

GET    /api/books

POST   /api/books

PUT    /api/books/:id

DELETE /api/books/:id

```



\### Issues



```text

GET    /api/issues

POST   /api/issues

PUT    /api/issues/return/:id

DELETE /api/issues/:id

```



\## 📊 Dashboard



The dashboard provides an overview of:



\* Total Books

\* Total Quantity

\* Available Books

\* Issued Books

\* Returned Books



\## 📖 Book Issue and Return Flow



1\. Admin logs into the system.

2\. Admin adds books to the library.

3\. Available books can be issued to students.

4\. When a book is issued, its available quantity decreases automatically.

5\. When the book is returned, its available quantity increases automatically.

6\. Issue records can be viewed and managed from the Issue / Return section.



\## 🔒 Security



\* Passwords are hashed using `bcryptjs`.

\* MongoDB connection details are stored in `.env`.

\* Sensitive `.env` files are excluded from Git using `.gitignore`.



\## 🎯 Project Objective



The objective of this project is to provide a simple and efficient digital solution for managing library books, student book issues, returns, and administrator operations.



\## 🔮 Future Improvements



\* Student registration and login

\* JWT authentication

\* Role-based access control

\* Fine calculation for late returns

\* Book cover image upload

\* Advanced search and filtering

\* Pagination

\* Email notifications

\* Deployment to cloud platforms



\## 📌 Project Type



\*\*Full-Stack Web Application\*\*



\## 📄 License



This project is created for educational and academic purposes.



