# API Documentation

This documentation provides comprehensive details of all server API endpoints in the application. Unimplemented routes are explicitly flagged. Detailed TypeScript definitions are provided for request payloads and expected responses to easily generate frontend types.

## General Structure
All requests require the `Content-Type: application/json` header unless specified otherwise.
Most endpoints outside of the Auth routes require an authenticated session (handled via cookies/middleware).

---

## Auth Routes (`/api/auth`)

### 1. Check Auth Status
- **Method:** `GET`
- **Route:** `/api/auth/check`
- **Description:** Verifies the user's session and returns their profile.
- **Request Body:** None
- **Success Response (200 OK):**
```typescript
type CheckAuthResponse = {
  id: string;
  email: string;
  isOnboarded: boolean;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  image: string | null;
  name: string | null;
} | null;
```

### 2. Sign Up
- **Method:** `POST`
- **Route:** `/api/auth/signup`
- **Description:** Creates a new user account with email and password.
- **Request Body:**
```typescript
type SignupRequest = {
  email: string;
  password: string; // Plaintext password
}
```
- **Success Response (201 Created):**
```typescript
type SignupResponse = {
  id: string;
  email: string;
  isOnboarded: boolean;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  image: string | null;
  name: string | null;
}
```

### 3. Log In
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Description:** Authenticates a user with an email or username and password.
- **Request Body:**
```typescript
type LoginRequest = {
  input: string; // Email or username
  password: string;
}
```
- **Success Response (200 OK):**
*Note: This specific endpoint currently returns the full database user object.*
```typescript
type LoginResponse = {
  id: string;
  email: string;
  password: string; // Hashed password
  isOnboarded: boolean;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  image: string | null;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Log Out
- **Method:** `POST`
- **Route:** `/api/auth/logout`
- **Description:** Clears the user's session cookie.
- **Request Body:** None
- **Success Response (200 OK):**
```typescript
type LogoutResponse = {
  message: string; // e.g., "Logged out successfully"
}
```

---

## User Routes (`/api/user`)
*All endpoints below require authentication.*

### 5. Update Profile
- **Method:** `PATCH`
- **Route:** `/api/user/update-profile`
- **Description:** Updates the user's profile details.
- **Request Body:**
```typescript
type UpdateProfileRequest = {
  username?: string | null;
  avatar?: string | null; // Data URL for Cloudinary upload
  bio?: string | null;
  fullName?: string | null;
}
```
- **Success Response (200 OK):**
```typescript
type UpdateProfileResponse = {
  id: string;
  email: string;
  username: string | null;
  isOnboarded: boolean;
  avatar: string | null;
  bio: string | null;
  name: string | null;
}
```

### 6. Check Username Availability
- **Method:** `POST`
- **Route:** `/api/user/check-username`
- **Description:** Checks whether a provided username is already claimed by another user.
- **Request Body:**
```typescript
type CheckUsernameRequest = {
  username: string;
}
```
- **Success Response (200 OK):**
```typescript
type CheckUsernameResponse = {
  available: boolean; // Will be true
}
```
- **Error Response (409 Conflict):** If username is taken.
```typescript
type CheckUsernameError = {
  available: boolean; // Will be false
}
```

### 7. Search Users
- **Method:** `GET`
- **Route:** `/api/user/search`
- **Description:** Searches for up to 10 users whose `name` or `username` match the search key.
- **Important Note:** This is defined as a `GET` request but relies on a request body (`req.body`). 
- **Request Body:**
```typescript
type SearchUsersRequest = {
  searchKey: string; // Minimum 2 characters
}
```
- **Success Response (200 OK):**
```typescript
type SearchUsersResponse = {
  id: string;
  username: string | null;
  name: string | null;
  avatar: string | null;
}[]
```

---

## Chat Routes (`/api/chat`)
*All endpoints below require authentication.*

### 8. Get All Chats
- **Method:** `GET`
- **Route:** `/api/chat/`
- **Description:** Retrieves both Direct and Group chats the user is a participant of, sorted by the latest message.
- **Request Body:** None
- **Success Response (200 OK):**
```typescript
type ChatPreview = {
  id: string;
  type: "direct" | "group";
  name: string; // Group name or other participant's name
  username?: string | null; // (Direct chat only) other participant's username
  avatar: string | null; // Group avatar or other participant's avatar
  lastMessage: {
    preview: string | null; // Message content or attachment preview (e.g., "📸1 image")
    createdAt?: Date;
    updatedAt?: Date;
    sender?: string; // Latest sender's username
  };
  unreadCount: number; // Count of unread messages globally relative to user
}

