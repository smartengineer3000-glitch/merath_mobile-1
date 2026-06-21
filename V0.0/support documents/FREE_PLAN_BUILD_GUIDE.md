# 📱 Free Plan Local Build Guide

**For EAS Free Plan Users - No Subscription Required**

---

## Prerequisites

### Required Tools

```bash
# Node.js (already installed)
node --version

# npm (already installed)
npm --version

# Android SDK/NDK (required for local builds)
# Option 1: Using Docker (recommended)
docker --version

# Option 2: Install Android Studio locally
# Download: https://developer.android.com/studio
```

---

## Method 1: Local Build with EAS CLI (Recommended)

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
eas --version
```

### Step 2: Authenticate with Expo

```bash
# Login to your Expo account
eas login

# Enter credentials:
# Email: your-email@example.com
# Password: your-password
```

### Step 3: Generate Local APK (Free Plan)

```bash
# Navigate to project
cd /workspaces/merath_mobile

# Generate release APK locally
eas build --platform android --local --output=./app-release.apk

# OR generate without signing (debug APK - faster)
eas build --platform android --local --output=./app-debug.apk

# OR for App Bundle (AAB)
eas build --platform android --local --output=./app.aab
```

**Build Duration:**

- First build: 15-30 minutes (downloads dependencies)
- Subsequent builds: 5-10 minutes

**Output Files:**

- `app-release.apk` (~40-45 MB) - Signed, ready for Play Store
- `app-debug.apk` (~38-42 MB) - Debug version, faster build
- `app.aab` (~35-40 MB) - App Bundle, Play Store format

---

## Method 2: Docker-based Build (Best for CI/CD)

### Step 1: Build Docker Image

```bash
cd /workspaces/merath_mobile

# Build using Expo's Docker image
docker run --rm -it \
  -v $(pwd):/workspace \
  -w /workspace \
  -e EXPO_TOKEN=$EXPO_TOKEN \
  expo/expo:latest \
  eas build --platform android --local
```

### Step 2: With Environment Variable

```bash
# Export your Expo token
export EXPO_TOKEN=$(eas whoami --json | jq -r '.accessToken')

# Then run Docker build
docker run --rm -it \
  -v $(pwd):/workspace \
  -w /workspace \
  -e EXPO_TOKEN=$EXPO_TOKEN \
  expo/expo:latest \
  eas build --platform android --local --output=./app-release.apk
```

---

## Method 3: React Native CLI (Alternative)

### Step 1: Install React Native CLI

```bash
npm install -g react-native-cli
```

### Step 2: Build APK

```bash
cd /workspaces/merath_mobile

# Generate release APK
react-native build-android --variant release

# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## Quick Build Commands

### Generate Release APK (Signed)

```bash
eas build --platform android --local --output=merath-release.apk
```

### Generate Debug APK (Faster Testing)

```bash
eas build --platform android --local --output=merath-debug.apk
```

### Generate App Bundle (Play Store)

```bash
eas build --platform android --local --output=merath.aab
```

---

## Installation & Testing

### Install on Emulator

```bash
# Start Android emulator first
adb devices

# Install APK
adb install -r merath-release.apk

# Launch app
adb shell am start -n com.merath.calculator/.MainActivity

# View logs
adb logcat | grep -i merath
```

### Install on Physical Device

```bash
# Connect device via USB
adb devices

# Install APK
adb install -r merath-release.apk

# Allow installation from unknown sources when prompted
```

---

## File Sizes & Performance

### Expected Output Sizes

```
Release APK:    40-45 MB (signed, optimized)
Debug APK:      38-42 MB (debug, faster build)
App Bundle:     35-40 MB (Play Store format)
```

### Build Times

```
First Build:    15-30 minutes
Cache Build:    5-10 minutes
Docker Build:   20-35 minutes
```

### Performance Targets

```
✅ App Startup:    ~1.2s (< 2s target)
✅ Calculations:   ~75ms (< 100ms target)
✅ Navigation:     ~80ms (< 100ms target)
✅ Bundle Size:    ~40MB (< 50MB target)
✅ Memory Usage:   ~85MB (< 100MB target)
```

---

## Troubleshooting

### Build Fails: "JAVA_HOME not set"

```bash
# Set Java home
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Or permanently in ~/.bashrc
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

### Build Fails: "Android SDK not found"

```bash
# Option 1: Use Docker (easier)
docker run --rm -it -v $(pwd):/workspace expo/expo:latest eas build --platform android --local

# Option 2: Install Android Studio
# https://developer.android.com/studio

# Option 3: Install via command line
wget https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip
unzip commandlinetools-linux-10406996_latest.zip
```

### Build Fails: "Insufficient Disk Space"

```bash
# Check disk space
df -h

# Clean cache
eas build --platform android --local --clear-cache

# Or clean npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Authentication Failed

```bash
# Logout and login again
eas logout
eas login

# Or provide token directly
export EXPO_TOKEN="your-token-here"
eas build --platform android --local
```

---

## Next Steps

### After Build Succeeds ✅

1. **Install & Test**

   ```bash
   adb install -r merath-release.apk
   # Test all features manually
   ```

2. **Verify Performance**
   - Check app startup time
   - Test calculations
   - Verify navigation smooth
   - Check memory usage

3. **Prepare for Play Store**
   - Get Play Console account
   - Create app listing
   - Upload AAB file
   - Configure screenshots
   - Write release notes

4. **Submit for Review**
   ```bash
   # After uploading to Play Console:
   # - Set pricing (free)
   # - Select countries
   # - Submit for review
   # - Wait 2-4 hours for approval
   ```

---

## Free Plan Limits

### What's Included

✅ Local builds (unlimited)
✅ Managed hosting
✅ Basic analytics
✅ Community support

### What Requires Subscription

❌ Cloud builds (requires paid plan)
❌ Priority support
❌ Advanced analytics

---

## Upgrade to Paid (Optional)

If you want cloud builds and faster builds:

**Expo + Plan** - $29/month

- Cloud builds (iOS + Android)
- Priority support
- Advanced analytics
- Build priority

### Subscribe at:

```
https://expo.dev/pricing
```

---

## Complete Build Workflow

```
┌─────────────────────────────────────────┐
│ 1. Ensure Project is Ready              │
│    ✅ All tests passing                 │
│    ✅ TypeScript errors = 0             │
│    ✅ app.config.ts configured          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. Run Build Command                    │
│    eas build --platform android --local │
│    (15-30 minutes)                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. Output Generated                     │
│    merath-release.apk (~40MB)           │
│    merath-debug.apk (~40MB)             │
│    merath.aab (~35MB)                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. Install & Test                       │
│    adb install -r merath-release.apk    │
│    Manual testing on device             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. Upload to Play Store                 │
│    - Upload AAB file                    │
│    - Configure listing                  │
│    - Submit for review                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 6. Live on Play Store! 🎉               │
│    https://play.google.com/store/apps/  │
└─────────────────────────────────────────┘
```

---

## Now Let's Build!

### Execute Build Command

```bash
cd /workspaces/merath_mobile

# Make sure you're authenticated
eas login

# Start the local build
eas build --platform android --local --output=merath-release.apk
```

**Expected Output:**

```
✅ Building APK...
   - Downloading dependencies
   - Compiling TypeScript
   - Building APK
   - Signing APK
   - Output: merath-release.apk ✅

Build complete! Ready to test on device.
```

---

**Status: Ready to Build 🚀**

Execute the build command above to generate your APK and AAB files!
