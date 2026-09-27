# FixiFy Mobile App

A Flutter mobile app for citizens to report city issues and earn green coins.

## Features
- **Report Issues**: Take live photos of full bins, road damage, etc. (No gallery uploads to ensure real-time accuracy). GPS coordinates are automatically attached.
- **Earn Green Coins**: Get +25 coins for verified reports via AI backend.
- **Green Wallet**: Track earnings, spend coins via QR scanner at partner stores (e.g., EV charging discounts).
- **Leaderboard**: Compete with other citizens to be the most active environmentalist.
- **Push Notifications**: Get notified instantly when reports are confirmed.

## Tech Stack
- Flutter 3.24+
- GoRouter (Navigation)
- Riverpod (State Management)
- Dio (Networking)
- Camera & Mobile Scanner
- Fl_Chart
- Firebase Messaging

## Setup Instructions

1. **Install Dependencies**
   ```bash
   flutter pub get
   ```

2. **Firebase Configuration**
   This app requires Firebase for push notifications. 
   - Create a project on Firebase Console.
   - Run `flutterfire configure` to generate `firebase_options.dart` and the respective Android/iOS config files.
   - (For local testing, the app has a try-catch block to bypass Firebase init errors if config files are missing).

3. **Run the app**
   ```bash
   flutter run
   ```

## Folder Structure
- `lib/core/` - Theme, Router, Constants, API Config.
- `lib/features/` - Feature modules (Auth, Home, Report, Wallet, QR Scan, Leaderboard, Profile).
- `lib/shared/` - Reusable UI widgets.

*Designed with a modern dark theme and vibrant primary green (#22C55E).*
