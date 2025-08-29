# I'm Reading Here — Design Basis

This file defines the visual language, design tokens, and implementation guidance for the Book Club application across web (Next.js + Tailwind) and mobile (Expo/React Native). Save as DESIGN_BASIS.md. Treat this as a living source of truth.

⸻

1. Design Principles

- Clarity first: each screen should make the primary action unmistakable.
- Accessibility always: meet or exceed WCAG AA; support reduced motion.
- Consistency over cleverness: reuse patterns; one way to do common things.
- Delight in details: micro-interactions (hover, focus, vote feedback) add polish.
- Mobile-first: thumb-friendly targets; progressive enhancement to desktop.
- Dark-mode ready: parity across light/dark with semantic tokens.

⸻

2. Tailwind Color Palette (Full Scales + Semantic Aliases)

We alias Tailwind’s official scales so all 50–950 shades are available without maintaining hex values. Surfaces/text/borders are exposed as CSS variables for theming.

2.1 Tailwind Config

tailwind.config.ts

import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './apps/web/**/*.{ts,tsx,js,jsx,mdx}',
    './packages/ui/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic aliases → full shade ramps (50–950)
        primary: colors.indigo,   // brand
        secondary: colors.violet, // supporting brand
        neutral: colors.zinc,     // UI chrome
        success: colors.green,
        warning: colors.amber,
        danger: colors.red,
        info: colors.blue,
        accent: colors.pink,      // sparing highlights

        // Surface & text tokens (CSS variables for theming)
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--surface-muted)',
          inverted: 'var(--surface-inverted)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          inverted: 'var(--text-inverted)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        DEFAULT: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 15px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
} satisfies Config

2.2 CSS Variables for Theming

apps/web/app/globals.css (or global stylesheet)

:root {
  /* Surfaces */
  --surface:            theme(colors.white);
  --surface-muted:      theme(colors.zinc.50);
  --surface-inverted:   theme(colors.zinc.900);

  /* Text */
  --text:               theme(colors.zinc.900);
  --text-muted:         theme(colors.zinc.600);
  --text-inverted:      theme(colors.zinc.50);

  /* Borders */
  --border:             theme(colors.zinc.200);
  --border-strong:      theme(colors.zinc.300);
}

.dark, [data-theme="dark"] {
  --surface:            theme(colors.zinc.900);
  --surface-muted:      theme(colors.zinc.800);
  --surface-inverted:   theme(colors.white);

  --text:               theme(colors.zinc.50);
  --text-muted:         theme(colors.zinc.400);
  --text-inverted:      theme(colors.zinc.900);

  --border:             theme(colors.zinc.700);
  --border-strong:      theme(colors.zinc.600);
}

2.3 Usage Examples

<!-- Primary CTA -->
<button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">
  Create club
</button>

<!-- Muted card -->
<div class="bg-surface border border-border rounded-lg p-4">
  <h3 class="text-neutral-900 dark:text-neutral-50">Next meeting</h3>
  <p class="text-text-muted">Thu 7pm (EST)</p>
</div>

<!-- Alerts -->
<div class="rounded-md border border-success-300 bg-success-50 text-success-800 p-4">
  Book added to your TBR.
</div>
<div class="rounded-md border border-warning-300 bg-warning-50 text-warning-800 p-4">
  Poll closes in 2 hours.
</div>
<div class="rounded-md border border-danger-300 bg-danger-50 text-danger-800 p-4">
  You’ve reached your free club limit.
</div>

Rule of thumb

- CTAs: primary-600 → hover -700 → active -800
- Destructive: danger-600/700
- Info/success/warning backgrounds: _-50 with borders _-300 and text \*-800

⸻

3. Core Tokens

3.1 Typography

- Families: UI → font-sans (Inter); Long-form content → font-serif (Merriweather).
- Sizes:
- text-xs 12px
- text-sm 14px
- text-base 16px
- text-lg 20px
- text-xl 24px
- text-2xl 32px
- Weights: font-normal (400), font-medium (500), font-bold (700)
- Line-height: use Tailwind defaults; increase for long reviews (leading-relaxed).

  3.2 Spacing (4px scale)

- Use Tailwind spacing (p-2, px-4, gap-6, etc.).
  Key steps: 4, 8, 12, 16, 24, 32, 48.

  3.3 Radius & Elevation

