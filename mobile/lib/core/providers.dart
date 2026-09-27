import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../features/auth/data/auth_repository.dart';
import '../features/report/data/report_repository.dart';
import '../features/wallet/data/wallet_repository.dart';

// ─── Secure Storage ───────────────────────────────────────────────────────────
final secureStorageProvider = Provider<FlutterSecureStorage>(
  (_) => const FlutterSecureStorage(),
);

// ─── Repositories ─────────────────────────────────────────────────────────────
final authRepositoryProvider = Provider<AuthRepository>(
  (_) => AuthRepository(),
);

final reportRepositoryProvider = Provider<ReportRepository>(
  (_) => ReportRepository(),
);

final walletRepositoryProvider = Provider<WalletRepository>(
  (_) => WalletRepository(),
);

// ─── Auth State ───────────────────────────────────────────────────────────────
/// Whether the user is currently authenticated (has a valid token in storage).
final authStateProvider = FutureProvider<bool>((ref) async {
  final repo = ref.read(authRepositoryProvider);
  return repo.isLoggedIn();
});

/// The current logged-in user profile data (null if not logged in).
final currentUserProvider = FutureProvider<Map<String, dynamic>?>((ref) async {
  final isAuth = await ref.watch(authStateProvider.future);
  if (!isAuth) return null;
  final repo = ref.read(authRepositoryProvider);
  try {
    return await repo.getMe();
  } catch (_) {
    return null;
  }
});

// ─── Wallet State ─────────────────────────────────────────────────────────────
final walletProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final repo = ref.read(walletRepositoryProvider);
  try {
    return await repo.getWallet();
  } catch (_) {
    // Return demo wallet if backend unavailable
    return {
      'balance': 450,
      'transactions': [
        {'id': '1', 'amount': 25, 'transaction_type': 'earned_report', 'description': 'Reported Full Bin', 'created_at': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String()},
        {'id': '2', 'amount': -50, 'transaction_type': 'spent_ev_charge', 'description': 'EV Charging at Bulvar Station', 'created_at': DateTime.now().subtract(const Duration(days: 1)).toIso8601String()},
        {'id': '3', 'amount': 25, 'transaction_type': 'earned_report', 'description': 'Reported Broken Light', 'created_at': DateTime.now().subtract(const Duration(days: 2)).toIso8601String()},
        {'id': '4', 'amount': 25, 'transaction_type': 'earned_report', 'description': 'Reported Full Bin', 'created_at': DateTime.now().subtract(const Duration(days: 3)).toIso8601String()},
        {'id': '5', 'amount': -25, 'transaction_type': 'spent_partner', 'description': 'Bravo Market Discount', 'created_at': DateTime.now().subtract(const Duration(days: 5)).toIso8601String()},
      ],
    };
  }
});

// ─── Leaderboard State ────────────────────────────────────────────────────────
final leaderboardProvider = FutureProvider<List<dynamic>>((ref) async {
  final repo = ref.read(walletRepositoryProvider);
  try {
    return await repo.getLeaderboard();
  } catch (_) {
    return [
      {'rank': 1, 'full_name': 'Aytən Məmmədova', 'coins': 1250, 'reports': 50},
      {'rank': 2, 'full_name': 'Rəşad Hüseynov', 'coins': 980, 'reports': 39},
      {'rank': 3, 'full_name': 'Günel Əliyeva', 'coins': 875, 'reports': 35},
      {'rank': 4, 'full_name': 'Elnur Babayev', 'coins': 725, 'reports': 29},
      {'rank': 5, 'full_name': 'Nigar Qasımova', 'coins': 650, 'reports': 26},
    ];
  }
});

// ─── My Reports ───────────────────────────────────────────────────────────────
final myReportsProvider = FutureProvider<List<dynamic>>((ref) async {
  final repo = ref.read(reportRepositoryProvider);
  try {
    return await repo.getMyReports();
  } catch (_) {
    return [];
  }
});
