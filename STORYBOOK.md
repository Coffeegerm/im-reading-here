# 🚀 Running Storybook - Multiple Ways!

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

Once started, visit: **http://localhost:6006**

You'll see your book club components:
- 📖 **BookCard** - Book display with ratings, shelves, actions
- 🏛️ **ClubCard** - Club information with members and meetings
- 📅 **MeetingCard** - Meeting details with RSVP functionality

## 🎨 Features Available

- 🌙 **Dark/Light Theme Toggle** - Test components in both modes
- 📱 **Responsive Previews** - Mobile, tablet, desktop viewports
- ♿ **Accessibility Checks** - Built-in a11y testing
- 🎮 **Interactive Controls** - Modify props in real-time
- 📚 **Auto-generated Docs** - Component documentation

---

**Pro Tip**: Keep Storybook running while developing - it auto-reloads when you make changes to your components! 🔄
