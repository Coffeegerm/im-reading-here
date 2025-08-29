import { colors, spacing, borderRadius } from '@im-reading-here/shared'

// Test that design tokens are properly exported and accessible
console.log('Design tokens test:')
console.log('Primary color 600:', colors.primary[600])
console.log('Spacing 4:', spacing[4])
console.log('Border radius lg:', borderRadius.lg)

// Type checking test
const primaryColor: string = colors.primary[600]
const mediumSpacing: string = spacing[4]
const largeBorderRadius: string = borderRadius.lg

export { primaryColor, mediumSpacing, largeBorderRadius }
