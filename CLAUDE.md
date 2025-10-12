# Claude Code Configuration - SOMPO Front-end

This is a React + TypeScript + Vite application for SOMPO insurance platform.

## Project Structure
```
src/
├── App.tsx                 # Main app component
├── AppRouter.tsx          # Route definitions
├── AppTheme.tsx           # MUI theme configuration
├── main.tsx               # Application entry point
├── ProtectedRoute.tsx     # Route protection wrapper
├── assets/                # Static assets
├── layouts/               # Layout components
│   ├── Auth/             # Authentication layout
│   └── Main/             # Main app layout
│       ├── Header/       # Header component
│       └── Sidebar/      # Sidebar navigation
├── pages/                # Page components
│   ├── Assessment/       # Assessment page
│   ├── Dashboard/        # Dashboard page
│   └── Login/            # Login page with forms
├── shared/               # Shared utilities and resources
│   ├── colors/          # Color definitions (black.ts, purple.ts)
│   ├── config/          # Configuration files
│   ├── enums/           # Enums (routes.ts)
│   ├── hooks/           # Custom React hooks
│   ├── http/            # HTTP client setup
│   │   └── sompo-api/   # SOMPO API integration
│   ├── interfaces/      # TypeScript interfaces
│   │   ├── areas/       # Area-related interfaces
│   │   ├── auth/        # Auth interfaces
│   │   └── other/       # Other interfaces
│   ├── services/        # Business logic services
│   ├── styles/          # Styled components and themes
│   └── utils/           # Utility functions
└── store/               # Redux store
    ├── app/             # App state slice
    └── auth/            # Auth state slice
```

## Technology Stack
- **Framework**: React 19.1.1 with TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2 with React plugin
- **State Management**: Redux Toolkit 2.8.2 with Redux Persist
- **UI Library**: Material-UI 7.3.1 with Emotion styling
- **Forms**: React Hook Form 7.62.0 with Yup validation
- **Maps**: Mapbox GL 3.14.0 with React Map GL
- **HTTP Client**: Axios 1.11.0
- **Routing**: React Router DOM 7.8.1
- **Date Handling**: Date-fns 4.1.0
- **Charts**: Recharts 3.1.2
- **Notifications**: React Toastify 11.0.5

## Architecture Patterns

### Routing Pattern
- Uses React Router DOM with nested routes
- Protected routes with `ProtectedRoute` wrapper
- Routes defined in `src/shared/enums/routes.ts`
- Layout-based routing (AuthLayout, MainLayout)

### State Management Pattern
- Redux Toolkit for global state
- Redux Persist for state persistence
- Separate slices: `app`, `auth`
- Custom hooks: `useAppSelector`
- TypeScript integration with `RootState`, `AppDispatch`

### Component Structure Pattern
- Page components in `/pages` directory
- Layout components in `/layouts` directory
- Shared components and utilities in `/shared`
- Component-specific styles using styled-components pattern
- Form components separate from page components

### Styling Pattern
- Material-UI theme system via `AppTheme.tsx`
- Emotion-based styled-components
- Color system organized in `/shared/colors`
- Reusable style definitions in `/shared/styles`

### API Integration Pattern
- Axios-based HTTP client
- API modules organized in `/shared/http/sompo-api`
- Separate modules for different API domains (auth, etc.)

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Workflow
When making changes, ensure code quality by running:
```bash
npm run lint
npm run build
```

## Path Resolution
- Uses `vite-tsconfig-paths` for path aliases
- Supports `@/` import alias for src directory

## Key Features
- Multi-layout system (Auth/Main)
- Responsive sidebar navigation
- Map integration with Mapbox
- Form validation with Yup
- State persistence
- TypeScript strict mode
- ESLint configuration