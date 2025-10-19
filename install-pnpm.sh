#!/bin/bash
set -e

# Install the correct pnpm version
echo "Installing pnpm 8.15.0..."
npm install -g pnpm@8.15.0

# Verify pnpm version
echo "Verifying pnpm version..."
pnpm -v

# Install dependencies
echo "Installing dependencies..."
pnpm install --no-frozen-lockfile