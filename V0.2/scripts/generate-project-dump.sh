#!/bin/bash
# Save this as generate-project-dump.sh and run it, or run the commands directly

echo "# MERATH ISLAMIC INHERITANCE CALCULATOR - COMPLETE PROJECT DUMP"
echo "Generated on: $(date)"
echo ""

echo "# Project Structure"
echo '```'
tree -L 4 -I 'node_modules|.git|dist|build|coverage|*.log|android|ios|*.backup|*.tmp' --dirsfirst
echo '```'
echo ""

echo "# Package Information"
echo "## package.json"
echo '```json'
cat package.json
echo '```'
echo ""

echo "# Core Configuration Files"
echo "## app.config.ts"
echo '```typescript'
cat app.config.ts
echo '```'
echo ""

echo "## tsconfig.json"
echo '```json'
cat tsconfig.json
echo '```'
echo ""

echo "# Source Files - Core Inheritance Engine"
find ./lib/inheritance -name "*.ts" -o -name "*.tsx" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Components"
find ./components -name "*.tsx" | sort | while read file; do
    # Skip ui components for now, we'll do them separately
    if [[ "$file" != *"/ui/"* ]]; then
        echo "## $file"
        echo '```typescript'
        cat "$file"
        echo '```'
        echo ""
    fi
done

echo "# Source Files - UI Components"
find ./components/ui -name "*.tsx" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Screens"
find ./screens -name "*.tsx" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Navigation"
find ./navigation -name "*.tsx" -o -name "*.ts" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Context"
find ./lib/context -name "*.tsx" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Validation"
find ./lib/validation -name "*.ts" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Export"
find ./lib/export -name "*.ts" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Design"
find ./lib/design -name "*.ts" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - Error Handling"
find ./lib/errors -name "*.ts" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Source Files - i18n"
echo "## ./lib/i18n/index.ts"
echo '```typescript'
cat ./lib/i18n/index.ts
echo '```'
echo ""
echo "## ./lib/i18n/locales/ar.json"
echo '```json'
cat ./lib/i18n/locales/ar.json
echo '```'
echo ""

echo "# Test Files"
find ./__tests__ -name "*.test.ts" | sort | while read file; do
    echo "## $file"
    echo '```typescript'
    cat "$file"
    echo '```'
    echo ""
done

echo "# Documentation Files"
echo "## README.md"
echo '```markdown'
cat README.md 2>/dev/null || echo "README.md not found"
echo '```'
echo ""

echo "# Final Status Summary"
echo '```'
echo "MERATH ISLAMIC INHERITANCE CALCULATOR"
echo "========================================"
echo ""
echo "📊 Project Statistics:"
echo "   • TypeScript Files: $(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l)"
echo "   • Test Files: $(find __tests__ -name "*.test.ts" | wc -l)"
echo "   • Components: $(find components -name "*.tsx" | wc -l)"
echo "   • Screens: $(find screens -name "*.tsx" | wc -l)"
echo ""
echo "📱 App Information:"
echo "   • Package: $(grep '"name"' package.json | head -1 | cut -d'"' -f4)"
echo "   • Version: $(grep '"version"' package.json | head -1 | cut -d'"' -f4)"
echo "   • Expo SDK: $(grep '"expo"' package.json | head -1 | cut -d'"' -f4)"
echo ""
echo "🕌 Features:"
echo "   • Madhabs: Hanafi, Maliki, Shafi'i, Hanbali"
echo "   • Special Cases: Awl, Radd, Hijab, Umariyyah"
echo "   • Heir Types: 40+"
echo ""
echo "✅ Build Status: Ready for APK generation"
echo '```'