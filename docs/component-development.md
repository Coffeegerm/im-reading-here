# Component Development Guide

This guide covers the component development workflow for the "I'm Reading Here" book club platform, including Storybook usage, shadcn/ui integration, and design system adherence.

## Overview

Our component system is built with:

- **shadcn/ui**: Accessible components built on Radix UI primitives
- **Tailwind CSS**: Utility-first styling with design tokens
- **Storybook**: Isolated development and documentation
- **TypeScript**: Type safety and developer experience
- **Class Variance Authority (CVA)**: Type-safe component variants

## Development Workflow

### 1. Setting Up Development Environment

```bash
# Start the development environment
pnpm dev              # Start Next.js app
pnpm storybook        # Start Storybook (http://localhost:6006)

# Alternative Storybook commands
pnpm sb              # Short version
pnpm story           # Descriptive
pnpm ui              # UI focused
```

### 2. Component Structure

All components should follow this structure:

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Define variants using CVA
const componentVariants = cva(
  "base-classes", // Base styles
  {
    variants: {
      variant: {
        default: "variant-specific-classes",
        secondary: "secondary-variant-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "small-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Component interface
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props specific to component
}

// Component implementation with forwardRef
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Component.displayName = "Component"

export { Component, componentVariants }
```

### 3. Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
# Browse available components
npx shadcn-ui@latest add

# Add specific component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
```

### 4. Storybook Stories

Every component must include comprehensive Storybook stories:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Component } from './component'

const meta: Meta<typeof Component> = {
  title: 'Components/Component',
  component: Component,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief description of component purpose and usage.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
      description: 'Visual variant of the component'
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
      description: 'Size variant of the component'
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Required stories
export const Default: Story = {
  args: {
    children: 'Default component',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Component variant="default">Default</Component>
      <Component variant="secondary">Secondary</Component>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Component size="sm">Small</Component>
      <Component size="default">Default</Component>
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    onClick: () => alert('Clicked!'),
    children: 'Click me',
  },
}

export const EdgeCases: Story = {
  render: () => (
    <div className="space-y-4 max-w-xs">
      <Component>Very long text that might wrap to multiple lines in narrow containers</Component>
      <Component>🎉 Emoji content</Component>
      <Component></Component> {/* Empty content */}
    </div>
  ),
}
```

## Design System Integration

### Color Usage

Use semantic color tokens defined in the design system:

```tsx
// ✅ Good - Use semantic tokens
<Button className="bg-primary-600 hover:bg-primary-700 text-white">
  Primary Action
</Button>

<Card className="bg-surface border border-border">
  <CardContent className="text-text">
    Content with proper contrast
  </CardContent>
</Card>

// ❌ Bad - Direct color values
<Button className="bg-blue-600 hover:bg-blue-700">
  Don't use direct colors
</Button>
```

### Responsive Design

Follow mobile-first responsive patterns:

```tsx
<div className="
  w-full
  p-4
  sm:p-6
  md:max-w-lg
  lg:max-w-xl
">
  Mobile-first responsive component
</div>
```

### Accessibility

Ensure all components meet WCAG AA standards:

```tsx
// Include proper ARIA attributes
<Button
  aria-label="Add book to reading list"
  aria-describedby="tooltip-description"
>
  <PlusIcon aria-hidden="true" />
  Add Book
</Button>

// Maintain proper focus management
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Accessible Dialog</DialogTitle>
    {/* Focusable content */}
  </DialogContent>
</Dialog>
```

## Current Component Library

### Book Club Components

**BookCard**
- Purpose: Display book information with ratings and shelf status
- Variants: Default with optional rating, shelf badges
- Actions: Add to shelf, view details
- Stories: Default, with rating, multiple authors, edge cases

**ClubCard**
- Purpose: Show club information and membership details
- Features: Member count, meeting information, join/leave actions
- Stories: Public club, private club, member view, owner view

**MeetingCard**
- Purpose: Display meeting details with RSVP functionality
- Features: Date/time, location, RSVP status, book information
- Stories: Upcoming meeting, past meeting, virtual meeting, in-person meeting

### UI Primitives (shadcn/ui)

**Button**
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Usage: Primary actions, navigation, form submissions

**Card**
- Components: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Usage: Content containers, information display

**Badge**
- Variants: default, secondary, destructive, outline
- Usage: Status indicators, labels, categories

**Avatar**
- Features: Image with fallback to initials
- Sizes: Multiple size variants
- Usage: User profile displays

**Separator**
- Orientations: horizontal, vertical
- Usage: Visual content division

## Testing Strategy

### Storybook Testing

- **Visual Testing**: All variants and states must be visually testable
- **Accessibility Testing**: Use built-in a11y addon for compliance checking
- **Interaction Testing**: Test user interactions and state changes
- **Responsive Testing**: Verify behavior across viewport sizes

### Component Testing

Use Vitest for unit and integration testing:

```typescript
import { render, screen } from '@testing-library/react'
import { Component } from './component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component>Test content</Component>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<Component variant="secondary">Test</Component>)
    expect(screen.getByText('Test')).toHaveClass('secondary-variant-classes')
  })
})
```

## Best Practices

### Development

1. **Start with Storybook**: Develop components in isolation before integration
2. **Mobile First**: Design and develop for mobile, enhance for desktop
3. **Accessibility First**: Consider screen readers and keyboard navigation
4. **Type Safety**: Use TypeScript interfaces for all props
5. **Documentation**: Include JSDoc comments for component APIs

### Performance

1. **Lazy Loading**: Use dynamic imports for large components
2. **Bundle Size**: Monitor and optimize bundle impact
3. **Memoization**: Use React.memo for expensive re-renders
4. **Image Optimization**: Use Next.js Image component for covers

### Maintenance

1. **Consistent Patterns**: Follow established patterns for new components
2. **Version Control**: Update component versions when making breaking changes
3. **Documentation**: Keep Storybook stories up-to-date with component changes
4. **Testing**: Maintain comprehensive test coverage

## Troubleshooting

### Common Issues

**Storybook not loading components:**
```bash
# Clear Storybook cache
rm -rf node_modules/.cache/storybook
pnpm storybook
```

**shadcn/ui component not found:**
```bash
# Reinstall component
npx shadcn-ui@latest add [component-name] --overwrite
```

**TypeScript errors with variants:**
- Ensure CVA variants are properly typed
- Check that defaultVariants are defined
- Verify VariantProps import is correct

**Accessibility warnings:**
- Use Storybook a11y addon to identify issues
- Ensure proper ARIA attributes
- Test with screen readers

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Class Variance Authority](https://cva.style/)
- [Design Basis](./design-basis.md) - Complete design system documentation
