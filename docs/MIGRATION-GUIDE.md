# Pokemon Application Migration Bible

## Project Overview

This project is a migration of a legacy React + Redux Pokemon application into a modern Next.js 16+ application using App Router.

The objective is not a direct file-for-file conversion. The objective is a modernization of the architecture while preserving:

* Existing UI identity
* Existing application behavior
* Existing Pokemon workflows
* Dynamic Pokemon accent coloring
* Compare functionality
* Search experience
* Pokemon encyclopedia experience

The migration should prioritize maintainability, scalability, performance, and adherence to modern Next.js patterns.

---

# Target Technology Stack

## Framework

* Next.js 16+
* App Router

## Language

* TypeScript (strict mode)

## Styling

* Tailwind CSS v4
* CSS-first configuration
* shadcn/ui

## State Management

### TanStack Query

Use for:

* Pokemon list retrieval
* Pokemon details
* Evolution chains
* Encounter locations
* Search datasets
* Any API-derived data

TanStack Query replaces Redux async reducers and API state.

### Zustand

Use for lightweight client-side state:

* Compare queue
* Current Pokemon detail tab
* Dynamic accent color
* UI-only state

Zustand replaces Redux slices.

## Notifications

Preferred:

* Sonner

Replaces:

* React Toastify

## Routing

Next.js App Router

Replaces:

* React Router

---

# Legacy Application Overview

## Legacy Routes

```txt
/search
/pokemon/:id
/compare
/play
/list
```

## Routes Being Removed

```txt
/ list
```

Reason:

* Authentication removed
* Firebase removed
* Saved Pokemon functionality removed

## Routes Remaining

```txt
/search
/pokemon/[id]
/compare
/play
```

---

# Legacy Redux Analysis

## AppSlice

Contained:

```ts
toasts
userInfo
isLoading
currentPokemonTab
```

### Migration

| Redux State       | New Location   |
| ----------------- | -------------- |
| toasts            | Sonner         |
| userInfo          | Removed        |
| isLoading         | TanStack Query |
| currentPokemonTab | Zustand        |

---

## PokemonSlice

Contained:

```ts
allPokemon
randomPokemon
currentPokemon
compareQueue
userPokemons
```

### Migration

| Redux State    | New Location   |
| -------------- | -------------- |
| allPokemon     | TanStack Query |
| randomPokemon  | TanStack Query |
| currentPokemon | TanStack Query |
| compareQueue   | Zustand        |
| userPokemons   | Removed        |

---

# Legacy Page Analysis

## Search Page

Responsibilities:

* Fetch pokemon index
* Randomly display pokemon cards
* Search pokemon names
* Render CardGrid

Migration:

* Server Component page
* Client Search component
* TanStack Query for dataset
* Debounced search

---

## Pokemon Detail Page

Responsibilities:

* Pokemon details
* Evolution chain
* Encounter locations
* Abilities
* Moves
* Dynamic accent color

Contains 4 tabs:

```txt
Description
Evolution
Locations
Capable Moves
```

Migration:

* Server Component page
* Server-side data aggregation
* Zustand for current tab
* Dynamic accent color retained

---

## Compare Page

Responsibilities:

* Compare up to 2 Pokemon

Migration:

* Zustand compare store
* TanStack Query for details

---

## Play Page

Not yet analyzed.

Migration deferred until page inspection.

---

# Dynamic Accent Color System

## Current Behavior

Pokemon image is analyzed.

Extracted dominant color becomes:

```css
--accent-color
```

Used throughout:

* Borders
* Buttons
* Progress bars
* Active tabs
* Pokemon circles
* UI highlights

---

## Decision

KEEP THIS FEATURE.

It is a defining visual characteristic of the application.

---

## Planned Implementation

Zustand Theme Store

```ts
accentColor
setAccentColor()
```

Global CSS variable:

```css
--pokemon-accent
```

All components consume this variable.

---

# Asset Strategy Decision

## Legacy

Contains approximately:

```txt
125 MB
```

Pokemon assets:

```txt
assets/pokemons/default
assets/pokemons/shiny
```

---

## Decision

REMOVE LOCAL POKEMON ASSETS

Retain only:

```txt
assets/
├── types/
├── pokeball.png
└── pokeball2.png
```

---

## Replacement

Official Pokemon artwork URLs.

Examples:

```txt
Official Artwork
Pokemon Home Artwork
```

Images will be loaded through:

```tsx
next/image
```

Benefits:

* Massive repository reduction
* CDN delivery
* Browser caching
* Next.js image optimization
* Lazy loading

---

## Dynamic Accent Color

Accent extraction should continue working from remote artwork.

Potential future optimization:

Precomputed Pokemon color map.

---

# Styling Philosophy

## Do Not

Attempt 1:1 SCSS translation.

---

## Do

Extract a reusable design system.

---

## Retain Visual Identity

Key elements:

### Glassmorphism

```txt
glass-panel
glass-card
```

### Dot Grid Background

Reusable utility.

### Accent Color System

Global CSS variable.

### Futuristic Borders

