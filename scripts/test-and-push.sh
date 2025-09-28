#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Running linter...${NC}"
if ! npm run lint; then
    echo -e "${RED}❌ Linting failed. Please fix the issues before pushing.${NC}"
    exit 1
fi

echo -e "${YELLOW}🧪 Running tests...${NC}"
if ! npm test -- --passWithNoTests; then
    echo -e "${RED}❌ Tests failed. Please fix the issues before pushing.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All checks passed!${NC}"

# Get the current branch name
branch=$(git rev-parse --abbrev-ref HEAD)

echo -e "${YELLOW}🚀 Pushing to $branch...${NC}"
if git push origin "$branch"; then
    echo -e "${GREEN}✅ Successfully pushed to $branch!${NC}"
else
    echo -e "${RED}❌ Failed to push to $branch${NC}"
    exit 1
fi
