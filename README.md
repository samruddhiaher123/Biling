# HUNGER Restaurant Dashboard Prototype

This folder was empty when implementation began. This is a standalone React/Vite UI prototype for the restaurant operations dashboard described in the HUNGER project brief. It does not replace or modify the separate Super Admin UI.

## Run locally

Requires Node.js and npm. The project architecture presentation specifies Node 22.18 and npm 11.5.2; this prototype pins a compatible React/Vite baseline because no existing `package.json` or lockfile was available.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Other commands:

```sh
npm run build
npm run lint
npm run preview
```

Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` only when a backend contract is available. No API calls are currently made.

## Routes

- `/dashboard` — overview, sample sales trend, orders, table status, popular items and payment activity
- `/orders` — search/filter orders, inspect item totals and change demo statuses
- `/kitchen` — kitchen board and demo status transitions
- `/tables` — sample floor status and session overview
- `/menu` — search/filter, view, add, edit, availability toggle and delete demo menu items
- `/billing` — sample active sessions and illustrative bills; payment submission and session closing are intentionally unavailable
- `/reports` — sample summaries, filters and CSV download
- `/settings` — browser-only restaurant details and demo-data reset

All sample records and figures are illustrative and browser-local. They are not production data. Do not use the payment screen to accept or record real payments. QR/session tokens, payment status, bill totals, taxes, authorization and session settlement must be enforced by the backend.

The prototype proposes the order flow `New → Accepted → Preparing → Ready → Served`, with `Cancelled` available before completion. This is not an existing backend contract and must be confirmed by the HUNGER backend team before integration.

## Backend contracts needed before integration

No Spring Boot source, API documentation, authentication implementation or backend DTOs were present in the workspace. Therefore there are **no endpoints used**. Confirm the actual contract before implementing the API service. The backend team will need to provide:

- Restaurant-scoped overview/report data and order listing/detail, status transition rules, and live-update strategy.
- Kitchen order queue and permitted status transitions.
- Table CRUD (if permitted), QR payload retrieval, active-session lookup, eligible session orders and session-close rules. Session tokens must be created and validated by the backend.
- Restaurant menu CRUD, categories, image upload (if supported), availability and permissions.
- Bill preview/verified totals, configured tax/discount/charge rules, payment method and gateway/cash settlement behavior, payment history/receipt, and settlement-confirmed session close.
- Restaurant settings, authentication, staff roles and restaurant-level authorization.

When these contracts are documented, wire them through a shared API client/service layer; do not replace demo data with guessed URLs or treat a frontend action as a verified transaction. Backend authorization remains mandatory even when routes are protected in the UI.
