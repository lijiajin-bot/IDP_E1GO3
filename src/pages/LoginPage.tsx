import { useState } from 'react';
import { LogIn, ShieldAlert } from 'lucide-react';
import { verifyCredentials, type AllowedUser } from '../auth';

interface LoginPageProps {
  onLogin: (user: AllowedUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matchedUser = verifyCredentials(email, password);

    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      setError('Invalid UTM email identifier or wrong password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-utm-maroon/10 mb-2">
            <LogIn className="w-6 h-6 text-utm-maroon" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">UTM FKE Lab Inventory</h2>
          <p className="text-xs text-gray-500">Sign in using your institutional registry credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@graduate.utm.my or staff@utm.my"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-utm-maroon/30 focus:border-utm-maroon"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter laboratory passcode..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-utm-maroon/30 focus:border-utm-maroon"
            />
            <p className="text-[10px] text-gray-400 mt-1">Development testing key: <code className="font-mono bg-gray-100 px-1 rounded text-gray-600">fkelab2026</code></p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-center gap-2 text-red-700 text-[11px] font-medium animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-utm-maroon hover:bg-utm-maroon-dark text-white font-bold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            Authenticate Credentials
          </button>
        </form>
      </div>
    </div>
  );
}