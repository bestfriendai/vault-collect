# VaultCollect - Premium v2 Build

Visual inventory app for collectors. Catalog books, cards, games, and more with photos, condition tracking, and value estimation.

## Brand Color
- **Primary:** Emerald (#059669)
- **Inspiration:** Linear + Things 3

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo`)
- EAS CLI (`npm install -g eas-cli`)

### Installation
```bash
cd vault-collect
npm install
npx expo start
```

### Development
```bash
# iOS
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```

## RevenueCat Setup

### 1. Create RevenueCat Account
1. Go to [revenuecat.com](https://revenuecat.com) and sign up
2. Create a new project for VaultCollect

### 2. Create Products
In App Store Connect and Google Play Console:
- **Monthly:** $4.99/month - `vault_collect_monthly`
- **Annual:** $29.99/year - `vault_collect_annual`

### 3. Configure RevenueCat
1. Add iOS/Android apps in RevenueCat
2. Create entitlements/products matching your store IDs
3. Copy API key to `src/services/purchases.ts`

### 4. Products Configuration
```typescript
// src/services/purchases.ts
const REVENUECAT_API_KEY = 'your_api_key';
```

## App Store Setup

### iOS (App Store Connect)
1. Create bundle ID: `com.vaultcollect.app`
2. Create app in App Store Connect
3. Upload build via EAS:
```bash
eas build -p ios --profile production
```

### Android (Google Play)
1. Create package: `com.vaultcollect.app`
2. Upload via EAS:
```bash
eas build -p android --profile production
```

## EAS Build Commands

### Development Build
```bash
eas build -p ios --profile development
```

### Production Build
```bash
eas build -p ios --profile production
eas build -p android --profile production
```

### Local Build
```bash
eas build -p ios --profile development --local
```

## Submission Checklist

- [ ] App Store screenshots (6-10 images)
- [ ] App Store preview video (optional)
- [ ] Privacy policy URL
- [ ] Support email configured
- [ ] Age rating selected
- [ ] Category selected (Shopping)
- [ ] In-app purchases tested in Sandbox
- [ ] Build uploaded and processing

## File Structure

```
vault-collect/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── (tabs)/            # Tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx      # Collections
│   │   ├── search.tsx     # Search
│   │   ├── stats.tsx      # Statistics
│   │   └── settings.tsx   # Settings
│   ├── item/
│   │   ├── [id].tsx      # Item detail
│   │   └── new.tsx       # Add item
│   ├── collection/
│   │   ├── [id].tsx      # Collection detail
│   │   └── new.tsx       # Create collection
│   ├── settings/
│   │   └── index.tsx     # Settings index
│   └── paywall.tsx       # Premium paywall
├── src/
│   ├── theme.ts          # Design tokens
│   ├── store/
│   │   └── vaultStore.ts # Zustand state
│   └── services/
│       └── purchases.ts  # RevenueCat stub
├── package.json
├── app.json
└── tsconfig.json
```

## Features

### Core
- [x] Multiple collections with custom icons/colors
- [x] Add items with photos, descriptions, condition
- [x] Track purchase price and current value
- [x] Tag system for organization
- [x] Location tracking (shelf, box, room)
- [x] Search and filter
- [x] Statistics dashboard
- [x] Export/import data

### Premium
- [ ] AI item identification
- [ ] Value analytics over time
- [ ] Cloud backup
- [ ] Priority support

## Tech Stack

- Expo SDK 54
- Expo Router (file-based routing)
- Zustand (state management)
- AsyncStorage (persistence)
- Expo Image Picker (photos)
- RevenueCat (monetization)
