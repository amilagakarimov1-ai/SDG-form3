import BinMap from '../components/Map/BinMap';

export default function MapPage() {
  return (
    <div style={{ height: 'calc(100vh - 80px)' }} className="rounded-xl overflow-hidden">
      <BinMap />
    </div>
  );
}
