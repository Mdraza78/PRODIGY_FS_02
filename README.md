# PRODIGY_FS_02 - Employee Management System  
**Task 02** of the Full Stack Web Development Internship at Prodigy Infotech  

## 📋 Task Overview  
Develop a secure Employee Management System with CRUD operations using the MERN stack (MongoDB, Express.js, React, Node.js).  

### ✅ **Key Requirements**  
- **Admin Authentication**: Secure login for administrators  
- **Employee CRUD Operations**: Create, Read, Update, and Delete employee records  
- **Protected Routes**: Restrict access to authorized users only  
- **Data Validation**: Server-side validation for employee data  
- **Responsive UI**: Clean, professional dashboard  

## 🚀 **Features Implemented**  
| Feature               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| 👨‍💼 **Admin Dashboard**  | Secure dashboard with employee management controls                           |
| ➕ **Add Employees**   | Form with validation for adding new employees                               |
| 👁️ **View/Edit**       | Paginated table to browse and modify employee records                       |
| 🗑️ **Delete Employees** | Secure deletion with confirmation dialog                                    |
| 🔐 **JWT Authentication** | Protected routes using JSON Web Tokens                                    |
| 🔄 **Real-time Updates** | Auto-refresh after CRUD operations                                        |
| 📱 **Responsive Design** | Optimized for desktop and mobile devices                                  |

## 🛠️ **Tech Stack**  
**Frontend**:  
- React (Vite)  
- React Router  
- Axios for API calls

 **Backend**:  
- Node.js & Express.js  
- MongoDB (Mongoose ODM)  
- Bcrypt for password hashing  
- JWT for authentication  

## 📁 Folder Structure

<img width="228" alt="{A76B167C-B8C2-4B05-97E5-EE1F0EC5F331}" src="https://github.com/user-attachments/assets/64d82b02-2d0f-40a3-9ffc-cdc51756763d" />

## 🚀 **Getting Started**  

### 1. Clone the Repository  
```markdown
git clone https://github.com/Mdraza78/PRODIGY_FS_02.git
cd PRODIGY_FS_02
```
### 2. Backend Setup
```markdown
cd backend
npm install
npm start
```


### 3. Frontend Setup
```markdown
- cd frontend
- npm install
- npm run dev
```

### 4. Create an `.env` file in the `backend/` directory with the following variables:
```markdown
- MONGO_URI=mongodb://127.0.0.1:27017/employee
- JWT_SECRET=your_jwt_secret_key
```

## 🔒 Security Highlights
- Password hashing with bcryptjs

- API protection using JWT middleware

- Form validation on client and server for Adding new Employee

## 📄 License
This project is developed as part of Prodigy Infotech Internship and is intended for educational use.


