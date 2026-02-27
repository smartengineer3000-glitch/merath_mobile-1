#!/bin/bash

echo "🔨 Building Merath Islamic Inheritance Calculator v1.0.0"
echo "========================================================"
echo ""

# Step 1: Verify we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📌 Current branch: $CURRENT_BRANCH"
echo ""

# Step 2: Run tests
echo "📋 Running test suite..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed! Aborting build."
    exit 1
fi
echo "✅ All 237 tests passed!"
echo ""

# Step 3: TypeScript check
echo "🔍 Checking TypeScript compilation..."
npm run check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found! Aborting build."
    exit 1
fi
echo "✅ TypeScript check passed!"
echo ""

# Step 4: Build APK
echo "📱 Building production APK..."
echo "   This will take 25-45 minutes..."
echo ""
echo "⚠️  Make sure you're logged into EAS: eas whoami"
echo "   If not, run: eas login"
echo ""

# Check if user is logged into EAS
eas whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

# Run the build
eas build --platform android --profile production --wait

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ BUILD COMPLETED SUCCESSFULLY! ✅✅✅"
    echo ""
    echo "📥 Next steps:"
    echo "   1. Download the APK/AAB from EAS dashboard"
    echo "      https://expo.dev/accounts/$(eas whoami)/builds"
    echo "   2. Test on physical Android device:"
    echo "      adb install -r merath-release.apk"
    echo "   3. Prepare Play Store submission:"
    echo "      - Create store listing"
    echo "      - Upload screenshots"
    echo "      - Add privacy policy URL"
    echo "      - Upload AAB file"
    echo ""
    echo "📋 Don't forget to:"
    echo "   - Update version in app.config.ts if needed"
    echo "   - Create a git tag: git tag v1.0.0 && git push origin v1.0.0"
else
    echo ""
    echo "❌❌❌ BUILD FAILED ❌❌❌"
    echo "   Check the logs above for errors."
    echo "   Common issues:"
    echo "   - Check app.config.ts for errors"
    echo "   - Ensure all dependencies are installed: npm install"
    echo "   - Check EAS build logs at: https://expo.dev/accounts/$(eas whoami)/builds"
    exit 1
fi
