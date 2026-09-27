import api from './axios';

export const getOptimalRoute = async (municipalityId, startLat, startLon) => {
  try {
    const { data } = await api.get('/truck-routes/optimize', {
      params: { municipality_id: municipalityId, start_lat: startLat, start_lon: startLon },
    });
    return data;
  } catch {
    // Return mock route for Baku
    return {
      waypoints: [
        { lat: 40.4093, lon: 49.8671, address: 'Fountain Square', status: 'full' },
        { lat: 40.4150, lon: 49.8510, address: 'Bulvar Section B', status: 'overflowing' },
        { lat: 40.4200, lon: 49.8300, address: 'Heydar Aliyev Ave', status: 'full' },
      ],
      total_distance_km: 8.4,
      estimated_minutes: 32,
      bins_count: 3,
    };
  }
};

export const getLeaderboard = async () => {
  try {
    const { data } = await api.get('/coins/leaderboard');
    return data;
  } catch {
    return [
      { rank: 1, full_name: 'Aytən Məmmədova', coins: 1250, reports: 50 },
      { rank: 2, full_name: 'Rəşad Hüseynov', coins: 980, reports: 39 },
      { rank: 3, full_name: 'Günel Əliyeva', coins: 875, reports: 35 },
      { rank: 4, full_name: 'Elnur Babayev', coins: 725, reports: 29 },
      { rank: 5, full_name: 'Nigar Qasımova', coins: 650, reports: 26 },
      { rank: 6, full_name: 'Tural Hacıyev', coins: 575, reports: 23 },
      { rank: 7, full_name: 'Sevinc Rzayeva', coins: 500, reports: 20 },
      { rank: 8, full_name: 'Kamran İsmayılov', coins: 450, reports: 18 },
      { rank: 9, full_name: 'Lalə Nəcəfova', coins: 400, reports: 16 },
      { rank: 10, full_name: 'Orxan Əhmədov', coins: 375, reports: 15 },
    ];
  }
};
