# Spec: Reusable UI Components

## Goal

Create the base UI component library used across the app. Small, focused components following the design tokens from `docs/ui.md`.

## What to Create

All in `packages/web/src/components/ui/`.

### `Button.tsx`

Props: `variant` (`'primary' | 'secondary' | 'ghost'`), `children`, standard button attrs.

Styling per variant:
- **primary:** `bg-accent text-white hover:bg-accent-hover`
- **secondary:** `bg-[#E5E7EB] text-text-primary hover:bg-[#D1D5DB]` / dark: `bg-divider-dark text-text-dark`
- **ghost:** `bg-transparent hover:bg-sidebar-hover` / dark: `hover:bg-divider-dark`

Common: `h-9 px-3.5 rounded-button text-sm font-medium transition-colors duration-150 cursor-pointer`

### `Input.tsx`

Props: standard input attrs.

Styling: `h-10 w-full rounded-input border border-divider px-3.5 text-base bg-white dark:bg-card-dark dark:border-divider-dark dark:text-text-dark focus:border-accent focus:ring-3 focus:ring-accent-ring outline-none transition-colors`

### `Checkbox.tsx`

Props: `label: string`, `checked: boolean`, `onChange: (checked: boolean) => void`.

Render: native `<input type="checkbox">` with label. Style the checkbox with accent color. Clicking label toggles checkbox.

### `Select.tsx`

Props: `options: { value: string; label: string }[]`, `value: string | null`, `onChange: (value: string) => void`, `placeholder: string`.

Styling: same height/radius/border as Input. Native `<select>` element styled with Tailwind. Include a disabled first option as placeholder.

### `ThemeToggle.tsx`

Props: none (reads from theme store).

Render: a button with Sun icon (light mode) or Moon icon (dark mode) from `lucide-react`. Clicking calls `toggle()` from theme store.

Position: `fixed top-4 right-4 z-50`. Size: 40x40px, rounded-full. Background: `bg-card dark:bg-card-dark`, `shadow-subtle`.

## Key Decisions

- All components accept `className` prop for composition (merged with defaults).
- No forwardRef complexity — simple functional components.
- Icons from lucide-react: `Sun`, `Moon` at size 20, strokeWidth 1.8.
- Dark mode handled via `dark:` variant on every component.

## Verification

- All components render without errors
- Button variants visually distinct
- Input focus ring visible with accent color
- Checkbox toggles on click
- Select shows options from props
- ThemeToggle switches icon on click and toggles dark mode
- All components work in both light and dark mode
