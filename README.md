# Campus Event Coordination System

Campus Event Coordination System is a prototype React application for browsing, creating, approving, and checking into campus events. It is built around role-based access for students, staff, and administrators, with mocked data and local state persistence to support the full event lifecycle.

## Overview

The app includes:

- A public login and signup flow
- A chronological event feed with filtering and search
- Event detail pages with location, tags, cost, and cultural credit indicators
- Staff event creation with draft and approval workflows
- Administrator review tools for approving or rejecting events
- Map and directions support for event discovery
- Student check-in flows, including fallback event-code verification

## Roles

- Student: browse events, view details, and check in
- Staff: all student capabilities plus event creation and submission
- Administrator: all student capabilities plus approval and moderation tools

## Tech Stack

- React 18 + TypeScript
- React Router 7
- Vite
- Tailwind CSS v4
- Radix UI
- localStorage-backed mock persistence

## Project Structure

- [src/app/App.tsx](src/app/App.tsx) sets up routing and app providers
- [src/app/pages/](src/app/pages/) contains the page-level views
- [src/app/components/](src/app/components/) contains shared UI and feature components
- [src/app/contexts/](src/app/contexts/) contains authentication and application state providers
- [src/app/services/](src/app/services/) contains event, approval, role request, and check-in logic
- [src/app/data/mockData.ts](src/app/data/mockData.ts) contains the seeded demo data

## Getting Started

Install dependencies:

```bash
pnpm install
```

View the website locally:

```bash
npm run dev
```

Build the project:

```bash
pnpm build
```

## Demo Credentials

- Student: student@example.com / student123
- Staff: staff@example.com / staff123
- Administrator: admin@example.com / admin123

## Feature Highlights

- Role-based navigation and route protection
- Filterable public event feed
- Staff event creation with save-as-draft and submit-for-approval actions
- Admin approval dashboard
- Event map view with location pins
- Attendance check-in with validation and fallback code entry
- Persistent user preferences for filters

## Notes

This repository is a prototype and uses mocked data instead of a production backend. The seeded events and credentials are intended for local demo and evaluation workflows.