#!/bin/bash

# I'm Reading Here - Setup Script

set -e

echo "🚀 Setting up I'm Reading Here..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is required but not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is required but not running. Please start Docker first."
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🐘 Starting PostgreSQL database..."
docker-compose up -d postgres

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "📄 Setting up API environment..."
if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✅ Created apps/api/.env from template"
    echo "🔧 You may want to edit apps/api/.env with your specific configuration"
fi

echo "🗄️  Generating Prisma client..."
cd apps/api && pnpm db:generate && cd ../..

echo "🔄 Pushing database schema..."
cd apps/api && pnpm db:push && cd ../..

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  pnpm dev"
echo ""
echo "This will start:"
echo "  - API server at http://localhost:3001"
echo "  - Web frontend at http://localhost:3000"
echo "  - API docs at http://localhost:3001/api/docs"
echo ""
echo "To view the database:"
echo "  cd apps/api && pnpm db:studio"
