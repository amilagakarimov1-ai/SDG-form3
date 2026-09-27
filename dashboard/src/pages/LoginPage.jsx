import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogIn, User, Building, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('municipality'); // 'citizen' or 'municipality'
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email və şifrəni daxil edin');
      return;
    }
    setLoading(true);
    try {
      await login(email, password, role);
      toast.success('Giriş uğurludur!');
      if (role === 'citizen') {
        navigate('/citizen', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Giriş xətası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-green-900/20 blur-3xl" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-3xl" />
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-teal-900/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-8 relative z-10">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-green-500/20 rounded-xl mb-4 ring-1 ring-green-500/30">
            <Leaf className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">FixiFy</h1>
          <p className="text-slate-400 text-sm">Təmiz şəhər, yaşıl gələcək</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-slate-900/70 rounded-xl p-1 mb-7 border border-slate-700">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === 'citizen'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Vətəndaş
          </button>
          <button
            type="button"
            onClick={() => setRole('municipality')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === 'municipality'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" /> Bələdiyyə
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-colors"
              placeholder={role === 'citizen' ? 'vetendas@mail.com' : 'admin@baku.gov.az'}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Şifrə</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-slate-600 bg-slate-700 text-green-500 focus:ring-green-500"
              />
              Məni xatırla
            </label>
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
              Şifrəni unutdun?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg ${
              role === 'citizen'
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-green-900/40'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/40'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Giriş edilir...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Daxil Ol
              </>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <p className="mt-5 text-center text-xs text-slate-500">
          Demo: hər hansı email / şifrə yazın
        </p>

        <div className="mt-4 text-center text-sm text-slate-400 border-t border-slate-700 pt-4">
          Hesabınız yoxdur?{' '}
          <a href="#" className="text-green-400 hover:text-green-300 font-bold transition-colors">
            Qeydiyyatdan keçin
          </a>
        </div>
      </div>
    </div>
  );
}
