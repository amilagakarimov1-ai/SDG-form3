import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:geolocator/geolocator.dart';
import '../../../core/constants.dart';
import '../../../shared/widgets/green_button.dart';

enum ReportState { typeSelection, camera, gps, preview, loading, result }

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  ReportState _state = ReportState.typeSelection;
  String _selectedType = '';
  
  CameraController? _cameraController;
  XFile? _photoFile;
  Position? _position;
  bool _isSuccess = false;

  final List<Map<String, dynamic>> _issueTypes = [
    {'id': 'full_bin', 'title': 'Full Trash Bin', 'icon': Icons.delete_outline, 'color': Colors.orange},
    {'id': 'road_damage', 'title': 'Road Damage', 'icon': Icons.add_road, 'color': Colors.red},
    {'id': 'broken_light', 'title': 'Broken Light', 'icon': Icons.lightbulb_outline, 'color': Colors.yellow},
    {'id': 'illegal_dumping', 'title': 'Illegal Dumping', 'icon': Icons.warning_amber, 'color': Colors.purple},
  ];

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  Future<void> _initCamera() async {
    final cameras = await availableCameras();
    if (cameras.isEmpty) return;
    
    _cameraController = CameraController(cameras.first, ResolutionPreset.high, enableAudio: false);
    await _cameraController!.initialize();
    if (mounted) setState(() {});
  }

  Future<void> _takePhoto() async {
    if (_cameraController == null || !_cameraController!.value.isInitialized) return;
    
    try {
      final file = await _cameraController!.takePicture();
      setState(() {
        _photoFile = file;
        _state = ReportState.gps;
      });
      _getLocation();
    } catch (e) {
      debugPrint('Error taking photo: $e');
    }
  }

  Future<void> _getLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return; // Handle error

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return;
    }
    
    Position position = await Geolocator.getCurrentPosition();
    setState(() {
      _position = position;
      _state = ReportState.preview;
    });
  }

  Future<void> _submitReport() async {
    setState(() => _state = ReportState.loading);
    // Mock AI analysis API call
    await Future.delayed(const Duration(seconds: 3));
    setState(() {
      _isSuccess = true; // Simulate success
      _state = ReportState.result;
    });
  }

  void _reset() {
    setState(() {
      _state = ReportState.typeSelection;
      _photoFile = null;
      _position = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Report Issue')),
      body: _buildCurrentState(),
    );
  }

  Widget _buildCurrentState() {
    switch (_state) {
      case ReportState.typeSelection: return _buildTypeSelection();
      case ReportState.camera: return _buildCamera();
      case ReportState.gps: return _buildGpsLoading();
      case ReportState.preview: return _buildPreview();
      case ReportState.loading: return _buildLoading();
      case ReportState.result: return _buildResult();
    }
  }

  Widget _buildTypeSelection() {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: _issueTypes.length,
      itemBuilder: (context, index) {
        final item = _issueTypes[index];
        return InkWell(
          onTap: () {
            setState(() {
              _selectedType = item['title'];
              _state = ReportState.camera;
            });
            _initCamera();
          },
          child: Container(
            decoration: BoxDecoration(
              color: AppColors.cardDark,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: item['color'].withOpacity(0.5), width: 2),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(item['icon'], size: 48, color: item['color']),
                const SizedBox(height: 16),
                Text(item['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildCamera() {
    if (_cameraController == null || !_cameraController!.value.isInitialized) {
      return const Center(child: CircularProgressIndicator());
    }
    return Stack(
      children: [
        SizedBox(
          width: double.infinity,
          height: double.infinity,
          child: CameraPreview(_cameraController!),
        ),
        Positioned(
          bottom: 32,
          left: 0,
          right: 0,
          child: Center(
            child: FloatingActionButton(
              onPressed: _takePhoto,
              backgroundColor: AppColors.primaryGreen,
              child: const Icon(Icons.camera_alt, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGpsLoading() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(color: AppColors.primaryGreen),
          SizedBox(height: 24),
          Text('Getting your location...'),
        ],
      ),
    );
  }

  Widget _buildPreview() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.file(File(_photoFile!.path), height: 300, fit: BoxFit.cover),
          ),
          const SizedBox(height: 24),
          ListTile(
            tileColor: AppColors.cardDark,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            leading: const Icon(Icons.info_outline, color: AppColors.primaryGreen),
            title: const Text('Issue Type'),
            subtitle: Text(_selectedType),
          ),
          const SizedBox(height: 12),
          ListTile(
            tileColor: AppColors.cardDark,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            leading: const Icon(Icons.location_on, color: AppColors.primaryGreen),
            title: const Text('Location Attached'),
            subtitle: Text('Lat: ${_position?.latitude.toStringAsFixed(4)}, Lng: ${_position?.longitude.toStringAsFixed(4)}'),
          ),
          const SizedBox(height: 32),
          GreenButton(
            text: 'Submit Report',
            isFullWidth: true,
            icon: Icons.send,
            onPressed: _submitReport,
          ),
          TextButton(
            onPressed: _reset,
            child: const Text('Cancel', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Widget _buildLoading() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(color: AppColors.primaryGreen),
          SizedBox(height: 24),
          Text('AI is analyzing your report...', style: TextStyle(fontSize: 18)),
        ],
      ),
    );
  }

  Widget _buildResult() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            _isSuccess ? Icons.check_circle : Icons.error,
            color: _isSuccess ? AppColors.primaryGreen : Colors.red,
            size: 100,
          ),
          const SizedBox(height: 24),
          Text(
            _isSuccess ? 'Report Verified!' : 'Verification Failed',
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          if (_isSuccess) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.primaryGreen.withOpacity(0.2),
                borderRadius: BorderRadius.circular(30),
              ),
              child: const Text(
                '+25 Green Coins Earned!',
                style: TextStyle(color: AppColors.primaryGreen, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ] else ...[
            const SizedBox(height: 16),
            const Text('AI could not confirm the issue. Please retake the photo clearer.'),
          ],
          const SizedBox(height: 48),
          GreenButton(
            text: 'Back to Home',
            onPressed: _reset,
          ),
        ],
      ),
    );
  }
}
