# Firebase Configuration for Merath App

## Setup Instructions

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create a new project named "merath-app"
3. Enable Analytics (optional but recommended)

### Step 2: Add Android App
1. In Firebase Console, click "Add App" → Android
2. Package name: `space.manus.merath_mobile.t20260101172935`
3. SHA-1 certificate fingerprint: (get this from your build)
4. Download `google-services.json`

### Step 3: Get Credentials
Copy these values from your Firebase project settings:
- API Key
- Auth Domain
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID
- Measurement ID (from Analytics)

### Step 4: Create .env.local file
Create a file named `.env.local` in project root:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=merath-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=merath-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=merath-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
EXPO_PUBLIC_FIREBASE_APP_ID=1:000000000000:android:0000000000000000
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxxxxxxxxx

# Sentry Configuration (optional)
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/000000
```

### Step 5: Enable Services in Firebase
1. Go to Realtime Database → Create Database (start in test mode)
2. Go to Crashlytics → Enable (automatic with Analytics)
3. Go to Analytics → Enable if not already done
4. Go to Cloud Messaging → Enable (for future notifications)

### Step 6: Download google-services.json
1. In Firebase Console, go to Project Settings
2. Scroll to "Your apps" section
3. Download `google-services.json` for Android app
4. Place it in: `android/app/google-services.json`

## Important Notes

- **Never commit `.env.local`** or `google-services.json` to GitHub
- Add these files to `.gitignore` (already done)
- Firebase Crashlytics requires Google Play Services
- Annual maintenance required to keep project active

## Testing Firebase Integration

After setup, run:
```bash
npm install
eas build -p android --profile production --clear-cache
```

Firebase integration will automatically start tracking once the app is installed.

## Monitoring

Monitor your app at:
- Crashlytics: Console → Crashlytics (see crash reports)
- Analytics: Console → Analytics (see user behavior)
- Performance: Console → Performance (see app speed metrics)

## Support

If Firebase integration fails:
1. Check that package name matches exactly
2. Verify API Key is correct in .env.local
3. Ensure Firebase project is active (not deleted)
4. Check that Android app is properly registered in Firebase
5. Review build logs for Firebase initialization messages