type GetAllChatsResponse = ChatPreview[];
```

### 9. Get Rooms (🚧 NOT IMPLEMENTED)
- **Method:** `GET`
- **Route:** `/api/chat/room`
- **Description:** Intended to list rooms related to the user.
- **Status:** Explicitly unimplemented, returns a dummy response.
- **Success Response (404 Not Found):**
```typescript
{ 
  message: "Chiseling" 
}
```

### 10. Get/Create Direct Chat
- **Method:** `POST`
- **Route:** `/api/chat/direct`
- **Description:** Retrieves an existing direct chat with the specified user, or provisions a new one if it doesn't exist.
- **Request Body:**
```typescript
type GetOrCreateDirectChatRequest = {
  targetUserId: string;
}
```
- **Success Response (200 OK / 201 Created):**
```typescript
type GetOrCreateDirectChatResponse = {
  id: string;
  type: "direct";
  isNew: boolean;
  other: {
      id: string;
      username: string | null;
      name: string | null;
      avatar: string | null;
  };
}
```

### 11. Create Group Chat
- **Method:** `POST`
- **Route:** `/api/chat/group`
- **Description:** Creates a new group chat and assigns the creator as "owner".
- **Request Body:**
```typescript
type CreateGroupChatRequest = {
  groupName: string;
  groupAvatar?: string; // Data URL for Cloudinary upload
  groupDescription?: string;
  memberIds: string[]; // List of additional user IDs to add
}
```
- **Success Response (201 Created):**
```typescript
type CreateGroupChatResponse = {
  id: string;
  name: string;
  description: string | null;
  avatar: string | null;
  members: {
      id: string;
      name: string | null;
      username: string | null;
      avatar: string | null;
      role: string; // e.g. "owner" or "member"
  }[];
}
```

---

## Message Routes (`/api/message`)
*All endpoints below require authentication.*

### 12. Get All Messages For Chat
- **Method:** `GET`
- **Route:** `/api/message/:chatId`
- **Description:** Fetch all messages for a specific chat ID, sorted chronologically.
- **Query Parameters:**
  - `type` (Required): Identifies the type of the chat. Values must be `"direct"`, `"group"`, or `"room"`.
  - Example: `/api/message/1234?type=direct`
- **Success Response (200 OK):**
```typescript
type MessageItem = {
  id: string;
  content: string | null;
  senderId: string;
  directChatId: string | null;
  groupId: string | null;
  roomId: string | null;
  createdAt: Date;
  updatedAt: Date;
  sender: {
      id: string;
      username: string | null;
      avatar: string | null;
      name: string | null;
  };
  attachments: {
      id: string;
      url: string;
      type: string; // e.g. "image", "video", "file"
      fileName: string | null;
      size: number | null;
      width: number | null;
      height: number | null;
      duration: number | null;
      messageId: string;
      createdAt: Date;
  }[];
  readBy: {
      userId: string;
  }[];
}

type GetAllMessagesResponse = MessageItem[];
```

### 13. Send Message
- **Method:** `POST`
- **Route:** `/api/message/send`
- **Description:** Broadcast a new message payload into a specific chat. Note: Requires verified membership inside the target chat.
- **Request Body:**
```typescript
type SendMessageRequest = {
  content?: string;
  attachments?: {
    data: string; // Base64 data string or URL for Cloudinary
    type: "image" | "video" | "file";
    fileName?: string;
    size?: number;
  }[];
  chatType: "direct" | "group" | "room";
  chatId: string;
}
```
- **Success Response (201 Created):**
```typescript
type SendMessageResponse = {
  id: string;
  content: string | null;
  senderId: string;
  directChatId: string | null;
  groupId: string | null;
  roomId: string | null;
  createdAt: Date;
  updatedAt: Date;
  sender: {
      id: string;
      name: string | null;
      avatar: string | null;
      username: string | null;
  };
  attachments: {
      id: string;
      url: string;
      type: string;
      fileName: string | null;
      size: number | null;
      width: number | null;
      height: number | null;
      duration: number | null;
      messageId: string;
      createdAt: Date;
  }[];
}
```

### 14. Delete Message
- **Method:** `DELETE`
- **Route:** `/api/message/:messageId`
- **Description:** Deletes a specific message. The requester must be the original sender.
- **Request Body:** None
- **Success Response (200 OK):**
```typescript
type DeleteMessageResponse = {
  message: string; // "Message deleted"
}
```
