#!/bin/bash

# Merath Test Runner
# Runs all tests with coverage and generates reports

echo "🧪 Merath Test Suite - Comprehensive Testing"
echo "============================================"
echo ""

# Set colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run test suite
run_tests() {
  local suite=$1
  echo -e "${BLUE}Running $suite tests...${NC}"
  
  case $suite in
    "unit")
      vitest run __tests__/inheritance.test.ts __tests__/fraction.test.ts
      ;;
    "hooks")
      vitest run __tests__/hooks.test.ts
      ;;
    "audit")
      vitest run __tests__/audit-log.test.ts __tests__/audit-trail.test.ts
      ;;
    "components")
      vitest run __tests__/components.test.ts
      ;;
    "special")
      vitest run __tests__/special-cases.test.ts
      ;;
    "realworld")
      vitest run __tests__/real-world-scenarios.test.ts
      ;;
    "performance")
      vitest run __tests__/performance.test.ts
      ;;
    "integration")
      vitest run __tests__/integration.test.ts
      ;;
    "all")
      vitest run
      ;;
    *)
      echo -e "${RED}Unknown test suite: $suite${NC}"
      return 1
      ;;
  esac
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $suite tests passed${NC}"
  else
    echo -e "${RED}✗ $suite tests failed${NC}"
    return 1
  fi
}

# Main menu
show_menu() {
  echo ""
  echo "Select test suite to run:"
  echo "1) Unit Tests"
  echo "2) Hooks Tests"
  echo "3) Audit Log Tests"
  echo "4) Components Tests"
  echo "5) Special Cases Tests (New!)"
  echo "6) Real-World Scenarios"
  echo "7) Performance Tests"
  echo "8) Integration Tests"
  echo "9) Run ALL Tests"
  echo "10) Run with Coverage"
  echo "0) Exit"
  echo ""
  read -p "Enter choice [0-10]: " choice
  
  case $choice in
    1) run_tests "unit" ;;
    2) run_tests "hooks" ;;
    3) run_tests "audit" ;;
    4) run_tests "components" ;;
    5) run_tests "special" ;;
    6) run_tests "realworld" ;;
    7) run_tests "performance" ;;
    8) run_tests "integration" ;;
    9) run_tests "all" ;;
    10) 
      echo -e "${YELLOW}Running tests with coverage...${NC}"
      vitest run --coverage
      ;;
    0) exit 0 ;;
    *) echo -e "${RED}Invalid choice${NC}" ;;
  esac
}

# Check if vitest is installed
if ! command -v vitest &> /dev/null; then
  echo -e "${RED}Vitest not found. Installing...${NC}"
  npm install -g vitest
fi

# Main loop
while true; do
  show_menu
done