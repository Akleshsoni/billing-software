#!/bin/bash

# Billing Tracker Deployment Script
set -e

echo "🚀 Starting deployment process..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Built files location:"
echo "   - Server: dist/index.js"
echo "   - Frontend: dist/public/"

echo ""
echo "🎯 Next steps:"
echo "1. Test locally: npm start"
echo "2. Deploy to your preferred platform:"
echo "   - Railway: railway up"
echo "   - Vercel: vercel"
echo "   - Render: Connect GitHub repo"
echo "   - Docker: docker build -t billing-tracker ."
echo ""
echo "📖 See DEPLOYMENT.md for detailed platform instructions"

# Optional: Start the server for testing
read -p "🔄 Start the server locally for testing? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Starting server on http://localhost:5000"
    NODE_ENV=production npm start
fi