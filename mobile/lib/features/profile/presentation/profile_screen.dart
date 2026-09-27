import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants.dart';
import '../../../core/router.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              ref.read(authStateProvider.notifier).state = false;
              context.go('/login');
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 50,
              backgroundColor: AppColors.primaryGreen,
              child: Text('JD', style: TextStyle(fontSize: 32, color: Colors.white, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 16),
            const Text('John Doe', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const Text('john.doe@example.com', style: TextStyle(color: AppColors.textMuted)),
            const SizedBox(height: 32),
            _buildStats(),
            const SizedBox(height: 32),
            _buildSettingsList(),
          ],
        ),
      ),
    );
  }

  Widget _buildStats() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildStatItem('Reports', '18'),
        _buildStatItem('Coins', '450'),
        _buildStatItem('Rank', '#42'),
      ],
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.primaryGreen)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: AppColors.textMuted)),
      ],
    );
  }

  Widget _buildSettingsList() {
    return Column(
      children: [
        ListTile(
          leading: const Icon(Icons.notifications_active),
          title: const Text('Push Notifications'),
          trailing: Switch(value: true, activeColor: AppColors.primaryGreen, onChanged: (v) {}),
        ),
        const ListTile(
          leading: Icon(Icons.language),
          title: Text('Language'),
          trailing: Icon(Icons.chevron_right),
        ),
        const ListTile(
          leading: Icon(Icons.info),
          title: Text('About FixiFy'),
          trailing: Icon(Icons.chevron_right),
        ),
      ],
    );
  }
}
