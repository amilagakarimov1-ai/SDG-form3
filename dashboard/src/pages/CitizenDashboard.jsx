import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera, Leaf, QrCode, LogOut, CheckCircle, Clock, XCircle,
  ChevronRight, ChevronLeft, X, MapPin, Loader2, Trophy,
  Trash2, AlertTriangle, Lightbulb, Ban, Package, HelpCircle,
  SwitchCamera, FlipHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

/* ─── Demo Data ─── */
const PROBLEM_TYPES = [
  { id: 'bin',    icon: Trash2,        emoji: '🗑️', label: 'Dolu Zibil Qutusu', color: 'bg-orange-500/20 text-orange-400', coins: 25 },
  { id: 'road',   icon: AlertTriangle, emoji: '🚧', label: 'Yol Zədəsi',         color: 'bg-yellow-500/20 text-yellow-400', coins: 30 },
  { id: 'light',  icon: Lightbulb,     emoji: '💡', label: 'Sınmış İşıq',        color: 'bg-blue-500/20 text-blue-400',    coins: 20 },
  { id: 'litter', icon: Ban,           emoji: '🚯', label: 'Qanunsuz Zibil',     color: 'bg-red-500/20 text-red-400',      coins: 25 },
  { id: 'box',    icon: Package,       emoji: '♻️', label: 'Sınmış Qutu',        color: 'bg-purple-500/20 text-purple-400', coins: 15 },
  { id: 'other',  icon: HelpCircle,   emoji: '❓', label: 'Digər',              color: 'bg-slate-500/20 text-slate-400',  coins: 10 },
];

const INITIAL_REPORTS = [
  { id: 1, type: 'Dolu Zibil Qutusu',  location: 'Sahil metrosu yaxınlığı',  status: 'Təsdiqləndi', coins: 25, date: 'Bu gün, 10:30' },
  { id: 2, type: 'Sınmış İşıq Dirəyi', location: 'Fəvvarələr meydanı',       status: 'Gözləyir',    coins: 0,  date: 'Dünən, 18:45' },
  { id: 3, type: 'Dolu Zibil Qutusu',  location: 'İçərişəhər',               status: 'Təsdiqləndi', coins: 25, date: '25 Sentyabr, 14:20' },
  { id: 4, type: 'Yol Zədəsi',          location: 'Nizami küçəsi, 45',        status: 'Rədd edildi', coins: 0,  date: '24 Sentyabr, 09:15' },
  { id: 5, type: 'Qanunsuz Zibil',      location: 'H.Əliyev Mərkəzi',        status: 'Gözləyir',    coins: 0,  date: '23 Sentyabr, 16:00' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Narmin Həsənova', coins: 1240, badge: '🥇' },
  { rank: 2, name: 'Rauf Əliyev',     coins: 980,  badge: '🥈' },
  { rank: 3, name: 'Sevinc Abbasova', coins: 870,  badge: '🥉' },
  { rank: 4, name: 'Murad Quliyev',   coins: 760,  badge: '⭐' },
  { rank: 5, name: 'Əli Əliyev',      coins: 450,  badge: '⭐', isMe: true },
];

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const cfg = {
    'Təsdiqləndi': 'bg-green-500/20 text-green-400',
    'Gözləyir':    'bg-yellow-500/20 text-yellow-400',
    'Rədd edildi': 'bg-red-500/20 text-red-400',
  };
  const Icon = { 'Təsdiqləndi': CheckCircle, 'Gözləyir': Clock, 'Rədd edildi': XCircle }[status] || Clock;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cfg[status] || cfg['Gözləyir']}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
}

/* ─── Confetti ─── */
function Confetti() {
  const colors = ['bg-green-400','bg-yellow-400','bg-blue-400','bg-pink-400','bg-purple-400'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className={`absolute w-2 h-2 rounded-full ${colors[i%colors.length]} animate-bounce`}
          style={{ left:`${(i*13+7)%100}%`, top:`${(i*17+5)%100}%`, animationDelay:`${(i*0.1).toFixed(1)}s`, animationDuration:`${0.6+((i%4)*0.2)}s` }} />
      ))}
    </div>
  );
}