Retained through Tailwind components.

---

# shadcn Usage Strategy

Use shadcn whenever a component naturally fits.

Recommended:

```txt
Button
Input
Dialog
Drawer
Sheet
Tabs
Tooltip
Dropdown Menu
Scroll Area
Skeleton
Badge
Separator
```

---

Avoid forcing shadcn for:

```txt
Navbar
Footer
Pokemon Cards
Pokemon Detail Layout
Compare Layout
Stat Displays
Pokemon Display Circles
```

These remain custom Tailwind components.

---

# Route Handler Strategy

All external API calls should be gated through Next.js.

Never call PokeAPI directly from components.

---

## Planned Routes

```txt
app/api/pokemon/list/route.ts

app/api/pokemon/[id]/route.ts

app/api/pokemon/evolution/[id]/route.ts

app/api/pokemon/species/[id]/route.ts
```

Benefits:

* Centralized API layer
* Caching
* Revalidation
* Future DB integration
* Rate limit protection

---

# Proposed Next.js Folder Structure

```txt
src/

├── app/
│   ├── api/
│   │
│   ├── compare/
│   ├── play/
│   ├── pokemon/
│   │   └── [id]/
│   ├── search/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── background.tsx
│   │
│   ├── pokemon/
│   │
│   ├── compare/
│   │
│   ├── play/
│   │
│   └── shared/
│
├── features/
│   ├── pokemon/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── compare/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── play/
│
├── stores/
│   ├── compare-store.ts
│   ├── pokemon-ui-store.ts
│   └── theme-store.ts
│
├── providers/
│   ├── query-provider.tsx
│   ├── theme-provider.tsx
│   └── app-provider.tsx
│
├── lib/
│   ├── query-client.ts
│   ├── pokemon-api.ts
│   ├── colors.ts
│   └── utils.ts
│
├── hooks/
│   ├── use-debounce.ts
│   └── use-mounted.ts
│
├── constants/
│   ├── pokemon-tabs.ts
│   └── pokemon-types.ts
│
├── types/
│   └── index.ts
│
├── styles/
│   └── globals.css
│
└── assets/
    ├── types/
    ├── pokeball.png
    └── pokeball2.png
```

---

# Zustand Stores Planned

## Compare Store

```ts
compareQueue
addPokemon()
removePokemon()
clearCompare()
```

Maximum:

```txt
2 Pokemon
```

---

## Pokemon UI Store

```ts
currentTab
setCurrentTab()
```

Tabs:

```txt
description
evolution
locations
moves
```

---

## Theme Store

```ts
accentColor
setAccentColor()
```

---

# TanStack Query Ownership

## Pokemon List

```ts
usePokemonList()
```

---

## Pokemon Search

```ts
usePokemonSearch()
```

---

## Pokemon Detail

```ts
usePokemonDetail()
```

---

## Evolution Chain

```ts
usePokemonEvolution()
```

---

## Encounter Locations

```ts
usePokemonLocations()
```

---

# Provider Setup

Root Layout should provide:

```tsx
QueryProvider
ThemeProvider
Sonner
```

Wrapped once at application root.

---

# Migration Order

## Phase 1

Foundation

```txt
Next.js Setup
Tailwind v4
shadcn
TanStack
Zustand
Providers
Global Styles
Types
```

---

## Phase 2

Application Shell

```txt
Background
Navbar
Footer
Root Layout
```

---

## Phase 3

Pokemon Feature

```txt
Pokemon APIs
Pokemon Types
Pokemon Cards
Pokemon Detail
Pokemon Tabs
```

---

## Phase 4

Search Feature

```txt
Search Page
Search Input
Card Grid
Filtering
```

---

## Phase 5

Compare Feature

```txt
Compare Store
Compare UI
Compare Page
```

---

## Phase 6

Play Feature

After analysis of legacy implementation.

---

# Important Decisions Already Approved

✅ Next.js 16 App Router

✅ TypeScript

✅ Tailwind CSS v4

✅ shadcn/ui

✅ TanStack Query

✅ Zustand

✅ Remove Redux

✅ Remove Firebase

✅ Remove Authentication

✅ Remove Saved Pokemon List

✅ Keep Dynamic Accent Color System

✅ Use Official Pokemon Artwork

✅ Feature-Based Architecture

✅ Route Handlers For External APIs

✅ Custom Tailwind UI With Selective shadcn Usage

---

# Documentation Corrections Applied

## Resolved In Docs

- PokeAPI base URL is now server-only and no longer uses `REACT_APP_SERVER_URL`.
- Debounce now has strict typing, correct timer handling, and a 300ms default delay.
- Legacy `require.context` Pokemon image loading is replaced by remote official artwork URL helpers.
- `pokemonStatsType.value` is now `number`.
- Search uses a 300ms debounce instead of 3000ms.

## Still Open / Requires Implementation Decision

- Play page has a safe placeholder route until legacy Play code is provided.
- Large Pokemon lists use a 60-item cap in search; pagination or virtualization can be added later.
- shadcn components are not installed yet; UI currently uses Tailwind primitives.
