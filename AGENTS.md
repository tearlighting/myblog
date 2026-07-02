# AGENTS.md

Guidance for future AI agents working in this repository.

## Project Shape

- The active application is `blog-vue3/`.
- The stack is Vue 3 + Vite + TypeScript.
- Use `pnpm` scripts. From the repository root, `pnpm dev:vue3` enters `blog-vue3` and runs Vite.
- `legacy-vue2/` is an older Vue 2 application. Do not copy new implementation patterns from it unless the task explicitly targets the legacy app.

## Vue 3 + Vite + TypeScript Conventions

- Prefer Vue SFCs with `<script setup lang="ts">`.
- Use existing local abstractions before adding new ones:
  - stores from `src/store/`
  - hooks from `src/hooks/`
  - feature-local hooks, stores, and logic under each `src/views/**` feature folder
  - shared helpers from `src/utils/`
- Keep route-level pages thin when the existing pattern does so. Many pages use:
  - `index.vue` as the route/store/loader wrapper
  - `Viewer.vue` or feature components for the actual UI
  - `initializer.ts`, `store/`, `hooks/`, and `logicHooks/` for behavior
- Use the existing `@` alias for `src`.
- Avoid broad refactors, global rewrites, or moving folders unless specifically requested.

## Router Conventions

- Routes are centralized in `blog-vue3/src/router/index.ts`.
- Parent routes usually mount `DefaultLayout` from `src/layout/DefaultLayout.vue`.
- Page components are usually nested as children under the layout route.
- Route metadata commonly includes:
  - `roles`
  - `hidden`
  - `keepAlive`
  - `title` or `titleKey`
  - `icon`
  - `externalLink` for external routes
- Keep names stable. `KeepAlive`, tag views, and menu logic depend on route names and metadata.
- Use `titleKey` for menu text when localized labels exist. Use plain `title` only where the current code already does.

## About Page Location

- The About route already exists at `/about` in `blog-vue3/src/router/index.ts`.
- It resolves to `blog-vue3/src/views/aboutMe/index.vue`.
- Implement About page work inside `blog-vue3/src/views/aboutMe/`.
- Keep `index.vue` as the route-level wrapper with `PageLoader` and `useAboutMeStore`.
- Put production UI in `Viewer.vue` or feature-local components under `src/views/aboutMe/components/`.
- Keep About-specific motion/input/state logic in:
  - `src/views/aboutMe/logicHooks/`
  - `src/views/aboutMe/core/`
  - `src/views/aboutMe/store/`
  - `src/views/aboutMe/utils/`
- `AboutMeDemo.vue` appears to be prototype/demo code. Do not make it the long-term production surface unless the user explicitly asks.

## Theme CSS Variables

- The theme system is managed by `src/core/theme/`.
- Palettes are defined in `src/constants/theme.ts`.
- `generateTheme` in `src/core/theme/utils/index.ts` maps palette fields to CSS variables.
- `ThemeManager` applies variables to `document.documentElement`.
- Prefer existing variables instead of hard-coded colors:
  - `--color-bg`
  - `--color-surface`
  - `--color-border`
  - `--color-text`
  - `--color-muted`
  - `--color-primary`
  - `--color-secondary`
  - `--color-accent`
  - `--surface-0`
  - `--surface-1`
  - `--surface-2`
  - `--divider`
  - `--elevation-1`
  - `--elevation-2`
  - `--btn-*`
  - `--card-*`
  - `--input-*`
- Use `color-mix()` with theme variables for subtle states, borders, glows, and hover effects.
- Do not introduce a second theme system.

## Tailwind v4 Usage

- Tailwind is imported through `src/plugins/tailwindcss/index.css`.
- It is registered from `src/plugins/index.ts` via `addTailwindCSS`.
- Tailwind v4 `@theme` maps design tokens to the CSS variables above.
- Utility classes are common in templates for layout, spacing, sizing, typography, and responsive behavior.
- Theme-aware utilities such as `text-text`, `text-muted`, `bg-primary`, and `bg-surface` come from the Tailwind theme variable mapping.
- Keep `tailwind.config.js` minimal unless a task clearly requires changing Tailwind scanning or theme behavior.

## Scoped Less and Component Styling

- Component styles commonly use `<style lang="less" scoped>`.
- Use role/data attributes for component styling hooks where existing code does:
  - `[role="project-card"]`
  - `[role="page-host"]`
  - `[role="about-me-container"]`
- Keep styles component-local unless the task is explicitly global.
- Shared Less mixins live in `src/core/index.less`, including `.glass-base()` and `.theme-scroller()`.
- Prefer theme variables and local CSS custom properties over hard-coded one-off values.
- When adding animated or interactive UI, use stable dimensions and avoid layout shift.

## Lenis and Scrolling

- Shared Lenis helper: `src/utils/scroller/index.ts`.
- Existing feature pages initialize Lenis locally with explicit `wrapper`, `content`, and `eventsTarget` when needed.
- Do not initialize duplicate global Lenis instances.
- Only add a new Lenis instance when the task is local and explicit, such as a feature-owned scroller or carousel.
- If adding Lenis to a component, make ownership and teardown clear. Avoid hidden app-wide side effects.

## i18n and Multilingual Text

- i18n is wrapped through `LanguageManager` in `src/core/language/`.
- The plugin is registered via `src/plugins/i18n/index.ts`.
- Locale messages live in `src/locale/`.
- Use `useLanguage()` from `src/hooks/useLanguage.ts` for UI translation helpers.
- Use `useLanguageStore` / `useLanguageStoreHooks` when reactive `currentLocale` is needed.
- For route/menu titles, prefer `titleKey` and `getMenuTitle`.
- For translated project/article data, follow the existing pattern: derive translated content from `currentLocale`, falling back to `zh` where appropriate.
- Do not call raw Vue I18n APIs directly in new feature code unless there is a clear reason.

## Project Showcase Components

- Project list route: `src/views/project/projectList/index.vue`.
- Project viewer: `src/views/project/projectList/Viewer.vue`.
- Carousel/showcase track: `src/views/project/projectList/components/ProjectTrack.vue`.
- Individual project card: `src/views/project/projectList/components/ProjectCard.vue`.
- Project carousel input/state logic lives under:
  - `src/views/project/projectList/logicHooks/`
  - `src/views/project/projectList/core/`
  - `src/views/project/projectList/utils/`
  - `src/views/project/projectList/store/`
- Project detail route and viewer live under `src/views/project/projectDetail/`.

## Things Not To Do

- Do not modify `legacy-vue2/` unless the user explicitly asks for legacy work.
- Do not add a new router system or route auto-loader.
- Do not bypass `DefaultLayout` for normal app pages unless the task explicitly requires a full-screen route.
- Do not duplicate global app initialization in individual pages.
- Do not create a parallel theme/token system or hard-code large color palettes in components.
- Do not initialize app-wide Lenis from a page or component.
- Do not replace `LanguageManager` / `useLanguage` with direct ad hoc i18n calls.
- Do not move route names, metadata, or page paths casually; menu, tag view, and keep-alive behavior depend on them.
- Do not make sweeping style rewrites when a scoped component change is enough.
- Do not rely on prototype/demo files as production architecture without confirming intent.
