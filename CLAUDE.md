# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Frontend Development:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle (client + server)
- `npm run check` - Run TypeScript type checking

**Server Development:**
- `npm run dev:server` - Start Express server in development mode
- `npm start` - Start production server

**Database:**
- `npm run db:push` - Push schema changes to database using Drizzle

## Architecture Overview

This is a grocery list management app built as a full-stack TypeScript application with a unique URL-based state sharing system.

### Frontend Architecture

**Client Structure:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui components
- TanStack Query for server state
- Custom URL hash-based state management

**State Management:**
- `GroceryContext` - Central React context for all grocery list state
- `useHashState` - Custom hook that syncs state with URL hash using LZ-string compression
- `useShareableState` - Optimized hook for sharing To Buy items via URL (filters out favorites/never-buy for smaller URLs)
- All state persists in URL hash for easy sharing and bookmarking

**Key State Concepts:**
- Three list types: To Buy (`tobuy`), Favorites (`favorites`), Never Buy (`neverbuy`)
- Items can be moved between lists
- URL hash contains compressed grocery data + active tab
- Shareable URLs only include To Buy items for brevity

### Backend Architecture

**Server Structure:**
- Express.js server serving both API and static files
- Development: Vite middleware for HMR
- Production: Serves pre-built static files
- No database persistence - relies entirely on URL state

**File Structure:**
- `server/index.ts` - Main Express app setup
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Data persistence logic
- `shared/schema.ts` - Shared types between client/server

### Data Model

**GroceryItem Schema:**
```typescript
{
  id: string;           // nanoid
  name: string;         // Item name
  category: Category;   // produce, dairy, meat, bakery, frozen, pantry, household
  listType: ListType;   // tobuy, favorites, neverbuy
  note?: string;        // Optional notes
  purchased: boolean;   // For To Buy items
}
```

### URL State System

The app uses an advanced URL-based state system with two compression strategies:

1. **Main State (`useHashState`)** - Stores all grocery items with field compression
2. **Shareable State (`useShareableState`)** - Stores only To Buy items for sharing

**Compression Features:**
- Field name shortening (`name` → `n`, `category` → `c`)
- Category compression (`produce` → `pr`, `dairy` → `da`)
- LZ-string compression with base64 encoding
- URL-safe character replacement (`+` → `-`, `/` → `_`)
- Omits default values (`purchased: false`, empty notes)

### Component Architecture

**Layout Components:**
- `Header` - App title, share button, settings, home link to clean URL
- `TabNavigation` - Switches between To Buy/Favorites/Never Buy
- `ListControls` - Search, category filter, add item button

**List Components:**
- `ToBuyList`, `FavoritesList`, `NeverBuyList` - Display respective item types
- `ShoppingItem`, `FavoriteItem`, `NeverBuyItem` - Individual item components

**Modal Components:**
- `AddItemModal` - Add/edit items with category selection

### Dependencies

**Key Frontend Dependencies:**
- React ecosystem: `react`, `react-dom`, `@vitejs/plugin-react`
- UI: `@radix-ui/*` components, `tailwindcss`, `@fortawesome/fontawesome-free`
- State: `@tanstack/react-query`, custom hooks
- Utils: `lz-string`, `nanoid`, `clsx`, `tailwind-merge`

**Key Backend Dependencies:**
- Server: `express`, `ws` (WebSocket support)
- Database: `drizzle-orm`, `@neondatabase/serverless`
- Auth: `passport`, `passport-local`, `express-session`
- Build: `esbuild`, `tsx`

## Development Notes

**State Management Patterns:**
- Always use `useGrocery()` hook to access/modify grocery state
- State automatically syncs to URL hash
- URL sharing works seamlessly without manual intervention

**URL Hash Structure:**
- `#groceryItems=<compressed-data>&tab=tobuy&share=<shareable-data>`
- Main state includes all items, shareable state only To Buy items
- Tab parameter controls active view

**Category System:**
- Seven predefined categories with icon mapping in `lib/icons.ts`
- Categories are compressed in URL state for efficiency

**Testing Considerations:**
- No test framework currently configured
- State persistence relies on URL hash, not localStorage
- Sharing functionality depends on URL manipulation