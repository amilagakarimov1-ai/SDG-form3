import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../api_client.dart';
import 'package:dio/dio.dart';

class AuthRepository {
  final ApiClient _client;
  final FlutterSecureStorage _storage;

  AuthRepository({ApiClient? client, FlutterSecureStorage? storage})
      : _client = client ?? ApiClient(),
        _storage = storage ?? const FlutterSecureStorage();

  /// Login with email and password. Returns token on success.
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _client.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    final token = response.data['access_token'] as String;
    final role = response.data['token_type'] ?? 'citizen';
    await _storage.write(key: 'access_token', value: token);
    await _storage.write(key: 'user_role', value: role);
    return response.data;
  }

  /// Register as a citizen.
  Future<void> registerCitizen({
    required String email,
    required String password,
    required String fullName,
    required String phone,
  }) async {
    await _client.post('/auth/register/citizen', data: {
      'email': email,
      'password': password,
      'full_name': fullName,
      'phone': phone,
    });
  }

  /// Register as municipality official.
  Future<void> registerMunicipality({
    required String email,
    required String password,
    required String fullName,
    required String phone,
    required String municipalityName,
    required String district,
  }) async {
    await _client.post('/auth/register/municipality', data: {
      'email': email,
      'password': password,
      'full_name': fullName,
      'phone': phone,
      'municipality_name': municipalityName,
      'district': district,
    });
  }

  /// Get current user profile.
  Future<Map<String, dynamic>> getMe() async {
    final response = await _client.get('/auth/me');
    return response.data;
  }

  /// Logout — clears local storage.
  Future<void> logout() async {
    await _storage.deleteAll();
  }

  /// Check if user is logged in.
  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'access_token');
    return token != null && token.isNotEmpty;
  }

  /// Get stored token.
  Future<String?> getToken() async {
    return await _storage.read(key: 'access_token');
  }
}
