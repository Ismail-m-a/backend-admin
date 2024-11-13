# Backend-Admin API

This project provides an API for managing users, posts, groups, and categories. It includes role-based access control where admins have extended privileges, such as deleting any post, while regular users can only delete their own posts.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authorization](#authorization)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/Backend-Admin.git
    cd Backend-Admin
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

## Usage

The API runs on `http://localhost:3000` by default. To test the API, use a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/).

**Note:** The API uses role-based access control (RBAC). Admin users have full access, while regular users have restricted access to certain actions.

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
  - **Expected Response:** `{ "isLoggedIn": true, "csrfToken": "<csrfToken>" }`

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

### Group Endpoints

- **Create Group**  
  Creates a new group.
  - **Endpoint:** `POST /api/admin/groups`
  - **Request Body:**
    ```json
    {
      "groupName": "New Group"
    }
    ```

- **List All Groups**  
  Retrieves a list of all groups.
  - **Endpoint:** `GET /api/admin/groups`

- **Delete Group**  
  Deletes a specific group by name.
  - **Endpoint:** `DELETE /api/admin/groups/:name`

### Post Endpoints

- **Create Post**  
  Adds a new post to a specified category.
  - **Endpoint:** `POST /api/posts`
  - **Request Body:**
    ```json
    {
      "authorId": "user-id",
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

- **Report Post**  
  Reports a post for review.
  - **Endpoint:** `POST /api/reports`
  - **Request Body:**
    ```json
    {
      "postId": "post-id",
      "reason": "Inappropriate content"
    }
    ```

### Category Endpoints

- **Create Category**  
  Adds a new category.
  - **Endpoint:** `POST /api/categories`
  - **Request Body:**
    ```json
    {
      "name": "Category Name",
      "description": "Description of the category"
    }
    ```

- **List All Categories**  
  Retrieves all categories.
  - **Endpoint:** `GET /api/categories`

- **Delete Category**  
  Deletes a specific category by name (admin only).
  - **Endpoint:** `DELETE /api/categories/:name`

### Statistics Endpoint

- **Get Forum Statistics**  
  Retrieves forum statistics.
  - **Endpoint:** `GET /api/statistics`

## Authorization

This API uses role-based access control:
- **Admin:** Can manage all users, posts, groups, and categories.
- **User:** Can only manage their own posts and view groups and categories.

In routes where admin access is required, middleware is applied to check the user's role before proceeding.

## Testing

To test the API, use a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/).

### Example Tests

1. **Logging In**  
   - **Endpoint:** `POST /api/auth/login`
   - **Body:** 
     ```json
     {
       "username": "hassan",
       "password": "yourpassword"
     }
     ```
   - **Expected Result:** Tokens are set in cookies, and response returns `{ "isLoggedIn": true, "csrfToken": "<csrfToken>" }`.

2. **Creating a Post**  
   - **Endpoint:** `POST /api/posts`
   - **Body:**
     ```json
     {
       "authorId": "user-id",
       "content": "This is a new post",
       "category": "General"
     }
     ```
   - **Expected Result:** Created post details with status `201`.

3. **Deleting a Post**  
   - **Endpoint:** `DELETE /api/posts/:postId`
   - **Note:** Ensure `authorId` matches the post’s author ID or user has an admin role.
   - **Expected Result:** 
     - Admins can delete any post.
     - Regular users can delete only their own posts.
     - Returns `200` if successful, `403` for unauthorized users.

4. **Creating a Category**  
   - **Endpoint:** `POST /api/categories`
   - **Body:**
     ```json
     {
       "name": "New Category",
       "description": "This is a new category"
     }
     ```
   - **Expected Result:** Returns a success message with `201` status if created.

5. **Creating a Group**  
   - **Endpoint:** `POST /api/admin/groups`
   - **Body:**
     ```json
     {
       "groupName": "Development Team"
     }
     ```
   - **Expected Result:** Returns success message with `201` status if created.

6. **Accessing Admin-Only Endpoints as a User**  
   - Attempt to access an admin-only endpoint as a regular user (e.g., deleting another user’s post).
   - **Expected Result:** `403 Access denied` message.

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

### Key Files

- **`app.js`**: Initializes the Express app, middleware, and routes.
- **`controllers/admin_controller.js`**: Defines functions for user, post, and group management.
- **`routes/admin_routes.js`**: Admin-related routes.
- **`routes/post_routes.js`**: Post-related routes.
- **`domain/user_handler.js`**: Business logic for users, including role management.
- **`domain/post_handler.js`**: Business logic for posts, including ownership checks.

## Environment Variables

The application requires certain environment variables. Add these variables to your `.env` file:

```plaintext
API_DOCS=true                      # Enable Swagger documentation
CORS_ALLOWED_ORIGINS="http://localhost:3000" # Allow CORS for this origin
SECURE=true
HTTP_ONLY=true
SAME_SITE="Strict"
```
