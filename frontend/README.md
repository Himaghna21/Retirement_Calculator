# HDFC Retirement Calculator - Frontend

The frontend of the HDFC Retirement Planning Calculator is a high-performance, accessible, and brand-compliant web application built with **Next.js 15**.

## ✨ Frontend Highlights

- **Next.js 15.5.9**: Leveraging the latest app router and server-side rendering for optimal performance.
- **Brand Compliance**:
  - **Colors**: Blue (#224c87), Red (#da3832), Grey (#919090).
  - **Typography**: Montserrat, Arial, Verdana.
- **WCAG 2.1 AA Compliance**:
  - Semantic HTML5 structure.
  - Comprehensive ARIA labels and roles.
  - Keyboard-accessible interactive elements.
  - Screen reader optimized navigation.
- **Responsive Layout**: Fluid design for Desktop, Tablet, and Mobile.
- **Interactive Results**: Dynamic updates as users adjust financial parameters.

## 🏗️ Architecture

- **`app/`**: Next.js App Router for page structure and global styles.
- **`components/`**: Reusable UI components (Calculator, Results, Layout, Compliance).
- **`styles/`**: Centralized CSS variables and global styling rules.
- **`hooks/`**: Custom React hooks for calculation logic and state management.
- **`utils/`**: Helper functions for API communication and formatting.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Copy `.env.example` to `.env.local` and configure your API endpoints.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

---
© 2026 HDFC. All rights reserved.
