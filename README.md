# 📖 Recipe Book — Frontend

A personal cookbook web application built with React and TypeScript. Users can create accounts, manage their own recipe collections, and cook through step-by-step guides.
<img width="1710" height="955" alt="image" src="https://github.com/user-attachments/assets/34a0acc5-24c1-4857-8c75-92a7dbe4a6b4" />

---

## Features

- **Authentication** — Signup, login, and logout with JWT-based sessions
- **Recipe management** — Full CRUD: add, edit, copy, and remove recipes
- **Rich recipe data** — Ingredients with quantities and units, step-by-step cooking instructions, tools and utensils, duration, servings
- **Extended fields** — Cuisine, course type (Starter / Main / Dessert), difficulty level, nutritional values (calories, protein, carbs, fat)
- **Photo upload** — Upload recipe photos directly from your device (powered by Cloudinary)
- **Favourites** — Toggle recipes as favourites with a single click
- **Search and filtering** — Filter by title, difficulty, cuisine, course, and duration simultaneously
- **Cooking wizard** — Dedicated prep screen (ingredients + tools) and steps screen with a guided flow
- **Duplicate detection** — Prevents saving identical recipes or duplicate titles
- **Remove confirmation** — Modal confirmation before deleting a recipe
- **Copy to prefill** — Duplicate a recipe into the form pre-filled for easy variations

---

## Tech Stack

| Layer            | Choice                       |
| ---------------- | ---------------------------- |
| Framework        | React 18                     |
| Language         | TypeScript                   |
| Build tool       | Vite                         |
| Styling          | Tailwind CSS                 |
| Routing          | React Router v6              |
| Auth             | JWT (stored in localStorage) |
| Image storage    | Cloudinary                   |
| State management | React Context API + useState |

---

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── AddRecipeCard.tsx
│   ├── ConfirmModal.tsx
│   ├── FilterBar.tsx
│   ├── IngredientRow.tsx
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── RecipeCard.tsx
│   └── StepInput.tsx
├── context/
│   └── AuthContext.tsx  # Global auth state
├── data/
│   ├── cuisines.ts      # Fixed cuisine options
│   └── units.ts         # Fixed unit options
├── hooks/
│   └── useDebounce.ts   # Debounce hook for search input
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RecipeFormPage.tsx
│   ├── RecipePrepPage.tsx
│   ├── RecipeStepsPage.tsx
│   └── SignupPage.tsx
├── types/
│   └── recipe.ts        # Shared TypeScript interfaces
├── App.tsx
├── config.ts            # API URL config
└── main.tsx
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- The [Recipe Book Backend](link-to-backend-repo) running locally

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:yourusername/recipe-book.git
   cd recipe-book
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the API URL in `src/config.ts`:

   ```typescript
   export const API_URL = "http://localhost:3000";
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

> Make sure your backend server is also running on port 3000 before starting the frontend.

---

## Pages and Routes

| Route               | Page                                | Auth required |
| ------------------- | ----------------------------------- | ------------- |
| `/`                 | Homepage — recipe grid with filters | ✅            |
| `/login`            | Login form                          | ❌            |
| `/signup`           | Signup form                         | ❌            |
| `/recipe/new`       | Add recipe form                     | ✅            |
| `/recipe/:id/edit`  | Edit recipe form                    | ✅            |
| `/recipe/:id/prep`  | Prep screen (ingredients + tools)   | ✅            |
| `/recipe/:id/steps` | Cooking steps screen                | ✅            |

---

## Key Concepts Used

- **React Context API** for global auth state (`useAuth` hook)
- **Protected routes** redirect unauthenticated users to `/login`
- **JWT token** stored in `localStorage`, attached to every API request via `Authorization: Bearer <token>` header
- **Debounced search** — search input waits 300ms after typing before filtering
- **`useMemo`** for performant frontend filtering
- **`React.memo`** on `RecipeCard` to prevent unnecessary re-renders
- **Optimistic UI** — favourite toggle and remove update state only after backend confirms success
- **Form/API type separation** — `FormIngredient`/`FormStep` types used during editing, converted to `Ingredient`/`Step` on save
- **Cloudinary** photo upload via the backend (keeps API credentials server-side)

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
```

---

## Roadmap

- [ ] UI redesign with modern aesthetic
- [ ] Cooking timer on the steps screen
- [ ] Measurement preference and unit conversion
- [ ] Cookbook layer (User → Cookbook → Recipe)
- [ ] Search by ingredients you have on hand
- [ ] AI recipe import and scanning agent
- [ ] Social features — discover other users' cookbooks
- [ ] Mobile app (React Native, reusing existing backend API)
- [ ] Deployment (Vercel + Render + Neon)

---

## Related

- [Recipe Book Backend](link-to-backend-repo) — Node.js + Express + PostgreSQL + Prisma
