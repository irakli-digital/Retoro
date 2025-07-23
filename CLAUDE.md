# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

### Package Management
This project uses npm as the package manager. Always use `npm` instead of `pnpm` or `yarn`.

## Architecture

### Tech Stack
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui components (Radix UI primitives + Tailwind)
- **Theme**: Dark mode by default with next-themes for theme management
- **Forms**: react-hook-form with zod validation
- **Icons**: lucide-react

### Project Structure
- `/app` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with theme provider, dark mode enforced
  - `page.tsx` - Landing page (client-side component)
  - `/privacy`, `/terms`, `/refund-policy` - Legal pages
- `/components` - React components
  - `/ui` - shadcn/ui components (auto-generated, don't modify directly)
  - `header.tsx`, `footer.tsx` - Shared layout components
  - `theme-provider.tsx` - Next-themes wrapper
- `/lib` - Utility functions
  - `utils.ts` - Contains `cn()` helper for className merging
- `/hooks` - Custom React hooks
- `/styles` - Global CSS (imported in app/globals.css)
- `/public` - Static assets

### Key Patterns
1. **Path Aliases**: Use `@/` prefix for imports (maps to project root)
2. **Component Styling**: Use `cn()` from `@/lib/utils` to merge Tailwind classes
3. **Client Components**: Mark with `"use client"` directive when using browser APIs or interactivity
4. **Theme**: Application is set to dark mode only, enforced in layout.tsx
5. **Animations**: Framer Motion is available for animations

### Important Configuration
- TypeScript paths are configured with `@/*` alias
- shadcn/ui configuration in `components.json`
- Tailwind configuration includes animation utilities
- Next.js configured with default settings in `next.config.mjs`

### Language
The application is in Georgian (ka) language, targeting the Georgian market (Mypen.ge).