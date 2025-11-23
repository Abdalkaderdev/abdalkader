#!/bin/bash
set -e

# Install the correct pnpm version
echo "Installing pnpm 8.15.0..."
npm install -g pnpm@8.15.0

# Update PATH to use the new pnpm
export PATH="$(npm config get prefix)/bin:$PATH"

# Verify pnpm version
echo "Verifying pnpm version..."
which pnpm
pnpm -v

# Install dependencies with frozen lockfile
echo "Installing dependencies..."
pnpm install