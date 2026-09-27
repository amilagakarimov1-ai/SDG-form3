import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants.dart';

class HomeScreen extends StatelessWidget {
  final Widget child;

  const HomeScreen({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: _BottomNav(),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primaryGreen,
        onPressed: () => context.go('/home/scan'),
        child: const Icon(Icons.qr_code_scanner, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
    );
  }
}

class _BottomNav extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    
    int currentIndex = 0;
    if (location.startsWith('/home/report')) currentIndex = 0;
    if (location.startsWith('/home/wallet')) currentIndex = 1;
    // index 2 is scanner fab
    if (location.startsWith('/home/leaderboard')) currentIndex = 3;
    if (location.startsWith('/home/profile')) currentIndex = 4;

    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: (index) {
        switch (index) {
          case 0: context.go('/home/report'); break;
          case 1: context.go('/home/wallet'); break;
          case 3: context.go('/home/leaderboard'); break;
          case 4: context.go('/home/profile'); break;
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.report_problem), label: 'Report'),
        BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
        BottomNavigationBarItem(icon: Icon(Icons.circle, color: Colors.transparent), label: 'Scan'),
        BottomNavigationBarItem(icon: Icon(Icons.leaderboard), label: 'Ranks'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
      ],
    );
  }
}
