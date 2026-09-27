import 'package:flutter/material.dart';
import '../../core/constants.dart';

/// Reusable animated coin badge showing a Green Coin icon and amount.
class CoinBadge extends StatelessWidget {
  final int amount;
  final bool showPlus;
  final double fontSize;

  const CoinBadge({
    super.key,
    required this.amount,
    this.showPlus = false,
    this.fontSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.primaryGreen.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primaryGreen.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.eco, color: AppColors.primaryGreen, size: 18),
          const SizedBox(width: 6),
          Text(
            '${showPlus && amount > 0 ? '+' : ''}$amount',
            style: TextStyle(
              color: AppColors.primaryGreen,
              fontWeight: FontWeight.bold,
              fontSize: fontSize,
            ),
          ),
        ],
      ),
    );
  }
}
