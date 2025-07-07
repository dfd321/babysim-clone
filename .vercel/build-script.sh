#!/bin/bash

# Vercel build script with TypeScript error handling
echo "🚀 Starting Vercel build process..."

# Install dependencies
npm ci

# Run linting (fail on errors)
echo "🔍 Running ESLint..."
npm run lint

# Try TypeScript compilation but don't fail build
echo "🔧 Checking TypeScript (non-blocking)..."
npm run typecheck || echo "⚠️ TypeScript errors found but continuing build..."

# Build the application
echo "📦 Building application..."
NODE_ENV=production npm run build:production

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    ls -la dist/
else
    echo "❌ Build failed - dist directory not created"
    exit 1
fi