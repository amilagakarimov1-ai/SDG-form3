import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'providers.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/report/presentation/report_screen.dart';
import '../features/wallet/presentation/wallet_screen.dart';
import '../features/qr_scan/presentation/qr_scan_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/leaderboard/presentation/leaderboard_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final isAuth = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final loggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/register';
      if (!isAuth && !loggingIn) return '/login';
      if (isAuth && loggingIn) return '/home/report';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => HomeScreen(child: child),
        routes: [
          GoRoute(
            path: '/home/report',
            builder: (context, state) => const ReportScreen(),
          ),
          GoRoute(
            path: '/home/wallet',
            builder: (context, state) => const WalletScreen(),
          ),
          GoRoute(
            path: '/home/scan',
            builder: (context, state) => const QRScanScreen(),
          ),
          GoRoute(
            path: '/home/leaderboard',
            builder: (context, state) => const LeaderboardScreen(),
          ),
          GoRoute(
            path: '/home/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
    ],
  );
});