- Radius: rounded-md (8px) default; Cards/Modals rounded-lg–rounded-2xl.
- Shadows: prefer shadow for cards; reduce shadows in dark mode and rely on borders.

  3.4 Motion

- Duration: 150–200ms for hover/focus; 250–300ms for panel transitions.
- Easing: ease-out for entry; ease-in for exit.
- Respect prefers-reduced-motion.

⸻

4. Component Guidelines (Web)

4.1 Buttons

- Primary: bg-primary-600 hover:bg-primary-700 text-white
- Secondary: bg-surface border border-border text-primary-700 hover:bg-neutral-50 dark:hover:bg-neutral-800
- Ghost: text-primary-700 hover:bg-primary-50 dark:hover:bg-neutral-800
- Sizes: h-10 px-4 (md), h-12 px-5 (lg). Minimum touch target 44px on mobile.

  4.2 Inputs

- Base: bg-surface text-text placeholder:text-text-muted border border-border rounded-md h-10 px-3
- Focus: focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
- Error: add border-danger-500 and hint text text-danger-700.

  4.3 Cards

- Base: bg-surface border border-border rounded-lg shadow-sm
- Use gap-4 inside with consistent padding p-4–p-6.

  4.4 Navigation

- Mobile: bottom nav (max 5 items), icon (24px) + label (text-xs).
- Web: left sidebar + topbar. Use active indicator text-primary-700 and border-l-2 border-primary-600.

  4.5 Feedback States

- Loading: skeletons (animate-pulse) over spinners where possible.
- Empty: icon + concise copy + primary CTA.
- Errors: text-danger-700 + recovery action.

⸻

5. Accessibility

- Contrast: body text on surface ≥ 4.5:1; large text ≥ 3:1.
- Focus: always visible; Tailwind focus:ring-2 focus:ring-primary-500.
- Color: never rely on color alone; pair with icon/text.
- Semantics: use native elements (button, a, label, input) and ARIA only when necessary.
- Motion: reduce/transitions off when prefers-reduced-motion.

⸻

6. Dark Mode

- Toggle via <html class="dark"> or [data-theme="dark"].
- Prefer borders to heavy shadows.
- Avoid highly saturated large fills; use \*-300–500 sparingly.
- Validate contrast on key components (buttons, inputs, alerts).

⸻

7. Patterns & Layouts

- Grid: use CSS grid for shelves and club lists (grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6).
- Responsive: start mobile-first; layer up at md and lg.
- Density: increase spacing at larger breakpoints to avoid crowding.

⸻

8. RN/Expo Mapping (High-Level)

- Create a thin token map in packages/ui to mirror Tailwind tokens for RN:
- Colors: export semantic tokens (primary.600, text.muted, surface) via JS object.
- Spacing: export numeric scale {1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48}.
- Radii/shadows: provide equivalents (Android elevation + iOS shadow).
- Avoid pixel-perfect parity; prioritize semantics and accessibility.

⸻

9. Example Snippets

9.1 Meeting Card (Web)

<article class="bg-surface border border-border rounded-lg p-4 shadow-sm">
  <header class="flex items-center justify-between">
    <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-50">August Meeting</h3>
    <span class="inline-flex items-center rounded-full bg-info-50 text-info-800 border border-info-300 px-2 py-0.5 text-xs">
      Virtual
    </span>
  </header>
  <p class="mt-1 text-text-muted">Thu, 7:00 PM — Reading: Dune (Ch. 1–5)</p>
  <footer class="mt-4 flex gap-2">
    <button class="bg-primary-600 hover:bg-primary-700 text-white h-10 px-4 rounded-md">RSVP</button>
    <button class="text-primary-700 hover:bg-primary-50 h-10 px-4 rounded-md">Details</button>
  </footer>
</article>

9.2 Alert Variants

<div class="rounded-md border border-success-300 bg-success-50 text-success-800 p-4">Success</div>
<div class="rounded-md border border-warning-300 bg-warning-50 text-warning-800 p-4">Warning</div>
<div class="rounded-md border border-danger-300 bg-danger-50 text-danger-800 p-4">Error</div>
<div class="rounded-md border border-info-300 bg-info-50 text-info-800 p-4">Info</div>

