import 'package:flutter/material.dart';

enum ReportStatus { pendingAi, confirmed, rejected, taskCreated }
enum AiVerdict { confirmed, rejected, manualReview }
enum TaskPriority { low, medium, high, urgent }
enum TaskStatus { open, assigned, inProgress, resolved, closed }

/// Color-coded status badge widget.
class StatusBadge extends StatelessWidget {
  final String label;
  final Color color;
  final IconData? icon;

  const StatusBadge({
    super.key,
    required this.label,
    required this.color,
    this.icon,
  });

  factory StatusBadge.fromReportStatus(String status) {
    switch (status) {
      case 'confirmed':
        return StatusBadge(label: 'Confirmed', color: Colors.green, icon: Icons.check_circle);
      case 'rejected':
        return StatusBadge(label: 'Rejected', color: Colors.red, icon: Icons.cancel);
      case 'task_created':
        return StatusBadge(label: 'Task Created', color: Colors.blue, icon: Icons.assignment);
      case 'pending_ai':
      default:
        return StatusBadge(label: 'Pending AI', color: Colors.orange, icon: Icons.hourglass_empty);
    }
  }

  factory StatusBadge.fromVerdict(String? verdict) {
    switch (verdict) {
      case 'confirmed':
        return StatusBadge(label: 'AI Confirmed', color: Colors.green, icon: Icons.smart_toy);
      case 'rejected':
        return StatusBadge(label: 'AI Rejected', color: Colors.red, icon: Icons.smart_toy);
      case 'manual_review':
      default:
        return StatusBadge(label: 'Under Review', color: Colors.orange, icon: Icons.pending);
    }
  }

  factory StatusBadge.fromPriority(String priority) {
    switch (priority) {
      case 'urgent':
        return StatusBadge(label: 'Urgent', color: Colors.red.shade700);
      case 'high':
        return StatusBadge(label: 'High', color: Colors.orange);
      case 'low':
        return StatusBadge(label: 'Low', color: Colors.green);
      case 'medium':
      default:
        return StatusBadge(label: 'Medium', color: Colors.yellow.shade700);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
