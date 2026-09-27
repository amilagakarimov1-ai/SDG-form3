import 'dart:io';
import '../../../core/api_client.dart';

class ReportRepository {
  final ApiClient _client;

  ReportRepository({ApiClient? client}) : _client = client ?? ApiClient();

  /// Submit a new report with a photo file and location.
  /// Returns the report response including AI verdict and coins awarded.
  Future<Map<String, dynamic>> submitReport({
    required File photoFile,
    required String reportType,
    required double latitude,
    required double longitude,
    String? binId,
    String? description,
  }) async {
    final response = await _client.postMultipart(
      '/reports',
      filePath: photoFile.path,
      fileField: 'file',
      fields: {
        'data': '''{
          "report_type": "$reportType",
          "latitude": $latitude,
          "longitude": $longitude
          ${binId != null ? ',"bin_id": "$binId"' : ''}
          ${description != null ? ',"description": "$description"' : ''}
        }''',
      },
    );
    return response.data as Map<String, dynamic>;
  }

  /// Get all reports submitted by the current user.
  Future<List<dynamic>> getMyReports() async {
    final response = await _client.get('/reports/my');
    return response.data as List<dynamic>;
  }
}
