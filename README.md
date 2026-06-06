# ⚽ Takwira

Takwira is a modern, full-stack monorepo application designed to help players find and book football stadiums while enabling stadium owners to list, manage, and track reservations.



##  Key Features

*   **User Authentication & Authorization**: Distinct workflows and dashboards for **Players** (Normal Users) and **Stadium Owners**.

*   **Stadium Directory**: Detailed stadium listings featuring pricing, capacity/places, contact info, visual imagery, and location maps.

*   **Search & Filters**: Advanced filtering capabilities allowing players to search by city, price range, capacity, and owner details.

*   **Reservation Management**: Efficient workflows for reserving time slots, scheduling matches, and managing booking requests.

*   **Owner Dashboard**: Specialized tools for stadium owners to post new stadiums, update current listings, and monitor bookings.



##  Repository Structure

This project is configured as a monorepo utilizing **pnpm workspaces**:

```
takwira/
├── apps/
│   ├── frontend/         # React, Vite, and TanStack Router UI client
│   └── backend/          # Node.js & Express REST API
├── packages/
│   └── shared/           # Common TypeScript types, validation schemas, and utilities
├── package.json          # Monorepo configuration and workspace scripts
└── pnpm-workspace.yaml   # Workspace setup
```

---

##  Technology Stack

*   **Frontend**: React (v19), Vite, TypeScript, TailwindCSS, TanStack React Router, React Hook Form, Zod.
*   **Backend**: Node.js, Express, TypeScript, Multer (for image upload handling), Zod.
*   **Shared Library**: Shared interfaces, TypeScript types, and validation logic.
*   **Package Manager**: `pnpm` (with workspaces).
*   **DataBase**: PostreSQL.

---

##  Quick Start

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

### 1. Clone the repository and install dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 2. Configure Environment Variables

Create `.env` files in both the frontend and backend applications.

*   **Backend (`apps/backend/.env`)**:
    ```env
    PORT=4000
    JWT_SECRET=your_super_secret_jwt_key
    ```
*   **Frontend (`apps/frontend/.env`)**:
    ```env
    VITE_API_BASE_URL=http://localhost:4000
    ```

### 3. Run the Development Servers

You can run commands from the root of the project:

```bash
# Run backend development server
pnpm dev:backend

# Run frontend development server
pnpm dev:frontend
```

---

##  Available Commands

The following scripts are available at the root level for easy project management:

| Command | Action |
| :--- | :--- |
| `pnpm build` | Compiles the shared package, frontend, and backend apps |
| `pnpm dev:frontend` | Starts the frontend application in development mode |
| `pnpm dev:backend` | Starts the backend Express server in development mode |
| `pnpm build:shared` | Compiles the shared TypeScript package |
| `pnpm lint` | Runs ESLint across the frontend package |
| `pnpm format` | Formats frontend code files using Prettier |
