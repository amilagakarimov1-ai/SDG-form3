import api from './axios';

// Baku city mock bins — used when backend is not connected
const BAKU_MOCK_BINS = [
  { id: '1', lat: 40.4093, lng: 49.8671, status: 'full', address: 'Fountain Square, İçəri Şəhər', lastReported: '5 min ago', name: 'Bin #001' },
  { id: '2', lat: 40.4023, lng: 49.8520, status: 'empty', address: 'Sahil Metro, Baku', lastReported: '1 hour ago', name: 'Bin #002' },
  { id: '3', lat: 40.4083, lng: 49.8751, status: 'half_full', address: 'Bulvar Park, Section A', lastReported: '30 min ago', name: 'Bin #003' },
  { id: '4', lat: 40.4150, lng: 49.8510, status: 'overflowing', address: 'Bulvar Park, Section B', lastReported: 'Just now', name: 'Bin #004' },
  { id: '5', lat: 40.3953, lng: 49.8427, status: 'empty', address: 'Nizami Street, Center', lastReported: '2 hours ago', name: 'Bin #005' },
  { id: '6', lat: 40.4170, lng: 49.8630, status: 'full', address: 'Heydar Aliyev Center', lastReported: '15 min ago', name: 'Bin #006' },
  { id: '7', lat: 40.4010, lng: 49.8600, status: 'half_full', address: '28 May Street', lastReported: '45 min ago', name: 'Bin #007' },
  { id: '8', lat: 40.4200, lng: 49.8450, status: 'full', address: 'Koroğlu Metro', lastReported: '10 min ago', name: 'Bin #008' },
  { id: '9', lat: 40.3900, lng: 49.8700, status: 'empty', address: 'Narimanov District', lastReported: '3 hours ago', name: 'Bin #009' },
  { id: '10', lat: 40.4250, lng: 49.8550, status: 'overflowing', address: 'Binəqədi Market', lastReported: '2 min ago', name: 'Bin #010' },
];

export const getBinsForMap = async () => {
  try {
    const { data } = await api.get('/bins/map');
    // Normalize backend response to {id, lat, lng, status, address, name}
    return {
      data: data.map(b => ({
        id: b.id,
        lat: b.latitude,
        lng: b.longitude,
        status: b.status,
        address: b.address,
        name: b.name,
        lastReported: b.last_reported_at
          ? new Date(b.last_reported_at).toLocaleTimeString()
          : 'Unknown',
      })),
    };
  } catch {
    // Fallback to Baku mock data
    return { data: BAKU_MOCK_BINS };
  }
};

export const updateBinStatus = async (id, status) => {
  try {
    const { data } = await api.put(`/bins/${id}`, { status });
    return data;
  } catch {
    return { success: true };
  }
};

export const getBinStats = async () => {
  try {
    const { data } = await api.get('/bins/stats');
    return data;
  } catch {
    const counts = BAKU_MOCK_BINS.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
    return counts;
  }
};