⸻

10. Do / Don’t

Do

- Use semantic aliases (primary, danger, neutral) in app code.
- Use surface/text/border vars for layout backgrounds and content color.
- Use consistent spacing and radius across components.
- Check contrast for light and dark themes.

Don’t

- Hardcode hex values or random Tailwind families for app UIs.
- Use color alone to signal state.
- Overuse heavy shadows, especially in dark mode.
- Shrink tap targets below 44px height.

⸻

11. Component Development with Storybook

This project uses Storybook for isolated component development and testing. All UI components should include comprehensive stories that cover:

**Required Story Types:**

- Default: Basic component with minimal props
- All Variants: Every variant/state combination
- Interactive: With callbacks and state changes
- Edge Cases: Long text, missing data, error states

**Storybook Configuration:**

- Auto-generated documentation from JSDoc comments
- Accessibility testing with @storybook/addon-a11y
- Dark/light theme switching
- Responsive viewport testing
- Interactive controls for real-time prop editing

**Story Structure Example:**

    import type { Meta, StoryObj } from '@storybook/nextjs-vite'
    import { BookCard } from './book-card'

    const meta: Meta<typeof BookCard> = {
      title: 'Components/BookCard',
      component: BookCard,
      parameters: { layout: 'centered' },
      tags: ['autodocs'],
    }

    export const Default: Story = {
      args: { title: 'Dune', authors: ['Frank Herbert'] }
    }

**Development Workflow:**

1. Start Storybook: `pnpm storybook`
2. Develop component in isolation
3. Test all variants and states
4. Verify accessibility compliance
5. Check responsive behavior
6. Test dark/light themes

⸻

12. shadcn/ui Integration

Components use shadcn/ui built on Radix UI primitives with consistent styling:

**Core Components Available:**

- Button: Multiple variants with consistent sizing
- Card: Structured content containers
- Badge: Status indicators and labels
- Avatar: User profile images with fallbacks
- Separator: Visual content dividers

**Component Patterns:**

- Use forwardRef for all interactive components
- Apply cn() utility for className merging
- Implement proper TypeScript interfaces
- Include proper accessibility attributes

**Adding New Components:**

    # Add new shadcn/ui component
    npx shadcn-ui@latest add [component-name]

**Custom Component Structure:**

    import { cn } from "@/lib/utils"
    import { forwardRef } from "react"

    interface ComponentProps {
      // Define props with proper TypeScript
    }

    const Component = forwardRef<HTMLDivElement, ComponentProps>(
      ({ className, ...props }, ref) => {
        return (
          <div
            ref={ref}
            className={cn("base-styles", className)}
            {...props}
          />
        )
      }
    )

⸻

13. Optional: Custom Brand Ramp

If a custom brand hue is required instead of indigo, define a full ramp and keep the semantic alias:

// tailwind.config.ts (partial)
extend: {
  colors: {
    primary: {
      50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',
      500:'#6366f1',600:'#5458e6',700:'#4446c9',800:'#3738a5',900:'#2e2f88',950:'#1c1d58'
    }
  }
}

⸻

12. Developer Checklist

- Use semantic color aliases and CSS variables (no hex in components).
- Provide visible focus states (focus:ring-2).
- Maintain min tap target 44px.
- Validate contrast AA for light/dark.
- Prefer skeletons over spinners for loading.
- Respect prefers-reduced-motion.

⸻

13) Centralized Design System Implementation

The design system is centralized in the `@im-reading-here/shared` package to ensure consistency across platforms and prevent drift between applications.

13.1 Shared Tailwind Configuration

Web App Configuration:

    // apps/web/tailwind.config.js
    const { createWebConfig } = require('@im-reading-here/shared/tailwind.config.js')
    module.exports = createWebConfig()

Mobile App Configuration:

    // apps/mobile/tailwind.config.js
    const { createMobileConfig } = require('@im-reading-here/shared/tailwind.config.js')
    module.exports = createMobileConfig()

Key Differences:

- Web: Uses CSS variables for theming support (light/dark mode)
- Mobile: Uses direct color values for React Native/NativeWind compatibility

13.2 Design Tokens Export

