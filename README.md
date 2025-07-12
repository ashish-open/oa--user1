# Alert Ticket Vision

## Overview

Alert Ticket Vision is a modern, full-featured dashboard and management platform for risk, compliance, support, and sales operations. It provides a unified interface for:
- Monitoring user risk and compliance (KYC)
- Managing support tickets and system alerts
- Analyzing transactions and service usage
- Overseeing sales pipelines and customer analytics

The platform is designed for teams handling risk, compliance, support, and sales in fintech or SaaS environments, enabling data-driven decisions and streamlined workflows.

## Key Features

- **Centralized User Management:**
  - Search, analyze, and manage users across risk, KYC, and sales operations.
  - View detailed user profiles, risk factors, KYC status, and service usage.

- **Risk Dashboard:**
  - Visualize key risk metrics, high-risk users, and service-specific risk trends.
  - Drill down into risk distribution and high-risk user lists.

- **KYC Dashboard:**
  - Track onboarding analytics, verification status, and partner distributions.
  - Analyze KYC performance and compliance metrics over time.

- **Support Tickets:**
  - Integrate with Freshdesk to view, filter, and manage customer support tickets.
  - Update ticket status, add notes, and group tickets by status, priority, or tags.

- **System Alerts:**
  - View and filter system-generated alerts by type and status.
  - Quickly identify unread or critical alerts for follow-up.

- **Transactions Analytics:**
  - Analyze transactions by service (payin, payout, API) and status.
  - Filter, search, and view detailed transaction tables and stats.

- **Sales & Customer Analytics:**
  - Monitor sales pipelines, opportunities, and campaign performance.
  - Segment customers, track revenue, and analyze engagement and retention.

- **Role-Based Access Control:**
  - Fine-grained permissions for risk, KYC, support, and sales teams.
  - Secure access to dashboards and management tools based on user roles.

## Usage

- Start the development server: `npm run dev`
- Access the app in your browser (default: http://localhost:5173)
- Log in with demo credentials (see `src/context/AuthContext.tsx` for available roles)
- Navigate between dashboards using the sidebar

---

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
