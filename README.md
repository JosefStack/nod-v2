# Nod v2 — Real-Time Chat & Video Call App

A full-stack chat application with real-time messaging, group chats, file attachments, and 1-on-1 WebRTC video calls. Built as a learning project to go deeper on real-time systems, WebRTC, and full-stack TypeScript.

**Live:** https://nod-seven.vercel.app

---

## Features

- **Real-time messaging** — direct and group chats via Socket.io
- **1-on-1 video calls** — built from scratch with WebRTC, no calling library
- **File attachments** — images, video, and files via Cloudinary
- **Authentication** — email/password + Google/GitHub OAuth
- **Online presence** — live online/offline indicators
- **Group chats** — create groups, add members, set group avatar
- **Message previews** — unread counts and last message preview in sidebar

---

## Tech Stack

**Backend**
- Node.js + Express v5 + TypeScript (ES Modules)
- Prisma 7 + PostgreSQL (hosted on Supabase)
- Socket.io — WebSocket server
- Better Auth — Google/GitHub OAuth
- Custom JWT — email/password auth
- Cloudinary — media uploads
- Helmet, CORS, bcrypt

**Frontend**
- React + Vite + TypeScript
- Tailwind v4 + Shadcn/ui
- Zustand — global state
- Socket.io-client
- React Router v7
- Axios

**Infrastructure**
- Render — backend hosting
- Vercel — frontend hosting
- Metered — TURN server for WebRTC
- Cloudinary — media CDN

---

## Interesting Problems Solved

**ICE candidate buffering**

When a call is initiated, the caller starts gathering ICE candidates immediately after creating the offer. On the receiver's side, `getUserMedia` can take 1-3 seconds on mobile before the `RTCPeerConnection` is even created. During that window, incoming ICE candidates arrive and get silently dropped — causing calls to fail or degrade to relay-only.

Fix: buffer incoming candidates in a ref array and drain them after `setRemoteDescription` completes.

**Cross-origin WebSocket auth**

Frontend is on Vercel, backend is on Render — different domains. `httpOnly` cookies can't be read by JavaScript, and `sameSite: lax` blocks cross-origin WebSocket handshakes. Standard cookie-based auth doesn't work here.

Fix: return JWT in the auth response body, store it in Zustand memory (not localStorage), and pass it via `socket.handshake.auth.token` on connection.

**Dual auth middleware**

Better Auth (OAuth) and custom JWT (email/password) need to coexist on the same routes without one blocking the other.

Fix: non-blocking `protect` middleware that checks JWT cookie first, falls back to Better Auth session validation, and calls `next()` regardless — letting route handlers decide what to do with an unauthenticated request.

**Stale closure in useCallback**

`acceptCall` inside `useCallback` was missing `incomingCall` from its dependency array. The function captured `incomingCall = null` from the initial render and never updated — so accepting a call always tried to accept a null call state.

Fix: add `incomingCall` to the dependency array so the function recaptures current state on every incoming call.

---

## Architecture

```
React (Vercel)
      ↓
Vercel proxy rewrites /api/* → Render
      ↓
Node.js / Express (Render)
      ↓
PostgreSQL (Supabase) + Cloudinary
```

**WebRTC call flow:**
```
Caller → getUserMedia → createOffer → setLocalDescription → socket.emit("call_user")
Receiver → getUserMedia → setRemoteDescription → drain ICE buffer → createAnswer → socket.emit("call_accepted")
Both → onicecandidate → forward via socket → addIceCandidate
```

**Socket room architecture:**
Each chat (direct or group) has its own Socket.io room. On connection, the server fetches all of the user's chats and calls `socket.join(roomIds)`. Messages emit to `io.to(chatId)` — scales cleanly to groups without managing individual socket IDs.

---

## Running Locally

**Clone the repo**
```bash
git clone https://github.com/JosefStack/nod-v2
cd nod-v2
```

**Install dependencies**
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

**Set up environment variables**

Server `.env`:
```
DATABASE_URL=
JWT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=development
CLIENT_URL=http://localhost:5173
PORT=3000
```

Client `.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_CALLBACK_URL=http://localhost:5173/
```

**Run**
```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

---

## What's Next

- Typing indicators (backend events written, frontend not connected yet)
- Read receipts (schema exists, not implemented)
- Rooms (backend done, frontend placeholder)
- Group video calls
- Rate limiting on auth routes

---

## What I Learned

This was a rebuild of [Nod v1](https://github.com/JosefStack/nod-chat) — a simpler chat app using MongoDB and basic Socket.io. The goal of v2 was to go deeper on the parts that v1 skipped.

The WebRTC implementation alone taught me more about async systems, race conditions, and browser networking than any tutorial could. The cross-origin auth problem forced a real understanding of how cookies, CORS, and WebSocket handshakes actually work — not just how to configure them.

Building something that breaks in production is a different kind of education.