/* ─── Camera Hook ─── */
function useCameraStream(active) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // back camera by default
  const [error, setError] = useState(null);

  const startCamera = useCallback(async (mode) => {
    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode || 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.name === 'NotAllowedError' ? 'Kamera icazəsi rədd edildi. Brauzer ayarlarından icazə verin.' : 'Kamera açıla bilmədi: ' + err.message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const flipCamera = useCallback(() => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  }, []);

  useEffect(() => {
    if (active) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [active]); // eslint-disable-line

  return { videoRef, error, flipCamera, capturePhoto, stopCamera };
}

/* ═══════════════════════════════════════
   QR PAYMENT MODAL — uses real camera + jsQR
═══════════════════════════════════════ */
function QRPaymentModal({ balance, onConfirm, onClose }) {
  const [phase, setPhase] = useState('scanning'); // scanning | confirm | done
  const [scanStatus, setScanStatus] = useState('Kamera açılır...');
  const { videoRef, error, flipCamera } = useCameraStream(phase === 'scanning');
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const scannedRef = useRef(false);

  // Try to scan QR from video frames using jsQR (loaded dynamically)
  useEffect(() => {
    if (phase !== 'scanning') return;
    let jsQR = null;

    const tryLoad = async () => {
      try {
        // Load jsQR dynamically if available, otherwise just show demo
        const mod = await import('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js').catch(() => null);
        jsQR = mod?.default || window.jsQR;
      } catch {
        jsQR = window.jsQR;
      }
    };
    tryLoad();

    const scanFrame = () => {
      if (scannedRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        setScanStatus('QR kodu kameranıza göstərin');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        if (jsQR) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);
          if (code) {
            scannedRef.current = true;
            setScanStatus('QR tapıldı! ✅');
            setTimeout(() => setPhase('confirm'), 600);
            return;
          }
        }
      }
      rafRef.current = requestAnimationFrame(scanFrame);
    };
    rafRef.current = requestAnimationFrame(scanFrame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, videoRef]);

  const handleDemoScan = () => {
    scannedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setTimeout(() => setPhase('confirm'), 300);
  };

  const handleConfirm = () => {
    onConfirm(50);
    setPhase('done');
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" /> QR Ödəniş
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {phase === 'scanning' && (
            <>
              {/* Live camera viewport */}
              <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden border-2 border-blue-500/40">
                {error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {/* Hidden canvas for QR scanning */}
                    <canvas ref={canvasRef} className="hidden" />
                    {/* Corner brackets */}
                    {['top-3 left-3 border-t-2 border-l-2 rounded-tl-lg',
                      'top-3 right-3 border-t-2 border-r-2 rounded-tr-lg',
                      'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg',
                      'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg'].map((cls, i) => (
                      <div key={i} className={`absolute w-8 h-8 border-blue-400 ${cls}`} />
                    ))}
                    {/* Scanning line */}
                    <div className="absolute left-3 right-3 h-0.5 bg-blue-400 shadow-[0_0_10px_3px_rgba(96,165,250,0.7)] animate-[scan_2s_ease-in-out_infinite]"
                      style={{ top: '50%' }} />
                    {/* Flip camera button */}
                    <button onClick={flipCamera}
                      className="absolute top-2 right-2 bg-black/60 rounded-full p-2 text-white hover:bg-black/80">
                      <FlipHorizontal className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-center text-slate-400 text-sm">{scanStatus}</p>
              {/* Demo button for desktop testing */}
              <button onClick={handleDemoScan}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                Demo: QR Tap Edildi (Masaüstü Test)
              </button>
            </>
          )}

          {phase === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 space-y-2">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Partnyor</p>
                <p className="text-white font-bold text-lg">SOCAR EV Şarj Stansiyası</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                  <span className="text-slate-400">Ödəniş:</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-1">
                    <Leaf className="w-4 h-4" /> 50 GC
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Qalıq:</span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <Leaf className="w-4 h-4" /> {balance - 50} GC
                  </span>
                </div>
              </div>
              <button onClick={handleConfirm}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors">
                Təsdiqlə
              </button>
              <button onClick={onClose} className="w-full text-slate-400 hover:text-white text-sm py-2 transition-colors">Ləğv et</button>
            </div>
          )}

          {phase === 'done' && (
            <div className="text-center py-6 space-y-3">
              <div className="text-6xl">✅</div>
              <p className="text-white font-bold text-xl">Ödəniş uğurludur!</p>
              <p className="text-slate-400 text-sm">Yeni balans: {balance - 50} GC</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REPORT MODAL — uses real camera (getUserMedia)
═══════════════════════════════════════ */
function ReportModal({ onSubmit, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [location] = useState('Bakı, Azərbaycan');
  const [coords] = useState({ lat: '40.4093', lng: '49.8671' });

  const { videoRef, error: camError, flipCamera, capturePhoto, stopCamera } = useCameraStream(cameraActive);

  // When entering step 2, open camera
  useEffect(() => {
    if (step === 2 && !photoDataUrl) setCameraActive(true);
    else setCameraActive(false);
  }, [step, photoDataUrl]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleCapture = () => {
    const dataUrl = capturePhoto();
    if (dataUrl) {
      setPhotoDataUrl(dataUrl);
      setCameraActive(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedType) { toast.error('Problem növünü seçin'); return; }
    if (step === 2 && !photoDataUrl) { toast.error('Şəkil çəkin'); return; }
    if (step === 3) { setStep(4); setTimeout(() => setStep(5), 2500); return; }
    if (step === 5) { onSubmit(selectedType); return; }
    setStep(s => s + 1);
  };

  const stepTitles = ['Problem növü', 'Şəkil çəkmə', 'Yer', 'AI Analiz', 'Nəticə'];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white">Yeni Müraciət</h2>
            <p className="text-xs text-slate-400 mt-0.5">Addım {Math.min(step,5)}/5 — {stepTitles[Math.min(step,5)-1]}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Progress bar */}
        <div className="px-5 pt-4 flex gap-1.5">
          {[1,2,3,4,5].map(n => (
            <div key={n} className={`h-1.5 flex-1 rounded-full transition-all ${n <= Math.min(step,5) ? 'bg-green-500' : 'bg-slate-700'}`} />
          ))}
        </div>

        <div className="p-5 min-h-[340px] flex flex-col">
          {/* Step 1 */}
          {step === 1 && (
            <div className="flex-1">
              <p className="text-slate-300 text-sm mb-4">Hansı problemi bildirmək istəyirsiniz?</p>
              <div className="grid grid-cols-2 gap-3">
                {PROBLEM_TYPES.map(pt => (
                  <button key={pt.id} onClick={() => setSelectedType(pt)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${selectedType?.id === pt.id ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'}`}>
                    <div className={`inline-flex p-2 rounded-lg ${pt.color} mb-2`}><pt.icon className="w-4 h-4" /></div>
                    <p className="text-white text-xs font-medium leading-tight">{pt.label}</p>
                    <p className="text-green-400 text-xs mt-1">+{pt.coins} GC</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — REAL CAMERA */}
          {step === 2 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              {photoDataUrl ? (
                /* Captured photo preview */
                <div className="relative w-full">
                  <img src={photoDataUrl} alt="Çəkilmiş şəkil" className="w-full h-52 object-cover rounded-xl border border-green-500/50" />
                  <button
                    onClick={() => { setPhotoDataUrl(null); setCameraActive(true); }}
                    className="absolute top-2 right-2 bg-black/70 rounded-full p-1.5 text-white hover:bg-red-600/80 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-600/90 text-white text-xs px-3 py-1 rounded-full font-bold">
                    ✅ Şəkil çəkildi
                  </div>
                </div>
              ) : (
                /* Live camera view */
                <div className="w-full flex flex-col items-center gap-3">
                  {camError ? (
                    <div className="w-full h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-4 border border-red-500/30 gap-3">
                      <Camera className="w-10 h-10 text-red-400" />
                      <p className="text-red-400 text-sm text-center">{camError}</p>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-700">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      {/* Flip camera */}
                      <button onClick={flipCamera}
                        className="absolute top-2 right-2 bg-black/60 rounded-full p-2 text-white hover:bg-black/80">
                        <FlipHorizontal className="w-4 h-4" />
                      </button>
                      {/* Capture viewfinder */}
                      <div className="absolute inset-0 border-4 border-transparent pointer-events-none">
                        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60 rounded-tl" />
                        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60 rounded-tr" />
                        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60 rounded-bl" />
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60 rounded-br" />
                      </div>
                    </div>
                  )}
                  {/* Capture button */}
                  {!camError && (
                    <button onClick={handleCapture}
                      className="w-16 h-16 rounded-full bg-white border-4 border-green-500 shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center">
                      <Camera className="w-7 h-7 text-slate-900" />
                    </button>
                  )}
                  <p className="text-slate-500 text-xs text-center">Düyməyə basaraq şəkil çəkin</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Location */}
          {step === 3 && (
            <div className="flex-1 space-y-4">
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">GPS Məlumatı</span>
                </div>
                <input type="text" value={location} readOnly
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm mb-3" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800 rounded-lg p-2">
                    <p className="text-slate-500">Enlik</p>
                    <p className="text-white font-mono">{coords.lat}°N</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2">
                    <p className="text-slate-500">Uzunluq</p>
                    <p className="text-white font-mono">{coords.lng}°E</p>
                  </div>
                </div>
              </div>
              {selectedType && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-sm text-green-300">
                  📋 {selectedType.label} — <span className="font-bold">+{selectedType.coins} GC</span> qazanacaqsınız
                </div>
              )}
            </div>
          )}

          {/* Step 4 — AI */}
          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-xl">AI analiz edir...</p>
                <p className="text-slate-400 text-sm mt-1">Şəkliniz süni intellekt tərəfindən yoxlanılır</p>
              </div>
              <div className="flex gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay:`${i*0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Result */}
          {step === 5 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 relative">
              <Confetti />
              <div className="text-7xl">✅</div>
              <div className="text-center z-10">
                <p className="text-white font-bold text-2xl">Uğurla göndərildi!</p>
                <p className="text-slate-400 text-sm mt-1">Müraciətiniz qəbul olundu</p>
              </div>
              <div className="bg-green-500/20 border border-green-500/40 rounded-2xl px-8 py-5 text-center z-10">
                <p className="text-green-300 text-sm font-medium">Qazandınız</p>
                <p className="text-green-400 font-extrabold text-4xl flex items-center justify-center gap-2 mt-1">
                  <Leaf className="w-8 h-8" />+{selectedType?.coins ?? 25} GC
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 4 && (
          <div className="p-5 border-t border-slate-700 flex gap-3">
            {step > 1 && step < 5 && (
              <button onClick={() => setStep(s => Math.max(1, s-1))}
                className="flex items-center gap-1 px-4 py-2.5 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl transition-colors text-sm">
                <ChevronLeft className="w-4 h-4" /> Geri
              </button>
            )}
            {/* Hide Next on step 2 when camera is active but no photo yet */}
            {!(step === 2 && !photoDataUrl && !camError) && (
              <button onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                {step === 5 ? 'Bağla' : step === 3 ? 'Göndər' : 'İrəli'}
                {step !== 5 && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN CitizenDashboard
═══════════════════════════════════════ */
export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(450);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [showReport, setShowReport] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleReportSubmit = (type) => {
    if (!type) return;
    setBalance(b => b + type.coins);
    setReports(prev => [{
      id: Date.now(), type: type.label, location: 'Bakı, Azərbaycan',
      status: 'Gözləyir', coins: type.coins, date: 'İndi',
    }, ...prev]);
    setShowReport(false);
    toast.success(`+${type.coins} Green Coin qazandınız! 🎉`);
  };

  const handleQRConfirm = (amount) => {
    setBalance(b => b - amount);
    toast.success(`${amount} GC ödənildi! SOCAR EV Şarj ✅`);
    setShowQR(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {showReport && <ReportModal onSubmit={handleReportSubmit} onClose={() => setShowReport(false)} />}
      {showQR     && <QRPaymentModal balance={balance} onConfirm={handleQRConfirm} onClose={() => setShowQR(false)} />}

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2.5 rounded-xl border border-green-500/30">
              <Leaf className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Vətəndaş Paneli</h1>
              <p className="text-slate-400 text-sm">Xoş gəlmisiniz, <span className="text-green-400 font-medium">{user?.name ?? 'Vətəndaş'}</span>!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center">
              <p className="text-slate-400 text-xs">Green Coin</p>
              <p className="text-green-400 font-extrabold text-2xl flex items-center gap-1 mt-0.5">
                <Leaf className="w-5 h-5" /> {balance}
              </p>
            </div>
            <button onClick={logout} title="Çıxış"
              className="bg-slate-800 border border-slate-700 hover:border-red-500/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all p-3 rounded-xl">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => setShowReport(true)}
            className="bg-gradient-to-br from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 transition-all p-6 rounded-2xl flex flex-col items-center justify-center gap-3 group shadow-lg shadow-green-900/30">
            <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-bold">Yeni Problem Bildir</span>
            <span className="text-green-100 text-sm">Kamerayla çək və +25 GC qazan</span>
          </button>

          <button onClick={() => setShowQR(true)}
            className="bg-gradient-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all p-6 rounded-2xl flex flex-col items-center justify-center gap-3 group shadow-lg shadow-blue-900/30">
            <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-bold">QR ilə Ödəniş Et</span>
            <span className="text-blue-100 text-sm">EV Şarj və Partnyor Mağazalarda</span>
          </button>
        </div>

        {/* Reports */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="text-slate-400">📋</span> Mənim Müraciətlərim
            <span className="ml-auto text-sm font-normal text-slate-400">{reports.length} müraciət</span>
          </h2>
          <div className="space-y-3">
            {reports.map(r => (
              <div key={r.id} className="bg-slate-900/60 p-4 rounded-xl flex items-center justify-between border border-slate-700/60 hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 ${r.status==='Təsdiqləndi'?'bg-green-500/20 text-green-400':r.status==='Rədd edildi'?'bg-red-500/20 text-red-400':'bg-yellow-500/20 text-yellow-400'}`}>
                    {r.status==='Təsdiqləndi'?<CheckCircle className="w-5 h-5"/>:r.status==='Rədd edildi'?<XCircle className="w-5 h-5"/>:<Clock className="w-5 h-5"/>}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{r.type}</h3>
                    <p className="text-slate-400 text-xs truncate">{r.location} · {r.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                  <StatusBadge status={r.status} />
                  {r.coins > 0 && <span className="text-green-400 font-bold text-sm flex items-center gap-0.5"><Leaf className="w-3 h-3"/>+{r.coins} GC</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> Liderlik Cədvəli
          </h2>
          <div className="space-y-2">
            {LEADERBOARD.map(p => (
              <div key={p.rank} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${p.isMe?'bg-green-500/10 border-green-500/30':'bg-slate-900/40 border-slate-700/60'}`}>
                <span className="text-xl w-8 text-center">{p.badge}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${p.isMe?'text-green-300':'text-white'}`}>
                    {p.name}
                    {p.isMe && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Siz</span>}
                  </p>
                </div>
                <p className="text-green-400 font-bold flex items-center gap-1 shrink-0">
                  <Leaf className="w-3.5 h-3.5" />{p.coins}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global CSS for scan animation */}
      <style>{`
        @keyframes scan {
          0%   { top: 10%; }
          50%  { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}
