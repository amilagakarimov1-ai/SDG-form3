import { create } from 'zustand';

const useMapStore = create((set) => ({
  bins: [],
  selectedBin: null,
  routeData: null,
  filters: 'all', // all, empty, half_full, full, overflowing
  setBins: (bins) => set({ bins }),
  setSelectedBin: (bin) => set({ selectedBin: bin }),
  setRouteData: (route) => set({ routeData: route }),
  setFilters: (filter) => set({ filters: filter }),
}));

export default useMapStore;
