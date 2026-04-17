# DealDish — Project Progress Tracker
**Built by:** Project Circle, Siliguri
**Stack:** Node.js + Express + MongoDB + Next.js (TypeScript)

---

## PHASE STATUS

| Phase | Description | Status |
|-------|-------------|--------|
| 01 | Project Setup | ✅ Done |
| 02 | Database & Models | ✅ Done |
| 03 | Authentication | ✅ Done |
| 04 | Backend Core — Restaurants, Offers, Reviews APIs | ✅ Done |
| 05 | Backend Extra — Admin, Referrals, Cron, Email | ✅ Done |
| 06 | Frontend Pages | ✅ Done |
| 07 | Frontend Logic — Connect to Real API | ✅ Done |
| 08 | Integration — Frontend + Backend together | ✅ Done |
| 09 | Testing | ⏳ Pending |
| 10 | Deployment — Railway + Vercel + Atlas | ⏳ Pending |

---

## PHASE 01 — Setup ✅
- Node.js + Express project initialized
- Folder structure: `dealdish/backend` and `dealdish/frontend`
- `.env`, `.gitignore`, `package.json` created

---

## PHASE 02 — Database & Models ✅
- MongoDB Atlas connected via `config/db.js`
- Models created:
  - `User` — with bcrypt, roles, referral
  - `Restaurant` — with 2dsphere geo index
  - `Offer` — with redemption tracking, expiry
  - `Review` — with owner reply, unique index
  - `Bookmark`
  - `PlatformSettings`
  - `RateLimitLog`
  - `Referral`
- Seed data: `utils/seedData.js`

---

## PHASE 03 — Authentication ✅
- Signup with role selection (customer / owner)
- Login with bcrypt password comparison
- JWT access + refresh tokens (httpOnly cookies)
- Logout, get current user (`/api/auth/me`)
- Forgot password + reset password flow
- Referral code generated on signup
- Middleware: `auth.middleware.js`, `role.middleware.js`, `errorHandler.js`
- Services: `auth.service.js`, `utils/apiResponse.js`

---

## PHASE 04 — Backend Core ✅
- `app.js` — all middleware, security, rate limiting
- `server.js` — entry point
- Restaurant API (9 endpoints): CRUD, search, nearby, my-restaurant
- Offer API (9 endpoints): CRUD, toggle, redeem, nearby, bulk
- Review API (6 endpoints): create, get, update, delete, reply, my-review
- User API: bookmarks, dashboard stats, update profile
- Middleware: `upload.middleware.js` (Cloudinary), `validate.middleware.js` (Joi)
- Utils: `pagination.js`, `slugify.js`

---

## PHASE 05 — Backend Extra ✅
- Admin API: users, restaurants, offers, stats, health dashboard, settings, broadcast email
- Rate limit logging middleware + IP ban/unban
- Platform health aggregation (`GET /api/admin/health`)
- Referral system: apply code, leaderboard, my stats
- Email service: verification, password reset, monthly report, broadcast
- Cron job: auto-deactivates expired offers at midnight
- Geo service: distance calculation (Haversine formula)

---

## PHASE 06 — Frontend Pages ✅
**Stack:** Next.js  + TypeScript + Zustand

### Pages built:
| Route | Page | Status |
|-------|------|--------|
| `/` | Homepage — hero, deals, how it works, restaurants, cuisine, newsletter | ✅ |
| `/restaurants` | All restaurants with search + cuisine filter | ✅ |
| `/restaurants/[id]` | Restaurant detail — offers, reviews, info | ✅ |
| `/deals` | All deals with category + sort filter | ✅ |
| `/login` | Login with demo accounts | ✅ |
| `/register` | Register with role selector | ✅ |
| `/dashboard` | Owner dashboard — overview, offers, restaurant, reviews | ✅ |
| `/admin` | Admin panel — users, restaurants, offers, broadcast, settings | ✅ |

