# VaultCollect

A visual inventory app for collectors. Catalog books, cards, games, and more with photos, condition tracking, and value estimation.

## Features

- **Multiple Collections** - Organize items into custom collections with icons and colors
- **Item Tracking** - Add photos, descriptions, condition ratings, purchase price, and current value
- **Tag System** - Organize items with custom tags
- **Location Tracking** - Track where items are stored (shelf, box, room)
- **Search & Filter** - Find items quickly across all collections
- **Statistics Dashboard** - View collection value, condition breakdown, and more
- **Data Persistence** - All data stored locally using AsyncStorage

## Premium Features

- AI item identification
- Value analytics over time
- Cloud backup
- Priority support

## Tech Stack

- **Expo SDK 54** - React Native framework
- **Expo Router** - File-based routing
- **Zustand** - State management
- **AsyncStorage** - Local data persistence
- **Expo Image Picker** - Photo capture
- **RevenueCat** - In-app purchases (stub ready)

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- EAS CLI (for building)

### Installation

```bash
cd vault-collect
npm install
npx expo start
```

### Running on Devices

```bash
# iOS
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```

## Project Structure

```
vault-collect/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── (tabs)/            # Tab navigation
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

## RevenueCat Setup (Premium)

To enable premium features:

1. Create a RevenueCat account at [revenuecat.com](https://revenuecat.com)
2. Create products in App Store Connect / Google Play Console:
   - Monthly: $4.99/month - `vault_collect_monthly`
   - Annual: $29.99/year - `vault_collect_annual`
3. Configure products in RevenueCat dashboard
4. Add your API key to `src/services/purchases.ts`

See `SETUP.md` for detailed instructions.

## Building for Production

### iOS

```bash
eas build -p ios --profile production
```

### Android

```bash
eas build -p android --profile production
```

## License

Private - All rights reserved
