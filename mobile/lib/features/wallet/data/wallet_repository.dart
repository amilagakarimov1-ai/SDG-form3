import '../../../core/api_client.dart';

class WalletRepository {
  final ApiClient _client;

  WalletRepository({ApiClient? client}) : _client = client ?? ApiClient();

  /// Get current user's Green Coin wallet: balance + transactions.
  Future<Map<String, dynamic>> getWallet() async {
    final response = await _client.get('/coins/wallet');
    return response.data as Map<String, dynamic>;
  }

  /// Spend coins via QR code scan at EV charger or partner store.
  Future<Map<String, dynamic>> spendViaQR({
    required String qrCode,
    required int amount,
  }) async {
    final response = await _client.post('/coins/spend/qr', data: {
      'qr_code': qrCode,
      'amount': amount,
    });
    return response.data as Map<String, dynamic>;
  }

  /// Get the top leaderboard (top 20 citizens by coin balance).
  Future<List<dynamic>> getLeaderboard() async {
    final response = await _client.get('/coins/leaderboard');
    return response.data as List<dynamic>;
  }

  /// Get list of partner stores and EV chargers accepting Green Coins.
  Future<List<dynamic>> getPartners() async {
    final response = await _client.get('/coins/partners');
    return response.data as List<dynamic>;
  }
}