Access design tokens programmatically for custom components:

    import { colors, spacing, borderRadius } from '@im-reading-here/shared'

    // In JavaScript/TypeScript
    const primaryColor = colors.primary[600] // '#5b21b6'
    const cardPadding = spacing[4] // '1rem'
    const cardRadius = borderRadius.lg // '0.5rem'

    // In Tailwind classes
    className="bg-primary-600 text-white p-4 rounded-lg"

13.3 Component Patterns for Cross-Platform

Primary Button (Web & Mobile):

    <TouchableOpacity className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg">
      <Text className="text-white font-semibold">Primary Action</Text>
    </TouchableOpacity>

Secondary Button:

    <TouchableOpacity className="border border-neutral-300 text-neutral-700 font-semibold py-3 px-4 rounded-lg">
      <Text className="text-neutral-700 font-semibold">Secondary Action</Text>
    </TouchableOpacity>

Input Fields:

    <TextInput className="bg-white border border-neutral-300 rounded-lg px-4 py-3 text-base" />

Cards:

    <View className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
      {/* Card content */}
    </View>

13.4 Platform-Specific Considerations

Web:

- Supports CSS variables for theming
- Includes hover states and transitions
- Uses `tailwindcss-animate` plugin for animations

Mobile:

- Uses direct color values (no CSS variables)
- Focus on touch-friendly sizing (minimum 44px targets)
- Platform-specific components (SafeAreaView, KeyboardAvoidingView)

13.5 Design System Best Practices

1. Always use the shared Tailwind config - Never duplicate color definitions across apps
2. Use semantic color names - `text-primary-600` not `text-purple-600`
3. Consistent spacing - Use the spacing scale (4px increments) for margins, padding, gaps
4. Mobile-first approach - Design for mobile, enhance for web
5. Accessibility - Ensure sufficient color contrast (WCAG AA compliance)

13.6 Extending the Design System

Adding New Colors:

1. Add to `packages/shared/tailwind.config.js`
2. Add to `packages/shared/src/design-tokens.ts`
3. Document usage patterns in this file

Adding New Components:

1. Create shared utility functions if needed
2. Document platform-specific implementations
3. Add examples to this documentation

13.7 Migration Guide

When updating existing styles:

1. Replace hard-coded colors with design token classes
2. Use consistent spacing values from the scale
3. Replace custom animations with Tailwind utilities
4. Test on both web and mobile platforms
5. Verify accessibility compliance

### Platform-Specific Considerations

**Web:**

- Supports CSS variables for theming
- Includes hover states and transitions
- Uses `tailwindcss-animate` plugin for animations

**Mobile:**

- Uses direct color values (no CSS variables)
- Focus on touch-friendly sizing (minimum 44px targets)
- Platform-specific components (SafeAreaView, KeyboardAvoidingView)

### Design System Best Practices

1. **Always use the shared Tailwind config** - Never duplicate color definitions across apps
2. **Use semantic color names** - `text-primary-600` not `text-purple-600`
3. **Consistent spacing** - Use the spacing scale (4px increments) for margins, padding, gaps
4. **Mobile-first approach** - Design for mobile, enhance for web
5. **Accessibility** - Ensure sufficient color contrast (WCAG AA compliance)

### Extending the Design System

**Adding New Colors:**

1. Add to `packages/shared/tailwind.config.js`
2. Add to `packages/shared/src/design-tokens.ts`
3. Document usage patterns in this file

**Adding New Components:**

1. Create shared utility functions if needed
2. Document platform-specific implementations
3. Add examples to this documentation

### Migration Guide

When updating existing styles:

1. Replace hard-coded colors with design token classes
2. Use consistent spacing values from the scale
3. Replace custom animations with Tailwind utilities
4. Test on both web and mobile platforms
5. Verify accessibility compliance

⸻

14) Quick Reference (Common Classes)

- Primary button: bg-primary-600 hover:bg-primary-700 text-white
- Secondary button: bg-surface border border-border text-primary-700
- Ghost button: text-primary-700 hover:bg-primary-50
- Input: bg-surface text-text border border-border focus:ring-2 focus:ring-primary-500
- Card: bg-surface border border-border rounded-lg shadow
- Section heading: text-neutral-900 dark:text-neutral-50 font-medium
- Muted text: text-text-muted
- Divider: border-t border-border
