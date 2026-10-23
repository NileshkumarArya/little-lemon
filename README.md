<<<<<<< HEAD
# Little Lemon Restaurant App

React Native (Expo) mobile app for the Little Lemon Mediterranean restaurant.

## Screens

1. **Onboarding** — First time user setup (name + email). Next button disabled until both fields filled.
2. **Home** — Header, Hero section with search, Menu category breakdown, Scrollable food menu list.
3. **Profile** — Edit personal info, toggle email notifications, save/discard changes, log out.

## Features

- Stack navigation (Back button works)
- AsyncStorage persistence — profile data survives app restart
- Log out clears all data and returns to Onboarding
- Search filters menu items in real time
- Category tabs filter menu by Starters / Mains / Desserts / Drinks

## Setup & Run

```bash
npm install
npx expo start
```

Then scan QR with Expo Go app (iOS/Android) or press:
- `a` → Android emulator
- `i` → iOS simulator (Mac only)
- `w` → Web browser

## Dependencies

- `@react-navigation/native` + `@react-navigation/native-stack`
- `react-native-screens` + `react-native-safe-area-context`
- `@react-native-async-storage/async-storage`
=======
# little-lemon
A React Native (Expo) restaurant app for Little Lemon — with onboarding, menu browsing, and persistent user profile.
>>>>>>> 37e74472e4ce2e5858c956fc5b31d76e5f40d811