### Components:
- `Header.tsx` — transparent/solid, mobile menu, role-based nav links
- `Footer.tsx`
- `RestaurantCard.tsx`
- `OfferCard.tsx`
- `ToastProvider.tsx`
- `ClientShell.tsx` — hides public header/footer on dashboard/admin routes

### State:
- Zustand store with persist — user, token, bookmarks, theme

### Note:
All pages currently use **mock data**. Real API connection happens in Phase 07.

---

## PHASE 07 — Frontend Logic ✅ Done
**Goal:** Replace all mock data with real API calls to the backend.

### API Layer — `lib/api/`
| File | Status |
|------|--------|
| `lib/store.ts` — Zustand store with persist, `_hasHydrated` flag, all methods | ✅ Done |
| `lib/api/client.ts` — fetch wrapper, auto token from store, `apiForm` for multipart | ✅ Done |
| `lib/api/auth.api.ts` — login, signup, logout, me, forgot/reset password | ✅ Done |
| `lib/api/restaurant.api.ts` — CRUD, search, nearby, `formatAddress()` helper | ✅ Done |
| `lib/api/offer.api.ts` — CRUD, toggle, redeem, nearby, bulk | ✅ Done |
| `lib/api/review.api.ts` — create, get, update, delete, reply, my-review | ✅ Done |
| `lib/api/user.api.ts` — toggleBookmark (syncs store), updateProfile | ✅ Done |
| `lib/useHydrated.ts` — hook to prevent SSR/client hydration mismatches | ✅ Done |

### Pages & Components
| Task | Status |
|------|--------|
| `app/login/page.tsx` — real auth, redirect param, role-based post-login route | ✅ Done |
| `app/register/page.tsx` — role selector (customer/owner), referral code field | ✅ Done |
| `app/restaurants/page.tsx` — real API, debounced search (400ms), cuisine filter | ✅ Done |
| `app/restaurants/[id]/page.tsx` — restaurant + offers + reviews via Promise.all | ✅ Done |
| `app/deals/page.tsx` — real discountType filters (percentage/flat/bogo/freebie) | ✅ Done |
| `app/deals/[id]/page.tsx` — real offer data, redeem with login check | ✅ Done |
| `app/dashboard/page.tsx` — owner dashboard: restaurant CRUD, offers, reviews | ✅ Done |
| `app/page.tsx` (homepage) — real restaurants + offers, conditional sections | ✅ Done |
| `components/RestaurantCard.tsx` — real bookmark toggle, slug routing | ✅ Done |
| `components/OfferCard.tsx` — real offer fields, redeem handler | ✅ Done |
| `components/Header.tsx` — hydration-safe auth buttons | ✅ Done |
| `middleware.ts` — Next.js route protection using refreshToken cookie | ✅ Done |

### Bugs Fixed During Phase 07
| Bug | Fix |
|-----|-----|
| `restaurants.map is not a function` | `PaginatedResponse` was wrong — fixed double-nesting: `res.data.data` / `res.data.pagination` |
| `Objects are not valid as a React child` | `restaurant.address` is an object `{street,city,state,pincode}` — added `formatAddress()` helper |
| Dashboard `restForm.address` crash | Used `formatAddress(r.address)` when populating form |
| Hydration mismatch on all pages | Added `_hasHydrated` to store + `useHydrated` hook — guards all auth/bookmark rendering |
| `(public)` route group conflict | Deleted duplicate `app/(public)/restaurants/` folder |
| Dashboard `ReviewCard` truncated | Rewrote full file including reply form |

---

## PHASE 08 — Integration ✅ Done

