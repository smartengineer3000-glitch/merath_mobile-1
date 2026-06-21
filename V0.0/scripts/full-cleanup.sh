#!/bin/bash

echo "🧹 Starting comprehensive cleanup..."
echo "================================"

# Step 1: Remove all backup files
echo "📁 Removing backup files..."
find . -name "*.backup" -type f -delete
find . -name "*.bak" -type f -delete
find . -name "*.tmp" -type f -delete
find . -name "*.temp" -type f -delete
echo "✅ Backup files removed"

# Step 2: Remove all script files we created
echo ""
echo "📜 Removing script files..."
rm -vf apply-*.sh
rm -vf continue-*.sh
rm -vf step*-*.sh
rm -vf fix-*.sh
rm -vf fix-*.mjs
rm -vf final-fix.mjs
rm -vf fix-*.js
rm -vf cleanup-console.mjs
rm -vf remove-console.mjs
rm -vf version_checker.sh
rm -vf audit_project.sh
rm -vf build.sh
echo "✅ Script files removed"

# Step 3: Remove support documents if they're not needed (optional)
# Uncomment the next lines if you want to remove the support documents
echo ""
echo "📚 Checking support documents..."
if [ -d "support documents" ]; then
    echo "📁 Found 'support documents' directory - keeping it (contains documentation)"
    # To remove them, uncomment:
    # rm -rf "support documents"
    # echo "✅ Support documents removed"
fi

# Step 4: Remove dist directory (build output)
echo ""
echo "🏗️  Checking dist directory..."
if [ -d "dist" ]; then
    echo "📁 Found 'dist' directory - removing build output"
    rm -rf dist
    echo "✅ dist directory removed"
fi

# Step 5: Clean up node_modules/.cache to save space
echo ""
echo "🗑️  Cleaning node_modules cache..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ Cache cleaned"
fi

# Step 6: Show remaining project structure
echo ""
echo "📂 Remaining project structure:"
echo "================================"
ls -la

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "- All backup files removed"
echo "- All temporary script files removed"
echo "- Build output (dist) removed"
echo "- Cache cleaned"
echo ""
echo "🚀 Project is now clean and ready!"
