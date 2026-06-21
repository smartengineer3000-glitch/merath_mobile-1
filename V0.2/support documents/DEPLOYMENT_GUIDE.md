# Merath Deployment Guide

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Versioning & Release](#versioning--release)
3. [Android Deployment](#android-deployment)
4. [iOS Deployment](#ios-deployment)
5. [Web Deployment](#web-deployment)
6. [Post-Deployment](#post-deployment)

## Pre-Deployment Checklist

### Code Quality

```bash
# Ensure all checks pass
npm run lint              # No linting errors
npm run type-check        # No TypeScript errors
npm test                  # All tests pass
npm run build             # Builds without errors
```

### Documentation

- [ ] README.md updated
- [ ] API_DOCUMENTATION.md current
- [ ] CHANGELOG.md updated
- [ ] Known issues documented
- [ ] Migration guide (if applicable)

### Testing

- [ ] Unit tests pass (100%)
- [ ] Integration tests pass
- [ ] Manual testing complete
- [ ] Edge cases tested
- [ ] Performance verified

### Security

- [ ] No hardcoded secrets
- [ ] Dependencies updated
- [ ] Security audit passed
- [ ] Credentials managed via environment

### Performance

- [ ] Bundle size optimized
- [ ] Load time acceptable
- [ ] Memory usage optimal
- [ ] Battery impact minimal

## Versioning & Release

### Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features, backward compatible
PATCH: Bug fixes

Examples:
1.0.0 - First release
1.1.0 - New features
1.0.1 - Bug fix
2.0.0 - Breaking changes
```

### Version Update Process

1. **Update version in app.config.ts**

   ```typescript
   export default {
     expo: {
       version: '1.1.0',
       plugins: [...],
     },
   };
   ```

2. **Update version in package.json**

   ```json
   {
     "version": "1.1.0"
   }
   ```

3. **Create Git tag**

   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

4. **Update CHANGELOG.md**

   ```markdown
   ## [1.1.0] - 2024-01-15

   ### Added

   - New features list

   ### Fixed

   - Bug fixes list

   ### Changed

   - Changes list
   ```

## Android Deployment

### Preparation

1. **Setup Signing Key**

   ```bash
   # Generate signing key (first time only)
   keytool -genkey -v -keystore merath-keystore.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias merath-key \
     -storepass <password> \
     -keypass <password>

   # Store safely - DO NOT commit to git
   ```

2. **Configure EAS**

   ```bash
   # Login to EAS
   eas login

   # Initialize for Android
   eas build:configure --platform android
   ```

3. **Update eas.json**
   ```json
   {
     "builds": {
       "production": {
         "android": {
           "buildType": "aab",
           "credentialsSource": "local",
           "keystore": {
             "keystorePath": "merath-keystore.jks",
             "keystorePassword": "$KEYSTORE_PASSWORD",
             "keyAlias": "merath-key",
             "keyPassword": "$KEY_PASSWORD"
           }
         }
       }
     }
   }
   ```

### Build Process

1. **Local Build**

   ```bash
   # Build APK locally (requires Android Studio)
   npm run build:android

   # Output: app/build/outputs/apk/release/app-release.apk
   ```

2. **Cloud Build (EAS)**

   ```bash
   # Build for production
   eas build --platform android --profile production

   # Build for preview
   eas build --platform android --profile preview

   # Monitor build
   eas build:list
   eas build:view <BUILD_ID>
   ```

3. **Test Build**

   ```bash
   # Build APK for testing
   eas build --platform android --profile preview

   # Download and test on device
   adb install app.apk
   ```

### Google Play Store Deployment

1. **Create Play Store Account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app
   - Complete store listing

2. **Store Listing Setup**
   - **Title**: Merath Islamic Inheritance Calculator
   - **Description**: Complete Islamic inheritance calculator
   - **Category**: Productivity
   - **Screenshots**: Upload 4+ screenshots
   - **Icon**: 512x512 PNG
   - **Feature Graphic**: 1024x500 PNG

3. **Prepare Release**

   ```bash
   # Generate signed bundle
   eas build --platform android --profile production

   # Download .aab file from EAS
   ```

4. **Upload to Play Store**
   - Go to Play Store Console
   - Navigate to "Release" > "Create new release"
   - Upload .aab file
   - Add release notes
   - Review content rating
   - Submit for review (2-4 hours)

5. **Rollout Strategy**
   ```
   Phase 1: 5% of users (24-48 hours)
   Phase 2: 20% of users (if no issues)
   Phase 3: 50% of users
   Phase 4: 100% full rollout
   ```

## iOS Deployment

### Preparation

1. **Apple Developer Account**
   - Create account at [developer.apple.com](https://developer.apple.com)
   - Enroll in Apple Developer Program ($99/year)

2. **Certificates & Provisioning**

   ```bash
   # Create certificate signing request in Xcode
   # Or via Keychain Access:
   # Keychain Access > Certificate Assistant > Request from Certificate Authority

   # EAS can handle automatically:
   eas credentials
   ```

3. **Configure EAS for iOS**

   ```bash
   eas build:configure --platform ios
   ```

4. **Update eas.json**
   ```json
   {
     "builds": {
       "production": {
         "ios": {
           "buildType": "app-store",
           "credentialsSource": "local"
         }
       }
     }
   }
   ```

### Build Process

1. **Cloud Build (Recommended)**

   ```bash
   # Build for App Store
   eas build --platform ios --profile production

   # Build for TestFlight
   eas build --platform ios --profile testflight

   # Monitor build
   eas build:list
   ```

2. **Local Build (Advanced)**

   ```bash
   # Requires macOS and Xcode
   npm run build:ios

   # Output: .ipa file
   ```

### App Store Deployment

1. **Create App Store Connect Record**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Click "My Apps"
   - Create new app
   - Select bundle ID

2. **App Information**
   - **Name**: Merath
   - **Subtitle**: Islamic Inheritance Calculator
   - **Privacy Policy URL**: https://merath.app/privacy
   - **Support URL**: https://merath.app/support
   - **Localization**: English

3. **Pricing & Availability**
   - **Price**: Free (0.00)
   - **Availability**: Worldwide
   - **Regions**: Select all

4. **App Review Information**
   - **First Name**: Your Name
   - **Last Name**: Your Name
   - **Email**: support@merath.app
   - **Phone**: +1 (phone number)
   - **Routing App Coverage**: Not applicable

5. **Version Release**

   ```bash
   # Download build from EAS
   # Upload to App Store Connect via Transporter:

   # macOS:
   xcrun altool --upload-app --type ios \
     --file merath.ipa \
     --username <email> \
     --password <password>

   # Or use Transporter app
   ```

6. **Submit for Review**
   - Fill out app content rating questionnaire
   - Review content restrictions
   - Submit version for review
   - Apple reviews in 24-48 hours

7. **Post-Review**
   - If approved: Schedule release or release immediately
   - If rejected: Address feedback and resubmit

## Web Deployment

### Build for Web

```bash
# Build static files
npm run build:web

# Output: dist/ directory
```

### Firebase Hosting

1. **Setup Firebase**

   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Login
   firebase login

   # Initialize project
   firebase init hosting
   ```

2. **Configure firebase.json**

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Deploy**

   ```bash
   # Deploy to Firebase
   firebase deploy

   # Deploy specific version
   firebase deploy --only hosting:merath

   # View logs
   firebase hosting:channel:list
   ```

### Netlify Deployment

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select repository
   - Authorize GitHub/GitLab

2. **Configure Build**

   ```
   Build command: npm run build:web
   Publish directory: dist
   ```

3. **Deploy**
   - Netlify auto-deploys on push to main
   - View at: your-site.netlify.app

### Vercel Deployment

1. **Connect Repository**

   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel
   ```

2. **Configure Project**

   ```
   Build command: npm run build:web
   Output directory: dist
   ```

3. **Deploy**
   - Vercel auto-deploys on push
   - View at: your-site.vercel.app

## Post-Deployment

### Monitoring

1. **Analytics**

   ```bash
   # Track user engagement
   # Monitor calculation performance
   # Track error rates
   ```

2. **Crash Reporting**
   - Setup Sentry: https://sentry.io
   - Monitor app crashes
   - Alert on errors

3. **Performance Monitoring**
   - Monitor app load time
   - Track calculation duration
   - Monitor memory usage

### Rollback Plan

1. **Immediate Rollback**

   ```bash
   # Pause rollout
   eas build:list
   eas build:view <BUILD_ID>

   # Rollback to previous version
   # In Google Play/App Store console, pause distribution
   ```

2. **Communicate Issues**
   - Notify users of issues
   - Provide workarounds
   - Set timeline for fix

### Post-Release Support

1. **Monitor Reports**
   - Check app reviews
   - Monitor support channels
   - Track GitHub issues

2. **Bug Fixes**
   - Create hotfix branch
   - Release patch version
   - Deploy hotfix

3. **User Communication**
   - Announce features
   - Share release notes
   - Celebrate milestones

## Release Checklist

Before each release:

- [ ] Version number updated
- [ ] CHANGELOG.md updated
- [ ] All tests passing
- [ ] No console errors
- [ ] Bundle size optimized
- [ ] Screenshots updated
- [ ] App description accurate
- [ ] Privacy policy up-to-date
- [ ] Support info current
- [ ] Build successful
- [ ] QA testing complete
- [ ] Performance verified
- [ ] Security audit passed

## Deployment Timeline

### Typical Release Cycle

```
Day 1-2:  Development & testing
Day 3:    Submit to stores
Day 4-5:  App review
Day 5-6:  Approved & released
Day 6-7:  Monitor for issues
Day 7+:   Full rollout
```

### Critical Issue Hotfix

```
Day 1: Issue identified
Day 1: Hotfix developed & tested
Day 2: Submit hotfix
Day 2: Review & approved
Day 3: Hotfix released
Day 3+: Users updated
```

## Support Channels

- **Email**: support@merath.app
- **GitHub Issues**: bug reports & feature requests
- **FAQ**: https://merath.app/help
- **Documentation**: https://merath.app/docs

---

**Last Updated**: 2024
**Maintained By**: Merath DevOps Team
