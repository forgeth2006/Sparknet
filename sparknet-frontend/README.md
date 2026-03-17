# SparkNet Frontend

React + Vite + Tailwind CSS + Axios frontend for SparkNet backend.

## Setup

```bash
cd sparknet-frontend
npm install
npm run dev
```

Runs on http://localhost:3000 — proxies /api to http://localhost:5000

## Folder Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance + JWT interceptor + auto-refresh
│   ├── authApi.js        # Auth endpoints
│   ├── guardianApi.js    # Guardian endpoints
│   └── adminApi.js       # Admin endpoints
├── components/
│   ├── common/           # Badge, Input, Spinner, ConfirmModal, Logo
│   └── layout/           # Navbar, AppLayout, AuthLayout
├── context/
│   └── AuthContext.jsx   # Global auth state + login/logout
├── hooks/
│   └── useApi.js         # Generic async hook
├── pages/
│   ├── auth/             # Login, Register, ForgotPw, ResetPw, VerifyEmail, ResendVerification
│   ├── guardian/         # GuardianDashboard, ChildActivity, GuardianApprove
│   ├── admin/            # AdminDashboard, AdminUsers, AdminUserDetail
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   └── ChangePasswordPage.jsx
├── routes/
│   └── ProtectedRoute.jsx  # ProtectedRoute, AdminRoute, GuardianRoute, PublicRoute
└── utils/
    └── helpers.js        # formatDate, getStatusColor, getRoleColor, getErrorMessage
```

## API Endpoints Covered

### Auth (/api/auth)
- POST /register
- POST /login
- POST /logout
- POST /logout-all
- POST /refresh (auto via interceptor)
- GET  /me
- GET  /verify-email/:token
- POST /resend-verification
- POST /forgot-password
- POST /reset-password/:token
- POST /change-password

### Guardian (/api/guardian)
- POST /approve/:token
- POST /resend-invite
- GET  /children
- PATCH /children/:id/controls
- PATCH /children/:id/status
- DELETE /children/:id
- GET  /children/:id/activity

### Admin (/api/admin)
- GET  /stats
- GET  /users
- GET  /users/:id
- PATCH /users/:id/status
- POST  /users/:id/force-logout
- GET  /users/:id/activity
- PATCH /users/:id/mode
