# Baghdad Application

This repository contains the source code for the Baghdad application, a web-based office suite with accounting features.

## Project Structure

The project is a modern web application with a separate frontend and backend.

-   `/Baghdad.Server`: The backend API, built with C# and ASP.NET Core.
-   `/Baghdad.Client`: The frontend user interface, built with React and Vite.

## Getting Started

### Backend

To run the backend server, navigate to the `Baghdad.Server` directory and run:

```bash
dotnet run
```

The API will be available at `http://localhost:5117`.

### Frontend

To run the frontend development server, navigate to the `Baghdad.Client` directory, install dependencies, and then start the server:

```bash
npm install
npm run dev
```

The user interface will be available at `http://localhost:5173` (or the next available port).
