# Design System

This document outlines the shared design system used across the web and mobile applications.

## Overview

The design system is centralized in the `@im-reading-here/shared` package to ensure consistency across platforms and prevent drift between applications.

## Tailwind Configuration

### Usage

**Web App:**
```javascript
// apps/web/tailwind.config.js
const { createWebConfig } = require('@im-reading-here/shared/tailwind.config.js')
module.exports = createWebConfig()
```

**Mobile App:**
```javascript
// apps/mobile/tailwind.config.js
const { createMobileConfig } = require('@im-reading-here/shared/tailwind.config.js')
module.exports = createMobileConfig()
```

### Differences

- **Web**: Uses CSS variables for theming support (light/dark mode)
- **Mobile**: Uses direct color values for React Native compatibility

## Design Tokens

### Colors

#### Primary Colors
- **Primary**: Purple/Indigo theme for main actions and branding
- **Secondary**: Purple variants for secondary actions
- **Neutral**: Grayscale for text, borders, and backgrounds

#### Semantic Colors
- **Success**: Green tones for positive actions
- **Warning**: Amber/orange for warnings
- **Danger**: Red tones for destructive actions

#### Usage in Code

```typescript
import { colors } from '@im-reading-here/shared'

// In JavaScript/TypeScript
const primaryColor = colors.primary[600] // '#5b21b6'

// In Tailwind classes
className="bg-primary-600 text-white"
```

### Spacing

Consistent spacing scale following Tailwind's default scale:
- `0` → `0px`
- `1` → `0.25rem` (4px)
- `2` → `0.5rem` (8px)
- `4` → `1rem` (16px)
- `8` → `2rem` (32px)

### Typography

- **Font Family**: Inter (fallback to system fonts)
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- **Font Weights**: thin, light, normal, medium, semibold, bold, extrabold, black

## Component Patterns

### Buttons

#### Primary Button
```tsx
// Web & Mobile
<TouchableOpacity className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg">
  <Text className="text-white font-semibold">Primary Action</Text>
</TouchableOpacity>
```

#### Secondary Button
```tsx
<TouchableOpacity className="border border-neutral-300 text-neutral-700 font-semibold py-3 px-4 rounded-lg">
  <Text className="text-neutral-700 font-semibold">Secondary Action</Text>
</TouchableOpacity>
```

### Input Fields
```tsx
<TextInput className="bg-white border border-neutral-300 rounded-lg px-4 py-3 text-base" />
```

### Cards
```tsx
<View className="bg-white rounded-lg border border-neutral-200 p-4">
  {/* Card content */}
</View>
```

## Platform-Specific Considerations

### Web
- Supports CSS variables for theming
- Includes hover states and transitions
- Uses `tailwindcss-animate` plugin for animations

### Mobile
- Uses direct color values (no CSS variables)
- Focus on touch-friendly sizing
- Platform-specific components (SafeAreaView, etc.)

## Extending the Design System

### Adding New Colors
1. Add to `packages/shared/tailwind.config.js`
2. Add to `packages/shared/src/design-tokens.ts`
3. Document usage patterns

### Adding New Components
1. Create shared utility functions if needed
2. Document platform-specific implementations
3. Add examples to this documentation

## Best Practices

1. **Always use the shared Tailwind config** - Never duplicate color definitions
2. **Use semantic color names** - `text-primary-600` not `text-purple-600`
3. **Consistent spacing** - Use the spacing scale for margins, padding, gaps
4. **Mobile-first approach** - Design for mobile, enhance for web
5. **Accessibility** - Ensure sufficient color contrast (WCAG AA compliance)

## Migration

If you need to migrate existing styles:

1. Replace hard-coded colors with design token classes
2. Use consistent spacing values
3. Replace custom animations with Tailwind utilities
4. Test on both web and mobile platforms

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
