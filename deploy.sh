#!/bin/bash

# Deploy script for Quizock to GitHub Pages
echo "🚀 Starting deployment process..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

# Copy built files to root for GitHub Pages
echo "📁 Copying built files to root..."
cp -r dist/* .

# Add and commit changes
echo "💾 Committing changes..."
git add .
git commit -m "🚀 Deploy updated build to GitHub Pages"

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete! Your site should be updated in a few minutes."
echo "🌐 Visit: https://piyushiitk24.github.io/Quizock/"
