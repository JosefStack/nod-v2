# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nod is a real-time chat application with direct messages, group chats, and rooms. It uses a monorepo structure with separate `client/` and `server/` directories (no workspace manager — each has its own `package.json` and `node_modules`).

## Commands

### Client (from `client/`)
- `npm run dev` — Vite dev server on port 5173
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint

### Server (from `server/`)
- `npm run dev` — tsx watch mode on port 3000
- `npm run build` — generates Prisma client, then compiles TypeScript
- `npx prisma migrate dev` — run migrations
- `npx prisma generate` — regenerate Prisma client (output: `server/src/generated/prisma/`)

## Architecture

### Server (`server/src/`)
- **Express 5** REST API with route → controller pattern
- Routes: `routes/{auth,user,chat,message}Routes.ts` → Controllers: `controllers/{auth,user,chat,message}.controller.ts`
- **Prisma 7** ORM with PostgreSQL. Schema at `server/prisma/schema.prisma`, generated client at `server/src/generated/prisma/`
- **better-auth** for session management (Google/GitHub OAuth + email/password). Auth config in `lib/auth.ts`, catch-all handler at `/api/auth/{*any}`
- Custom JWT middleware in `middleware/auth.middleware.ts` for protecting API routes
- Cloudinary for file/image uploads (`lib/cloudinary.ts`)
- CORS allows `localhost:5173` and `nod-seven.vercel.app`

### Client (`client/src/`)
- **React 19** + **TypeScript** + **Vite 8** + **Tailwind CSS 4**
- UI components from **shadcn/ui** (Radix primitives) in `components/ui/`
- **Zustand** stores in `store/` — `useAuthStore`, `useChatStore`, `useUserStore`
- Routing via **react-router v7** — routes: `/login`, `/signup`, `/onboarding`, `/` (chat)
- API calls via axios instance (`lib/axios.ts`) — base URL `/api` proxied to server in dev
- Shared types in `types/chat.ts` (User, Chat, Message, Attachment)
- Chat UI components in `components/chat/` (Sidebar, ChatList, ChatWindow, MessageBubble, etc.)

### Data Model (key entities)
- **User** — has auth accounts, sessions, connections, messages
- **DirectChat** — two participants via `DirectChatParticipants` join table
- **Group** — owner + members via `GroupMember`, has messages
- **Room** — owner + members via `RoomMember`, optional password/capacity/region (not fully implemented)
- **Message** — belongs to one of DirectChat/Group/Room, has attachments and read receipts
- **Connections** — friend request system (pending/accepted status)

### API Structure
All endpoints under `/api`. Full documentation in `api_documentation.md` at repo root. Chat type is a discriminator (`"direct" | "group" | "room"`) used throughout the API as query params and request bodies.
