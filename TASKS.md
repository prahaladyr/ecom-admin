# Ecom Admin — Task List

This is the work plan for the **Admin Panel (Next.js)** that manages a tenant’s store via the NestJS backend.

## Scope & assumptions

- Admin app is separate from the storefront.
- All requests to the backend require `x-api-key` (tenant selection).
- Admin features require authenticated user with `role=ADMIN`.
- Backend base URL is configured via env (`BACKEND_BASE_URL`).

## Phase 0 — Project setup

- [ ] Decide deployment target (Vercel vs Docker vs VM)
- [ ] Install and adopt `shadcn/ui` component system
- [ ] Define responsive breakpoint policy (mobile-first)
- [ ] Confirm runtime env strategy
  - [ ] `TENANT_API_KEY` in `.env` (single-tenant admin) **OR** tenant selection UI (multi-tenant admin)
  - [ ] `BACKEND_BASE_URL` per environment
- [ ] Add README instructions specific to admin app (run, env, ports)
- [ ] Add `.env.local.example` notes (do not commit secrets)
- [ ] Add basic CI job for admin app (lint + typecheck + build)

## Phase 1 — Auth foundations (admin login)

- [ ] Login UI (email/password) with good validation + error states
- [ ] Token handling
  - [ ] Store access/refresh tokens in **httpOnly cookies** (server-set)
  - [ ] Auto-refresh access token when expired
  - [ ] Logout clears cookies and revokes refresh token
- [ ] Route protection
  - [ ] Guard `/admin/*` routes
  - [ ] Redirect to `/login` when not authenticated
- [ ] Role gating
  - [ ] Block non-ADMIN users from admin routes (show a clear message)

## Phase 2 — Admin shell (UX baseline)

- [ ] App layout
  - [ ] Header with tenant/store label
  - [ ] Responsive navigation (desktop sidebar + mobile drawer)
  - [ ] Left navigation: Dashboard, Products, Categories, Inventory, Orders, Coupons, Users, Payments
  - [ ] Content container + consistent spacing
- [ ] Shared UI building blocks
  - [ ] Buttons (primary/secondary/destructive)
  - [ ] Inputs, selects, textareas
  - [ ] Form error message styling
  - [ ] Toast/alert component for success/failure
  - [ ] Empty states + loading skeletons

## Phase 3 — API client conventions

- [ ] Central API client wrapper
  - [ ] Always attach `x-api-key`
  - [ ] Attach `Authorization: Bearer <accessToken>` when available
  - [ ] Normalize backend errors into a consistent shape
  - [ ] Handle 401/403 (auto-redirect or “not authorized” screen)
- [ ] Pagination convention (query params + UI controls)
- [ ] Search/sort convention (minimal, only if needed)

## Phase 4 — Products (core admin feature)

- [ ] Products list
  - [ ] Paginated table/list
  - [ ] Columns: name, price, status, updated
  - [ ] View details action
- [ ] Create product
  - [ ] Form with validation
  - [ ] Success redirect to product detail
- [ ] Edit product
  - [ ] Update price/name/description
  - [ ] Handle optimistic vs pessimistic updates
- [ ] Delete product
  - [ ] Confirm destructive action

## Phase 5 — Categories

- [ ] Categories list
- [ ] Create category
- [ ] Edit category
- [ ] Delete category

## Phase 6 — Inventory

- [ ] Inventory view per product
- [ ] Set inventory (stock)
- [ ] Clear error handling when backend DB is disabled (503)

## Phase 7 — Orders

- [ ] Orders list (paginated)
- [ ] Order detail
  - [ ] Items + totals + status
- [ ] Update order status
  - [ ] Restrict to allowed transitions (as defined by backend)

## Phase 8 — Coupons

- [ ] Coupons list
- [ ] Create coupon
- [ ] Edit coupon
- [ ] Delete coupon

## Phase 9 — Users (admin)

- [ ] Users list (paginated)
- [ ] User detail
- [ ] Update user role (ADMIN/CUSTOMER)

## Phase 10 — Payments (admin)

- [ ] Payment intent view (if needed)
- [ ] Webhook debug screen (optional)

## Phase 11 — Quality, security, and readiness

- [ ] Accessibility pass (focus states, labels, keyboard navigation)
- [ ] Basic tests
  - [ ] Unit tests for API client and helpers
  - [ ] Smoke test for login/logout flow
- [ ] Production hardening
  - [ ] Ensure cookies are `secure` in prod
  - [ ] Add CSRF considerations for cookie auth (if needed)
  - [ ] Audit logs/telemetry hooks (minimal)

## Definition of Done (per page)

- [ ] Looks correct on mobile + desktop
- [ ] Loading + error + empty states implemented
- [ ] Backend errors are shown clearly
- [ ] No secrets committed
- [ ] `npm run lint` and `npm run build` pass
