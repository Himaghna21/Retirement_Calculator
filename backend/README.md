# HDFC Retirement Calculator - Backend

The backend of the HDFC Retirement Planning Calculator provides robust API services, database connectivity, and CMS integration logic using **Node.js**.

## ⚙️ Backend Features

- **Node.js 22.11.0**: Stable and efficient runtime environment.
- **API Services**: Dedicated endpoints for retirement calculations and content retrieval.
- **Database Integration**: Secure connectivity to MySQL for data persistence.
- **CMS Proxy**: Seamless integration with Drupal 10 for dynamic content and compliance management.
- **Scientific Logic**: Backend validation of financial parameters and calculation accuracy.

## 🏗️ Core Components

- **`lib/`**: Shared libraries and database connection utilities.
- **`app/api/`**: API route definitions (Next.js backend architecture).
- **`scripts/`**: Maintenance and database migration scripts.
- **`__tests__`**: Unit and integration tests for calculation logic.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Configure your MySQL and Drupal API credentials in the `.env` file.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Run Tests**:
    ```bash
    npm test
    ```

---
© 2026 HDFC. All rights reserved.
