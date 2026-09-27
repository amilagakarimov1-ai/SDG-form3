import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants.dart';
import '../../../shared/widgets/green_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  bool _isCitizen = true;
  bool _acceptedTerms = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Register')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: _RoleCard(
                    title: 'Citizen',
                    icon: Icons.person,
                    isSelected: _isCitizen,
                    onTap: () => setState(() => _isCitizen = true),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _RoleCard(
                    title: 'Municipality',
                    icon: Icons.location_city,
                    isSelected: !_isCitizen,
                    onTap: () => setState(() => _isCitizen = false),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            TextField(
              decoration: InputDecoration(hintText: _isCitizen ? 'Full Name' : 'Official Name'),
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(hintText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(hintText: 'Phone'),
              keyboardType: TextInputType.phone,
            ),
            if (!_isCitizen) ...[
              const SizedBox(height: 16),
              const TextField(decoration: InputDecoration(hintText: 'Municipality Name')),
              const SizedBox(height: 16),
              const TextField(decoration: InputDecoration(hintText: 'District')),
            ],
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(hintText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Checkbox(
                  value: _acceptedTerms,
                  activeColor: AppColors.primaryGreen,
                  onChanged: (val) => setState(() => _acceptedTerms = val ?? false),
                ),
                const Expanded(
                  child: Text('I accept the Terms & Conditions', style: TextStyle(color: AppColors.textLight)),
                ),
              ],
            ),
            const SizedBox(height: 32),
            GreenButton(
              text: 'Register',
              isFullWidth: true,
              onPressed: _acceptedTerms ? () {
                // Mock registration
                context.go('/login');
              } : null,
            ),
          ],
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const _RoleCard({
    required this.title,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 24),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryGreen.withOpacity(0.2) : AppColors.cardDark,
          border: Border.all(
            color: isSelected ? AppColors.primaryGreen : Colors.transparent,
            width: 2,
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(icon, size: 40, color: isSelected ? AppColors.primaryGreen : AppColors.textMuted),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? AppColors.primaryGreen : AppColors.textMuted,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
