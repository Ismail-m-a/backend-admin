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

### User Endpoints
- **Login User:** `POST /api//auth/login`
- **Create User:** `POST /api/admin/users`
- **List All Users:** `GET /api/admin/users`
- **Get User by ID:** `GET /api/admin/users/:id`
- **Update User:** `PUT /api/admin/users/:id`
- **Delete User:** `DELETE /api/admin/users/:id` (Admin only)

### Group Endpoints

- **Create Group:** `POST /api/admin/groups`
- **List All Groups:** `GET /api/admin/groups`
- **Delete Group:** `DELETE /api/admin/groups/:name`

### Post Endpoints

- **Create Post:** `POST /api/posts`
- **List All Posts:** `GET /api/posts`
- **Delete Post:** `DELETE /api/posts/:postId` (Admins can delete any post, while users can delete only their own posts)
- **Report Post:** `POST /api/reports`

### Category Endpoints

- **Create Category:** `POST /api/categories`
- **List All Categories:** `GET /api/categories`
- **Delete Category:** `DELETE /api/categories/:name` (Admin only)

### Statistics Endpoint

- **Get Forum Statistics:** `GET /api/statistics`

## Authorization

The project has an RBAC system:
- **Admin:** Can manage all users, posts, groups, and categories.
- **User:** Can only manage their own posts and view groups and categories.

In routes where admin access is required, middleware is applied to check the user's role before proceeding.

## Testing

To test the API, use a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/).

### Example Tests

1. **Creating a Post**
   - **Endpoint:** `POST /api/posts`
   - **Body:**
     ```json
     {
       "authorId": "user-id",
       "content": "Post content",
       "category": "Category name"
     }
     ```
   - **Expected Result:** Returns the created post with `201` status.

2. **Deleting a Post**
   - **Endpoint:** `DELETE /api/posts/:postId`
   - **Note:** Ensure that the `userId` matches the post’s author or is an admin to delete the post.
   - **Expected Result:** Admins can delete any post; regular users can delete only their posts.

3. **Creating a Category**
   - **Endpoint:** `POST /api/categories`
   - **Body:**
     ```json
     {
       "name": "Category Name",
       "description": "Description of the category"
     }
     ```
   - **Expected Result:** Returns a success message with `201` status if created successfully.

4. **Creating a Group**
   - **Endpoint:** `POST /api/admin/groups`
   - **Body:**
     ```json
     {
       "groupName": "New Group"
     }
     ```
   - **Expected Result:** Returns a success message with `201` status if created successfully.

5. **Checking Unauthorized Access**
   - Attempt to access an endpoint that requires admin privileges as a regular user.
   - **Expected Result:** `403 Access denied` message.

## Folder Structure


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
