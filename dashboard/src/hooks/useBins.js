import { useQuery } from 'react-query';
import { getBinsForMap } from '../api/bins';

export const useBins = () => {
  return useQuery('bins', async () => {
    const { data } = await getBinsForMap();
    return data;
  }, {
    refetchInterval: 60000, // Live refresh every 60s
  });
};
