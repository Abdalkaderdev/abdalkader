#!/bin/bash

# Vercel Deployment Script for Abdalkader Apps
# This script helps deploy all apps to Vercel with proper configuration

set -e

echo "🚀 Starting Vercel deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_error "Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

print_success "Vercel CLI is ready"

# Function to deploy an app
deploy_app() {
    local app_name=$1
    local app_path=$2
    local framework=$3
    local output_dir=$4
    
    print_status "Deploying $app_name..."
    
    cd "$app_path"
    
    # Create or update vercel.json
    cat > vercel.json << EOF
{
  "buildCommand": "pnpm build",
  "outputDirectory": "$output_dir",
  "framework": "$framework",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
EOF
    
    # Deploy to Vercel
    if vercel --prod --yes; then
        print_success "$app_name deployed successfully"
    else
        print_error "Failed to deploy $app_name"
        return 1
    fi
    
    cd - > /dev/null
}

# Deploy all apps
print_status "Deploying all applications..."

# Portfolio
deploy_app "Portfolio" "apps/portfolio" "nextjs" ".next"

# Blog
deploy_app "Blog" "apps/blog" "hexo" "public"

# Docs
deploy_app "Docs" "apps/docs" "docusaurus" ".mintlify"

# Storybook
deploy_app "Storybook" "apps/storybook" "other" "storybook-static"

print_success "All apps deployed! 🎉"

echo ""
echo "📋 Next steps:"
echo "1. Go to Vercel dashboard to configure custom domains"
echo "2. Add domains: abdalkader.dev, blog.abdalkader.dev, docs.abdalkader.dev, components.abdalkader.dev"
echo "3. Update DNS records as shown in Vercel dashboard"
echo "4. Test all apps and cross-app navigation"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "📖 Full Guide: See VERCEL_DEPLOYMENT_GUIDE.md"