#!/bin/bash

# Simple script to run Storybook
echo "🚀 Starting Storybook for Im Reading Here..."
echo "📚 Your component library will be available at: http://localhost:6006"
echo ""

cd apps/web && pnpm storybook
