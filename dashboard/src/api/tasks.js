import api from './axios';

// Mock data for when backend is not connected
const MOCK_TASKS = {
  open: [
    { id: '1', title: 'Overflowing Bin — Fountain Square', address: 'Fountain Sq, District 3', priority: 'urgent', timeAgo: '5 min ago', type: 'full_bin' },
    { id: '2', title: 'Broken Street Light', address: '14 Nizami St', priority: 'medium', timeAgo: '1 hour ago', type: 'broken_light' },
    { id: '3', title: 'Illegal Dumping Spot', address: 'Heydar Aliyev Ave', priority: 'high', timeAgo: '2 hours ago', type: 'illegal_dumping' },
  ],
  assigned: [
    { id: '4', title: 'Full Bin Pickup', address: 'Bulvar, Section B', worker: 'Rauf Əliyev', priority: 'high', timeAgo: '30 min ago', type: 'full_bin' },
    { id: '5', title: 'Road Pothole', address: '28 May St', worker: 'Nigar Həsənova', priority: 'medium', timeAgo: '3 hours ago', type: 'road_damage' },
  ],
  in_progress: [
    { id: '6', title: 'Bin Replacement', address: 'Sahil Metro', worker: 'Tural Məmmədov', priority: 'medium', timeAgo: '1 hour ago', type: 'broken_bin' },
  ],
  resolved: [
    { id: '7', title: 'Overflowing Bin', address: 'Koroğlu Metro', worker: 'Leyla Quliyeva', priority: 'high', timeAgo: '2 days ago', type: 'full_bin' },
    { id: '8', title: 'Street Light Fixed', address: '20 January Ave', worker: 'Rauf Əliyev', priority: 'low', timeAgo: '3 days ago', type: 'broken_light' },
  ],
};

export const getTasks = async () => {
  try {
    const { data } = await api.get('/tasks');
    // Group by status
    const grouped = { open: [], assigned: [], in_progress: [], resolved: [] };
    data.forEach(t => {
      if (grouped[t.status]) grouped[t.status].push(t);
    });
    return grouped;
  } catch {
    // Return mock data if API unavailable
    return MOCK_TASKS;
  }
};

export const createTask = async (taskData) => {
  try {
    const { data } = await api.post('/tasks', taskData);
    return data;
  } catch {
    return { id: Date.now(), ...taskData, status: 'open' };
  }
};

export const assignTask = async (taskId, workerId) => {
  try {
    const { data } = await api.put(`/tasks/${taskId}/assign`, { worker_id: workerId });
    return data;
  } catch {
    return { success: true };
  }
};

export const resolveTask = async (taskId, afterPhotoUrl) => {
  try {
    const { data } = await api.put(`/tasks/${taskId}/resolve`, { after_photo_url: afterPhotoUrl });
    return data;
  } catch {
    return { success: true };
  }
};

export const getTaskStats = async () => {
  try {
    const { data } = await api.get('/tasks/stats');
    return data;
  } catch {
    return {
      total: 24,
      open: 3,
      assigned: 2,
      in_progress: 1,
      resolved: 18,
      resolved_this_week: 12,
    };
  }
};
