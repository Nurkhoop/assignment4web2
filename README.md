# Final project (Messanger)
**Student: Nurkhan Kuanyshov**

**Group: SE-2431**

**Live Links:**
- Backend: `TBD`
- Frontend: `TBD`


## 1. Project Overview

This project is a secure backend REST API + full-stack messenger system.
It extends Assignment 3 by introducing authentication, role-based access control (RBAC),
and a professional MVC project architecture.

The project demonstrates:

- MVC architecture (Models, Controllers, Routes, Middleware)
- User authentication with JWT
- Password hashing using bcrypt
- Role-Based Access Control (admin / user)
- Full CRUD operations for Chats and Messages
- Real-time notifications (Socket.IO)
- Message search inside a chat
- Feedback form stored in MongoDB
- Admin panel to manage users and chats
- MongoDB Atlas integration

All data is stored in MongoDB Atlas.

---

## 2. Technologies Used

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS
- Socket.IO

**Frontend**
- React + TypeScript (Vite)
- Redux Toolkit
- Axios
- Responsive CSS

**Tools**
- Postman

---

## 3. Features

### 3.1 Authentication & RBAC

Each user contains the following fields:

| Field | Description |
|-----|------------|
| email | User email |
| password | Hashed password |
| role | user or admin |
| displayName | Optional user name |
| status | online/offline |
| isBlocked | blocked flag |
| preferences | theme/notifications |
| createdAt | Timestamp |

Security features:
- Passwords are hashed using bcrypt
- JWT tokens are generated on login
- Admin-only access for sensitive routes

---

### 3.2 Chats Management (CRUD)

| Field | Description |
|-----|------------|
| title | Chat title |
| participants | Array of User references |
| createdBy | Creator |
| createdAt | Timestamp |

---

### 3.3 Messages Management (CRUD)

| Field | Description |
|-----|------------|
| chat | Reference to Chat |
| sender | Reference to User |
| text | Message content |
| edited | Edited flag |
| isRead | Read flag |
| createdAt | Timestamp |

Relationships are implemented using ObjectId references and populated using `.populate()`.

---

### 3.4 Feedback System

| Field | Description |
|-----|------------|
| name | Sender name (optional) |
| email | Sender email |
| message | Feedback message |
| user | Linked user (optional) |

---

## 4. API Endpoints (Updated)

### 4.1 Authentication API

```http
POST /api/auth/register
POST /api/auth/login
```

---

### 4.2 Chats API

```http
GET    /api/chats                    (auth)
GET    /api/chats/:id                (auth)
GET    /api/chats/admin/all          (admin)
POST   /api/chats                    (auth)
PUT    /api/chats/:id                (auth/creator/admin)
DELETE /api/chats/:id                (auth/creator/admin)
```

---

### 4.3 Messages API

```http
GET    /api/messages/chat/:chatId            (auth)
GET    /api/messages/chat/:chatId/search     (auth)
PUT    /api/messages/chat/:chatId/read       (auth)
POST   /api/messages/chat/:chatId            (auth)
PUT    /api/messages/:id                     (auth/sender/admin)
DELETE /api/messages/:id                     (auth/sender/admin)
```

---

### 4.4 Users API

```http
GET    /api/users                    (auth)
PUT    /api/users/me/settings        (auth)
PUT    /api/users/me/profile         (auth)
PUT    /api/users/me/password        (auth)
PUT    /api/users/:id/role           (admin)
PUT    /api/users/:id/block          (admin)
PUT    /api/users/:id/restore        (admin)
DELETE /api/users/:id                (admin)
```

---

### 4.5 Feedback API

```http
POST /api/feedback              (public)
GET  /api/feedback              (admin)
```

---

## 5. Project Structure

```text
finalprojectweb2/
├─ backend/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  └─ routes/
├─ messenger-frontend/
│  ├─ src/
│  └─ index.html
├─ server.js
├─ package.json
└─ README.md
```

---

## 6. Environment Variables

**Backend `.env`**
```
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

**Frontend `.env`** (create from `.env.example`)
```
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

---

## 7. Run Locally (Detailed)

### 7.1 Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Postman (optional for testing)

### 7.2 Backend Setup
1. Go to project root:
```
cd finalprojectweb2
```
2. Install dependencies:
```
npm install
```
3. Create `.env` in root and add:
```
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```
4. Start server:
```
npm start
```
Server runs at:
```
http://localhost:5001
```

### 7.3 Frontend Setup
1. Go to frontend folder:
```
cd finalprojectweb2/messenger-frontend
```
2. Install dependencies:
```
npm install
```
3. Create `.env`:
```
cp .env.example .env
```
4. Start frontend:
```
npm run start
```
Frontend runs at:
```
http://localhost:3000
```

---

## 8. Postman Collection

Postman collection is included in the root:

```
postman_collection.json
```

**Import in Postman:**
1. Open Postman
2. Click `Import`
3. Select `postman_collection.json`
4. Set variables: `baseUrl`, `token`, `chatId`, `userId` as needed

---

## 9. Deployment

Deploy backend to Render (or similar) and frontend to Vercel/Netlify.  
After deployment, add links at the top of this README.

| Case | Response |
|----|---------|
| Missing token | 401 Unauthorized |
| Invalid token | 401 Unauthorized |
| Access denied | 403 Forbidden |
| Resource not found | 404 Not Found |

---

## 8. Postman Testing

All endpoints were tested using Postman.

- Public routes accessible without authentication
- Admin-only routes return 403 for regular users
- JWT tokens used in Authorization header

---

## 9. Conclusion

Through this assignment, I learned and applied the following skills:

- Designing scalable MVC backend architecture
- Implementing JWT authentication
- Applying role-based access control
- Securing API endpoints
- Working with MongoDB relationships
- Testing APIs professionally using Postman
- Debugging authentication and server issues

This project fully satisfies all Assignment 4 requirements.
