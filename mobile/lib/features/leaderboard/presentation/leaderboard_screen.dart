import 'package:flutter/material.dart';
import '../../../core/constants.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Leaderboard')),
      body: Column(
        children: [
          _buildMyRank(),
          const SizedBox(height: 16),
          Expanded(
            child: _buildRankList(),
          ),
        ],
      ),
    );
  }

  Widget _buildMyRank() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primaryGreen.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryGreen),
      ),
      child: const Row(
        children: [
          CircleAvatar(
            backgroundColor: AppColors.primaryGreen,
            child: Text('42', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('You', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text('450 Coins', style: TextStyle(color: AppColors.primaryGreen)),
              ],
            ),
          ),
          Icon(Icons.emoji_events, color: AppColors.gold),
        ],
      ),
    );
  }

  Widget _buildRankList() {
    final mockUsers = [
      {'name': 'Alex M.', 'coins': 1250},
      {'name': 'Sarah K.', 'coins': 1100},
      {'name': 'John D.', 'coins': 950},
      {'name': 'Emma W.', 'coins': 820},
      {'name': 'Michael R.', 'coins': 780},
      {'name': 'Sophie L.', 'coins': 650},
    ];

    return ListView.builder(
      itemCount: mockUsers.length,
      itemBuilder: (context, index) {
        final user = mockUsers[index];
        final rank = index + 1;
        Color? rankColor;
        if (rank == 1) rankColor = AppColors.gold;
        if (rank == 2) rankColor = AppColors.silver;
        if (rank == 3) rankColor = AppColors.bronze;

        return ListTile(
          leading: Container(
            width: 40,
            alignment: Alignment.center,
            child: Text(
              '#$rank',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: rankColor ?? Colors.white,
              ),
            ),
          ),
          title: Text(user['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
          trailing: Text(
            '${user['coins']} 🪙',
            style: const TextStyle(color: AppColors.primaryGreen, fontWeight: FontWeight.bold, fontSize: 16),
          ),
        );
      },
    );
  }
}
