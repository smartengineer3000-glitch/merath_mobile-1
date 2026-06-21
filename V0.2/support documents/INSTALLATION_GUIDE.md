# Merath Installation & Setup Guide

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [Development Environment](#development-environment)
4. [Running the App](#running-the-app)
5. [Building for Production](#building-for-production)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn 3.0+)
- **Memory**: 4GB RAM minimum
- **Storage**: 2GB free space

### Device Requirements

#### iOS

- **iPhone/iPad**: iOS 12.0 or later
- **Xcode**: 14.0+ (for development)
- **CocoaPods**: For dependency management

#### Android

- **Android Version**: 6.0 (API 23) or higher
- **Android Studio**: Arctic Fox or later (for development)
- **Java**: OpenJDK 11+

### Optional Tools

- **Git**: For version control
- **VSCode**: Recommended editor
- **Expo Go App**: For testing on physical device
- **Android Emulator** or **iOS Simulator**

## Initial Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/merath/mobile.git
cd merath_mobile

# Or download as ZIP and extract
```

### 2. Install Node.js

**macOS** (using Homebrew):

```bash
brew install node@18
```

**Windows**:

- Download from [nodejs.org](https://nodejs.org/)
- Run installer and follow prompts

**Linux** (Ubuntu/Debian):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install Expo CLI

```bash
# Global installation
npm install -g expo-cli

# Or use npx (no global install needed)
npx expo --version
```

### 4. Install Project Dependencies

```bash
cd merath_mobile

# Install with npm
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### 5. Install iOS Dependencies (macOS only)

```bash
# Navigate to iOS folder
cd ios

# Install CocoaPods dependencies
pod install

# Return to project root
cd ..
```

## Development Environment

### VS Code Setup

#### Recommended Extensions

1. **ES7+ React/Redux/React-Native Snippets**
   - Publisher: dsznajder
   - ID: `dsznajder.es7-react-js-snippets`

2. **TypeScript Vue Plugin (Volar)**
   - Publisher: Vue
   - ID: `vue.volar`

3. **Prettier - Code Formatter**
   - Publisher: Prettier
   - ID: `esbenp.prettier-vscode`

4. **ESLint**
   - Publisher: Microsoft
   - ID: `dbaeumer.vscode-eslint`

5. **Thunder Client** (for API testing)
   - Publisher: Thunder Client
   - ID: `rangav.vscode-thunder-client`

#### Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Git Configuration

```bash
# Configure git user
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Set default branch to main
git config --global init.defaultBranch main

# Configure line endings (important for cross-platform)
git config --global core.autocrlf input  # macOS/Linux
git config --global core.autocrlf true   # Windows
```

### Environment Configuration

Create `.env` file in project root:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=30000

# App Configuration
REACT_APP_NAME=Merath
REACT_APP_VERSION=1.0.0

# Firebase (optional)
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CRASH_REPORTING=true
```

## Running the App

### Development Mode

#### Using Expo CLI

```bash
# Start development server
npm run dev

# Or with expo directly
expo start

# Press:
# i - iOS Simulator
# a - Android Emulator
# w - Web browser
# r - Reload app
# q - Quit
```

#### Specific Platforms

```bash
# iOS only
expo start --ios

# Android only
expo start --android

# Web only
expo start --web
```

#### On Physical Device

1. **Install Expo Go App**
   - iOS: Download from App Store
   - Android: Download from Google Play

2. **Run Dev Server**

   ```bash
   expo start --lan
   # or
   expo start --tunnel
   ```

3. **Scan QR Code**
   - Open Expo Go app
   - Scan QR code from terminal
   - App will load automatically

### Web Development

```bash
# Start web dev server
npm run dev:web

# Runs on http://localhost:8081
```

### Run Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific test file
npm test -- inheritance.test.ts
```

### Lint Code

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint -- --fix

# Type checking
npm run type-check
```

## Building for Production

### Android APK Build

```bash
# Build APK for production
eas build --platform android --profile production

# Build preview (for testing before release)
eas build --platform android --profile preview

# Local build (requires Android Studio)
npm run build:android
```

### iOS Build

```bash
# Build for App Store
eas build --platform ios --profile production

# Build for TestFlight (beta testing)
eas build --platform ios --profile testflight

# Local build (requires macOS and Xcode)
npm run build:ios
```

### EAS Build Setup

1. **Create EAS Account**

   ```bash
   eas login
   # Follow prompts to create/login account
   ```

2. **Initialize Project**

   ```bash
   eas build:configure
   # Select platform
   # Review and confirm eas.json
   ```

3. **Configure eas.json**
   ```json
   {
     "builds": {
       "preview": {
         "android": {
           "buildType": "apk"
         },
         "ios": {
           "simulator": true
         }
       },
       "production": {
         "android": {
           "buildType": "aab"
         },
         "ios": {}
       }
     }
   }
   ```

### Web Build

```bash
# Build for web deployment
npm run build:web

# Output: dist/ directory ready for deployment
```

## Troubleshooting

### Common Issues

#### 1. Dependency Installation Fails

```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### 2. Metro Bundler Issues

```bash
# Clear Metro cache
npm start -- --reset-cache

# Or
expo start -c
```

#### 3. iOS Pod Installation Failed

```bash
cd ios

# Remove old pods
rm -rf Pods Podfile.lock

# Reinstall
pod install

# Update repo
pod repo update

cd ..
```

#### 4. Android Emulator Not Starting

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd emulator_name

# Or use Android Studio: Tools > Device Manager
```

#### 5. Port Already in Use

```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or use different port
expo start --port 8082
```

#### 6. TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.bin/tsc

# Rebuild
npm run type-check

# Or reinstall dependencies
npm install
```

### Performance Optimization

#### Development Tips

1. **Use Production Mode for Testing**

   ```bash
   npm run dev -- --production
   ```

2. **Profile with React DevTools**
   - Install: React DevTools extension
   - Select: React Native in debugger

3. **Monitor Bundle Size**

   ```bash
   npm run analyze
   ```

4. **Optimize Images**
   - Use appropriate sizes
   - Consider WebP format
   - Compress before adding

#### Build Optimization

1. **Enable Code Splitting**
   - Already configured in metro.config.js

2. **Tree Shaking**
   - Use named imports
   - Remove unused dependencies

3. **Minification**
   - Automatic in production builds

## First Run Checklist

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] iOS pods installed (macOS only)
- [ ] Environment variables configured (`.env`)
- [ ] No linting errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Tests pass (`npm test`)
- [ ] App starts (`npm run dev`)
- [ ] Can navigate to calculator screen
- [ ] Can perform test calculation
- [ ] Results display correctly

## Support & Help

- **Documentation**: See [docs/](docs/) folder
- **FAQ**: [docs/FAQ.md](docs/FAQ.md)
- **Issues**: GitHub Issues
- **Email**: support@merath.app

## Next Steps

1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for development guidelines
2. Check [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for project structure
3. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
4. Run test suite to verify setup

---

**Last Updated**: 2024
**Maintained By**: Merath Development Team
