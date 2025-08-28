# 🚀 Running Storybook - Multiple Ways

Your Storybook component library is super easy to start. Pick your favorite method:

## 🎯 Super Quick Commands

From anywhere in the project root:

```bash
# Any of these work:
pnpm storybook    # Full command
pnpm sb          # Short version
pnpm story       # Descriptive
pnpm ui          # UI focused
```

## 🔧 VS Code Integration

1. **Command Palette**:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Tasks: Run Task"
   - Select "Start Storybook"

2. **Terminal Menu**:
   - Go to `Terminal > Run Task...`
   - Select "Start Storybook"

## 📜 Shell Script

From the project root:

```bash
./start-storybook.sh
```

## 📱 Direct Access

If you're already in the web app:

```bash
cd apps/web
pnpm storybook
```

## 🌐 Access Your Components

Once started, visit: **<http://localhost:6006>**

### 📚 Current Component Library

**Book Club Components:**

- 📖 **BookCard** - Book display with ratings, shelves, and actions
- 🏛️ **ClubCard** - Club information with members and meetings
- 📅 **MeetingCard** - Meeting details with RSVP functionality

**UI Primitives (shadcn/ui):**

- 🔘 **Button** - Multiple variants and sizes for all interaction needs
- 🗃️ **Card** - Structured content containers with headers and footers
- 🏷️ **Badge** - Status indicators and category labels
- 👤 **Avatar** - User profile images with fallback initials
- ➖ **Separator** - Visual content dividers

## 🎨 Features Available

- 🌙 **Dark/Light Theme Toggle** - Test components in both modes
- 📱 **Responsive Previews** - Mobile, tablet, desktop viewports
- ♿ **Accessibility Checks** - Built-in a11y testing with WCAG compliance
- 🎮 **Interactive Controls** - Modify props in real-time
- 📚 **Auto-generated Docs** - Component documentation from JSDoc
- 🧪 **Component Testing** - Isolated testing environment
- 🎯 **Story Variants** - Test all component states and edge cases

## 🛠️ Development Workflow

1. **Start Storybook**: `pnpm storybook`
2. **Develop in Isolation**: Create components without app context
3. **Test All States**: Use story variants to cover edge cases
4. **Check Accessibility**: Use built-in a11y addon
5. **Verify Responsiveness**: Test across device sizes
6. **Document Components**: Auto-generated docs from code

## 📖 Story Structure

Each component includes comprehensive stories:

- **Default**: Basic component usage
- **All Variants**: Every visual variant
- **Interactive**: Components with callbacks
- **Edge Cases**: Long text, empty states, error handling
- **Responsive**: Behavior across screen sizes

## 🔧 Building for Production

```bash
# Build static Storybook for deployment
pnpm build-storybook
```

The built Storybook will be in `storybook-static/` and can be deployed as a static site.

---

**Pro Tip**: Keep Storybook running while developing - it auto-reloads when you make changes to your components! 🔄

**Need Help?** Check out the [Component Development Guide](./docs/component-development.md) for detailed instructions on creating and testing components.
