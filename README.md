Here’s your updated original `README.md` with the addition of **Docker MySQL Setup** and **Using Insomnia for Authentication and Authorization** sections, while keeping all your original content intact:

---

# Backend-Admin API

This project provides an API for managing users, posts, groups, and categories. It includes role-based access control where admins have extended privileges, such as deleting any post, while regular users can only delete their own posts.

---

## Table of Contents

- [Installation](#installation)
- [Docker MySQL Setup](#docker-mysql-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authorization](#authorization)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Using Insomnia](#using-insomnia)

---

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/backend-admin.git
    cd backend-admin
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

   Create a `.env` file in the project root and add the necessary environment variables (refer to [Environment Variables](#environment-variables)).

4. **Run the development server:**

    ```bash
    npm start
    ```

---

## Docker MySQL Setup

To set up MySQL for this project, use Docker for quick and isolated database management.

### 1. Run MySQL with Docker

Run the following command to start a MySQL container:

```bash
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=backend_db -e MYSQL_USER=admin -e MYSQL_PASSWORD=admin -p 3306:3306 -d mysql:8.0
```

**Explanation of Flags:**
- `MYSQL_ROOT_PASSWORD`: Password for the root user.
- `MYSQL_DATABASE`: Database name (`backend_db`).
- `MYSQL_USER`: Non-root user (`admin`).
- `MYSQL_PASSWORD`: Password for the non-root user (`admin`).
- `-p 3306:3306`: Maps port 3306 of the container to the host.

### 2. Verify MySQL Container

Check if the container is running:

```bash
docker ps
```

To access the MySQL CLI:

```bash
docker exec -it mysql-container mysql -u admin -p
```

Enter the password (`admin`) when prompted.

### 3. Update Sequelize Configuration

Update the `config/config.json` file to use the Docker MySQL credentials:

```json
{
  "development": {
    "username": "admin",
    "password": "admin",
    "database": "backend_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

---

## Usage

The API runs on `http://localhost:3000` by default. Use tools like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to test it.

**Note:** The API uses role-based access control (RBAC). Admin users have full access, while regular users have restricted access to certain actions.

---

## API Endpoints

### Authentication

- **Login User**  
  Authenticates a user and returns tokens in HTTP-only cookies.
  - **Endpoint:** `POST /api/auth/login`
  - **Request Body:**
    ```json
    {
      "username": "hassan",
      "password": "yourpassword"
    }
    ```
  - **Expected Response:**
    ```json
    {
      "isLoggedIn": true,
      "csrfToken": "<csrfToken>"
    }
    ```

- **Refresh Token**  
  Updates the access and refresh tokens.
  - **Endpoint:** `POST /api/auth/refresh`

- **Logout**  
  Logs out the user and clears tokens.
  - **Endpoint:** `POST /api/auth/logout`

---

### User Endpoints

- **Create User**  
  Creates a new user (admin only).
  - **Endpoint:** `POST /api/admin/users`
  - **Request Body:**
    ```json
    {
      "username": "newuser",
      "password": "password123",
      "role": "user"
    }
    ```

- **List All Users**  
  Lists all users (admin only).
  - **Endpoint:** `GET /api/admin/users`
  
- **Get User by ID**  
  Retrieves user information by ID.
  - **Endpoint:** `GET /api/admin/users/:id`

- **Update User**  
  Updates user information.
  - **Endpoint:** `PUT /api/admin/users/:id`
  - **Request Body:** 
    ```json
    {
      "username": "updatedUsername",
      "password": "newPassword123"
    }
    ```

- **Delete User**  
  Deletes a user by ID (admin only).
  - **Endpoint:** `DELETE /api/admin/users/:id`

---

### Post Endpoints

- **Create Post**  
  Adds a new post to a specified category.
  - **Endpoint:** `POST /api/posts`
  - **Request Body:**
    ```json
    {
      "content": "Post content",
      "category": "General"
    }
    ```

- **List All Posts**  
  Retrieves a list of all posts.
  - **Endpoint:** `GET /api/posts`

- **Delete Post**  
  Deletes a post by ID. Admins can delete any post, while regular users can delete only their own posts.
  - **Endpoint:** `DELETE /api/posts/:postId`

---

## Authorization

This API uses role-based access control:
- **Admin:** Can manage all users, posts, groups, and categories.
- **User:** Can only manage their own posts and view groups and categories.

In routes where admin access is required, middleware is applied to check the user's role before proceeding.

---

## Testing

To test the API, use a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/).

---

## Using Insomnia

Here’s how to authenticate and send requests with the access token using Insomnia:

1. **Login and Retrieve Token**
   - **Request:**
     ```http
     POST /api/auth/login
     ```
   - **Body:**
     ```json
     {
       "username": "hassan",
       "password": "password123"
     }
     ```
   - **Response:**
     The `accessToken` will be set in the `Authorization` header automatically.

2. **Set Authorization Header**
   - Go to your Insomnia request.
   - Under the "Headers" section, add:
     - **Key:** `Authorization`
     - **Value:** `Bearer <your_access_token>`

3. **Test Protected Endpoint**
   - Use the token in a protected endpoint:
     - **Request:** `POST /api/posts`
     - **Body:**
       ```json
       {
         "content": "This is a post",
         "category": "General"
       }
       ```

---

## Folder Structure

```plaintext
Backend-Admin
├── src
│   ├── controllers
│   │   ├── admin_controller.js
│   │   └── auth_controller.js
│   ├── domain
│   │   ├── user_handler.js
│   │   ├── post_handler.js
│   │   ├── auth_handler.js
│   │   └── category_handler.js
│   ├── routes
│   │   ├── auth_routes.js
│   │   ├── admin_routes.js
│   │   └── post_routes.js
│   ├── config.js
│   └── app.js
└── .env
```

---

## Environment Variables

```plaintext
API_DOCS=true                      # Enable Swagger documentation
CORS_ALLOWED_ORIGINS="http://localhost:3000" # Allow CORS for this origin
SECURE=true
HTTP_ONLY=true
SAME_SITE="Strict"
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
DB_HOST=127.0.0.1
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=backend_db
DB_PORT=3306
```
