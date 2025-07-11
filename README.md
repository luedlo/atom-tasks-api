-----

# 🚀 Atom Tasks Backend

This project is the backend for a task management application, built with Node.js, Express.js, and TypeScript, using Firestore as the database and JSON Web Tokens (JWT) for authentication.

## ✨ Core Features

  * **Task Management (CRUD):**
      * Create new tasks.
      * Retrieve all tasks (with filtering options by completion status).
      * Retrieve a specific task by ID.
      * Update existing tasks.
      * Delete tasks.
  * **JWT Authentication:**
      * User registration.
      * User login and JWT generation.
      * Protected routes that require a valid JWT for access.
  * **Firestore Database:** Persistent storage for users and tasks.
  * **TypeScript:** Strongly-typed code for enhanced robustness and maintainability.

-----

## 🛠️ Technologies Used

  * **Node.js:** JavaScript runtime environment.
  * **Express.js:** Web framework for Node.js.
  * **TypeScript:** Programming language.
  * **Firebase SDK:** For interacting with Firestore.
  * **Firestore:** Google Firebase's NoSQL database.
  * **JSON Web Tokens (JWT):** For authentication.
  * **CORS:** To manage cross-origin security policies.
  * **ts-node:** For TypeScript execution in development.
  * **dotenv:** For environment variable management.

-----

## ⚙️ Project Setup

### Prerequisites

Make sure you have the following installed:

  * **Node.js** (v18 or newer recommended)
  * **npm** (or Yarn)
  * **A Firebase account with a project configured and Firestore enabled.**

### Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/luedlo/atom-tasks-api
    cd atom-tasks/backend/atom-tasks
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or if you use yarn
    yarn install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root of the `atom-tasks` directory (next to `package.json`) and add your Firebase credentials and JWT key.

    ```dotenv
    # Application
    API_NAME="atom-tasks-api"
    PORT=3000
    FRONT_URL='http://localhost:4200'

    # Firebase Configuration (get from your Firebase project settings)
    FIREBASE_API_KEY="your_api_key"
    FIREBASE_AUTH_DOMAIN="your_auth_domain"
    FIREBASE_PROJECT_ID="your_project_id"
    FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    FIREBASE_APP_ID="your_app_id"

    # JWT Secret (generate a strong, secure key)
    JWT_SECRET="A_SUPER_STRONG_AND_LONG_SECRET_KEY_HERE"
    JWT_EXPIRES_IN="1h" # Or your desired time, e.g., "7d"
    ```

4.  **Configure Firebase in `src/config/firebase.ts`:**
    Ensure `src/config/firebase.ts` is using the environment variables loaded by `dotenv`.

    ```typescript
    // src/config/firebase.ts
    import { initializeApp, FirebaseApp } from "firebase/app";
    import { getFirestore, Firestore } from "firebase/firestore";
    import dotenv from 'dotenv';

    dotenv.config(); // Ensure environment variables are loaded

    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };

    const app: FirebaseApp = initializeApp(firebaseConfig);
    const db: Firestore = getFirestore(app);

    export { db };
    ```

5.  **Adjust CORS in `src/index.ts` (Optional but recommended):**
    Modify the CORS configuration in `src/index.ts` to allow the origin of your frontend application.

    ```typescript
    // src/index.ts (Fragment)
    private initializeMiddleware(): void {
        this.app.use(cors({
            origin: 'http://localhost:4200', // <-- CHANGE THIS to your frontend's URL!
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }));
        // ...
    }
    ```

-----

## ▶️ Running the Project

### Execution Modes

This project offers scripts defined in `package.json` for different scenarios:

  * **`npm run dev`**: Starts the server in **development mode**. It uses `ts-node-dev` to automatically recompile and restart the server whenever it detects changes in `.ts` files. Ideal for rapid development.
  * **`npm run build`**: **Compiles** the TypeScript code to JavaScript. The compiled files will be saved in the `dist/` directory. This step is necessary before deploying to production.
  * **`npm start`**: Starts the server in **production mode**. It executes the compiled JavaScript code located in `dist/`.

### `package.json` Commands Explained

Here are the commands available in the `scripts` section of your `package.json`:

```json
// package.json
{
  "name": "atom-tasks",
  "version": "1.0.0",
  "description": "Backend for task management with Node.js, Express, TypeScript, and Firestore.",
  "main": "dist/index.js", // Main entry point after compilation
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  // ... other configurations and dependencies
}
```

  * **`npm run dev`**:

      * **Command:** `ts-node-dev --respawn --transpile-only src/index.ts`
      * **Purpose:** This script is your primary tool during development.
          * `ts-node-dev`: A utility that combines `ts-node` (executes TypeScript directly without prior compilation) with `nodemon` (watches for changes and restarts the server).
          * `--respawn`: Ensures the server restarts if it crashes.
          * `--transpile-only`: Performs only transpilation without type checking (making it faster), useful for rapid development cycles. Type errors will be caught during `build`.
          * `src/index.ts`: The main entry file for your application.
      * **Usage:** `npm run dev`

  * **`npm run build`**:

      * **Command:** `tsc`
      * **Purpose:** This script compiles all your TypeScript code (`.ts`) into plain JavaScript (`.js`). The resulting files are placed in the `dist/` directory (defined in `tsconfig.json`). It's essential to run this command before putting your application into production.
      * **Usage:** `npm run build`

  * **`npm start`**:

      * **Command:** `node dist/index.js`
      * **Purpose:** This script executes the compiled (JavaScript) version of your application. It's the command you should use when deploying your application to a production environment, as JavaScript code is more efficient to run. It requires you to have run `npm run build` beforehand.
      * **Usage:** `npm start`

-----

## 🚀 API Endpoints

### Authentication (`/api/auth`)

  * **POST `/api/auth/register`**
      * **Description:** Registers a new user.
      * **Body:** `{ "email": "string", "password": "string" }`
      * **Response:** `{ "message": "User registered successfully.", "token": "string", "userId": "string" }`
  * **POST `/api/auth/login`**
      * **Description:** Logs in an existing user.
      * **Body:** `{ "email": "string", "password": "string" }`
      * **Response:** `{ "message": "Logged in successfully.", "token": "string", "userId": "string" }`

### Tasks (`/api/tasks`) - 🔒 Protected Routes\!

All task routes require an **`Authorization: Bearer <JWT_TOKEN>` Header**.

  * **POST `/api/tasks`**
      * **Description:** Creates a new task for the authenticated user.
      * **Body:** `{ "title": "string", "description"?: "string", "completed": "boolean", "dueDate"?: "string" }`
      * **Response:** `{ "id": "string", "message": "Task created successfully." }`
  * **GET `/api/tasks`**
      * **Description:** Retrieves all tasks for the authenticated user.
      * **Query Params:** `?completed=true|false` (Optional, filters by completion status)
      * **Response:** `Array<Task>`
  * **GET `/api/tasks/:id`**
      * **Description:** Retrieves a specific task for the authenticated user by ID.
      * **Response:** `Task`
  * **PUT `/api/tasks/:id`**
      * **Description:** Updates fields of an existing task for the authenticated user.
      * **Body:** `Partial<Task>` (e.g., `{ "title": "New Title", "completed": true }`)
      * **Response:** `{ "message": "Task updated successfully." }`
  * **DELETE `/api/tasks/:id`**
      * **Description:** Deletes a task for the authenticated user by ID.
      * **Response:** `{ "message": "Task deleted successfully." }`

-----

## 🤝 Contribution

Contributions are welcome\! If you find a bug or have an improvement, please open an issue or submit a pull request.

-----

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

-----