### Bugs Fixed
| Bug | Fix |
|-----|-----|
| `sameSite: 'strict'` blocked cross-origin cookies | Changed to `'lax'` in dev, `'none'` in production |
| Helmet blocked cross-origin responses | Moved CORS before Helmet, added `crossOriginResourcePolicy: 'cross-origin'` |
| `getMe` returned `_id` not `id` | Fixed controller to return consistent `{ id, name, email, role }` shape |
| `updateProfile` returned raw Mongoose doc | Fixed same way as `getMe` |
| JWT secrets were placeholder strings | Set real secrets in `.env` |
| No token auto-refresh | Added retry logic in `client.ts` — on 401, refreshes token and retries |
| Middleware couldn't see `refreshToken` cookie | Cookie was set by backend (port 5000), middleware runs on frontend (port 3000) — different origins. Fixed by setting a client-side `isLoggedIn` cookie after login/signup |
| Hydration errors on Header, Login, Register | Added `suppressHydrationWarning` to form inputs and buttons affected by browser extensions injecting `fdprocessedid` |
| Theme emoji hydration mismatch | Guarded with `hydrated` flag from `useHydrated` hook |

### Verified Working
- CORS, register, login, logout
- Header auth state (Logout vs Sign In)
- Restaurants page with real DB data
- Restaurant detail (offers + reviews)
- Bookmark toggle
- Review submit / edit / delete
- Deals page + deal detail
- Search and filters
- Protected routes — logged out redirects to `/login`
- Role-based access — customer blocked from `/dashboard`
- Token auto-refresh on 401

---

## PHASE 09 — Testing ⏳
- Test all user flows (customer, owner, admin)
- Test on mobile
- Fix edge cases, empty states, error states
- Fix broken filters and search

---

## PHASE 10 — Deployment ⏳
- Push to GitHub
- Deploy backend on Railway
- Deploy frontend on Vercel
- MongoDB Atlas production config
- Update CORS for production URLs
- Optional: buy domain (dealdish.in)

---

## API ENDPOINTS REFERENCE

### Auth — `/api/auth`
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/signup` | Public |
| POST | `/login` | Public |
| POST | `/logout` | Public |
| GET | `/me` | Protected |
| POST | `/refresh` | Public |
| POST | `/forgot-password` | Public |
| PUT | `/reset-password/:token` | Public |

### Restaurants — `/api/restaurants`
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/` | Public |
| GET | `/search` | Public |
| GET | `/nearby` | Public |
| GET | `/:slug` | Public |
| POST | `/` | Owner |
| PUT | `/:id` | Owner |
| DELETE | `/:id` | Owner |
| GET | `/my-restaurant` | Owner |

### Offers — `/api/offers`
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/` | Public |
| GET | `/nearby` | Public |
| GET | `/:id` | Public |
| POST | `/` | Owner |
| PUT | `/:id` | Owner |
| DELETE | `/:id` | Owner |
| PATCH | `/:id/toggle` | Owner |
| POST | `/:id/redeem` | Protected |
| POST | `/bulk` | Owner |

### Reviews — `/api/reviews`
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/:restaurantId` | Public |
| POST | `/:restaurantId` | Protected |
| GET | `/:restaurantId/my-review` | Protected |
| PUT | `/:id` | Protected |
| DELETE | `/:id` | Protected |
| POST | `/:id/reply` | Owner |

### Users — `/api/users`
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/bookmarks` | Protected |
| POST | `/bookmarks/:restaurantId` | Protected |
| GET | `/dashboard` | Protected |
| PUT | `/profile` | Protected |

### Admin — `/api/admin`
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/users` | Admin |
| DELETE | `/users/:id` | Admin |
| GET | `/restaurants/unverified` | Admin |
| PATCH | `/restaurants/:id/verify` | Admin |
| GET | `/stats` | Admin |
| GET | `/health` | Admin |
| POST | `/broadcast` | Admin |
| GET | `/settings` | Admin |
| PATCH | `/settings` | Admin |
| DELETE | `/offers/:id` | Admin |
| GET | `/rate-limits` | Admin |
| PATCH | `/rate-limits/:id/unban` | Admin |

### Referrals — `/api/referrals`
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/leaderboard` | Public |
| GET | `/my-code` | Protected |
| POST | `/apply` | Protected |
| GET | `/all` | Admin |

---

## ENV VARIABLES NEEDED