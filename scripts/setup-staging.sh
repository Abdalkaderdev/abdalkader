#!/bin/bash

# Staging Environment Setup Script
# This script helps developers set up and verify the staging environment

set -e

echo "🚀 Abdalkader Web Ecosystem - Staging Environment Setup"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're on the develop branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    print_warning "You're not on the develop branch. Switching to develop..."
    git checkout develop
    git pull origin develop
    print_status "Switched to develop branch"
else
    print_status "Already on develop branch"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    pnpm install
    print_status "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Build UI library
print_info "Building UI library..."
pnpm --filter @abdalkader/ui build
print_status "UI library built successfully"

# Check if staging environment variables are set
print_info "Checking environment configuration..."

# Create .env.local for staging if it doesn't exist
if [ ! -f "apps/portfolio/.env.local" ]; then
    print_info "Creating staging environment configuration..."
    cat > apps/portfolio/.env.local << EOF
# Staging Environment Configuration
NODE_ENV=staging
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_ENABLE_FEATURE_FLAGS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
NEXT_PUBLIC_VERBOSE_ERRORS=true
NEXT_PUBLIC_BUILD_ID=$(date +%s)
EOF
    print_status "Environment configuration created"
else
    print_status "Environment configuration already exists"
fi

# Test build
print_info "Testing portfolio build..."
pnpm turbo run build --filter=@abdalkader/portfolio
print_status "Portfolio build successful"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel@latest
    print_status "Vercel CLI installed"
else
    print_status "Vercel CLI is available"
fi

# Verify staging URLs
print_info "Verifying staging environment URLs..."

urls=(
    "https://dev.abdalkader.dev"
    "https://abdalkader.dev"
    "https://docs.abdalkader.dev"
)

for url in "${urls[@]}"; do
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        print_status "$url is accessible"
    else
        print_warning "$url may not be accessible (this is normal if not deployed yet)"
    fi
done

# Display staging dashboard info
echo ""
echo "🔧 Staging Dashboard"
echo "==================="
print_info "The staging dashboard will be available at https://dev.abdalkader.dev"
print_info "Look for the 🔧 icon in the top-right corner when in staging environment"

# Display feature flags info
echo ""
echo "🚩 Feature Flags"
echo "==============="
print_info "Feature flags are enabled in staging environment"
print_info "Available flags: newContactForm, enhancedAnimations, darkModeToggle, aiChatbot, etc."

# Display deployment workflow
echo ""
echo "🚀 Deployment Workflow"
echo "====================="
print_info "develop branch → dev.abdalkader.dev (Staging)"
print_info "main branch → abdalkader.dev (Production)"
print_info "components branch → docs.abdalkader.dev (Storybook)"

# Display useful commands
echo ""
echo "📋 Useful Commands"
echo "=================="
echo "Start development server:"
echo "  pnpm dev"
echo ""
echo "Build for staging:"
echo "  pnpm turbo run build --filter=@abdalkader/portfolio"
echo ""
echo "Deploy to staging (via git):"
echo "  git add . && git commit -m 'feat: new feature' && git push origin develop"
echo ""
echo "Check staging health:"
echo "  curl https://dev.abdalkader.dev/api/health"
echo ""
echo "View feature flags:"
echo "  curl https://dev.abdalkader.dev/api/staging/feature-flags"

# Final status
echo ""
echo "🎉 Staging Environment Setup Complete!"
echo "======================================"
print_status "Environment: Staging"
print_status "Branch: develop"
print_status "Build: Ready"
print_status "Monitoring: Enabled"
print_status "Feature Flags: Active"

echo ""
print_info "You can now start developing with:"
print_info "  pnpm dev"
echo ""
print_info "Push to develop branch to deploy to staging:"
print_info "  git push origin develop"
echo ""
print_info "For more information, see: STAGING_ENVIRONMENT_SETUP.md"