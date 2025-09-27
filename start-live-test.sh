#!/bin/bash

# Start Live API Testing Script
# This script ensures the environment is set up for live API testing

echo "🚀 Starting Live API Testing Environment"
echo "========================================"

# Set environment variables for live API testing
export VITE_USE_MOCK_AUTH=false
export VITE_API_BASE_URL=https://futeur.app

echo "✅ Environment variables set:"
echo "   VITE_USE_MOCK_AUTH=false"
echo "   VITE_API_BASE_URL=https://futeur.app"
echo ""

echo "🔧 Starting Vite development server with live API proxy..."
echo "📍 Test page will be available at: http://localhost:8083/auth-test"
echo ""

# Start the development server
npm run dev
