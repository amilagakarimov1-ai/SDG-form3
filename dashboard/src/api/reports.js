import api from './axios';

const MOCK_REPORTS = [
  { id: '1', report_type: 'full_bin', latitude: 40.4093, longitude: 49.8671, address: 'Fountain Square, Baku', ai_verdict: 'confirmed', ai_confidence: 0.92, status: 'task_created', coins_awarded: 25, created_at: new Date(Date.now() - 5 * 60000).toISOString(), photo_url: null },
  { id: '2', report_type: 'road_damage', latitude: 40.4023, longitude: 49.8520, address: '28 May Street, Baku', ai_verdict: 'confirmed', ai_confidence: 0.85, status: 'task_created', coins_awarded: 25, created_at: new Date(Date.now() - 60 * 60000).toISOString(), photo_url: null },
  { id: '3', report_type: 'broken_light', latitude: 40.3953, longitude: 49.8427, address: 'Nizami Street, Baku', ai_verdict: 'manual_review', ai_confidence: 0.55, status: 'pending_ai', coins_awarded: 0, created_at: new Date(Date.now() - 2 * 3600000).toISOString(), photo_url: null },
  { id: '4', report_type: 'full_bin', latitude: 40.4150, longitude: 49.8510, address: 'Bulvar, Baku', ai_verdict: 'rejected', ai_confidence: 0.22, status: 'rejected', coins_awarded: 0, created_at: new Date(Date.now() - 5 * 3600000).toISOString(), photo_url: null },
  { id: '5', report_type: 'illegal_dumping', latitude: 40.4200, longitude: 49.8300, address: 'Heydar Aliyev Ave', ai_verdict: 'confirmed', ai_confidence: 0.89, status: 'task_created', coins_awarded: 25, created_at: new Date(Date.now() - 86400000).toISOString(), photo_url: null },
];

export const getReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('report_type', filters.type);
    const { data } = await api.get(`/reports?${params}`);
    return data;
  } catch {
    let result = [...MOCK_REPORTS];
    if (filters.status) result = result.filter(r => r.status === filters.status);
    if (filters.type) result = result.filter(r => r.report_type === filters.type);
    return result;
  }
};

export const getReportById = async (id) => {
  try {
    const { data } = await api.get(`/reports/${id}`);
    return data;
  } catch {
    return MOCK_REPORTS.find(r => r.id === id) || null;
  }
};

export const getReportStats = async () => {
  try {
    const { data } = await api.get('/reports/stats');
    return data;
  } catch {
    return {
      total_today: 142,
      confirmed_today: 98,
      rejected_today: 22,
      pending_today: 22,
      coins_awarded_total: 45200,
    };
  }
};
