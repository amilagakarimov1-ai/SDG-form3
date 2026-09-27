class ReportModel {
  final String id;
  final String reportType;
  final double latitude;
  final double longitude;
  final String? photoUrl;
  final String? description;
  final double? aiConfidence;
  final String? aiVerdict;
  final int coinsAwarded;
  final String status;
  final DateTime createdAt;

  const ReportModel({
    required this.id,
    required this.reportType,
    required this.latitude,
    required this.longitude,
    this.photoUrl,
    this.description,
    this.aiConfidence,
    this.aiVerdict,
    required this.coinsAwarded,
    required this.status,
    required this.createdAt,
  });

  factory ReportModel.fromJson(Map<String, dynamic> json) {
    return ReportModel(
      id: json['id'] as String,
      reportType: json['report_type'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      photoUrl: json['photo_url'] as String?,
      description: json['description'] as String?,
      aiConfidence: json['ai_confidence'] != null
          ? (json['ai_confidence'] as num).toDouble()
          : null,
      aiVerdict: json['ai_verdict'] as String?,
      coinsAwarded: (json['coins_awarded'] as num? ?? 0).toInt(),
      status: json['status'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  bool get isConfirmed => aiVerdict == 'confirmed';
  bool get isRejected => aiVerdict == 'rejected';
  bool get isPending => status == 'pending_ai';

  String get typeLabel {
    switch (reportType) {
      case 'full_bin': return 'Full Trash Bin';
      case 'broken_bin': return 'Broken Bin';
      case 'road_damage': return 'Road Damage';
      case 'broken_light': return 'Broken Light';
      case 'illegal_dumping': return 'Illegal Dumping';
      default: return 'Other';
    }
  }
}
