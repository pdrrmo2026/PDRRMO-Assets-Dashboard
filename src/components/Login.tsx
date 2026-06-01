import { useState } from 'react';
import { LGUCode } from '../types';

interface LoginProps {
  onLogin: (username: string, isAdmin: boolean, lguCode: LGUCode) => void;
}

const USERS: { username: string; password: string; lgu: string; isAdmin: boolean; lguCode: LGUCode }[] = [
  { username: 'rizalpdrrmo', password: 'rizal0926', lgu: 'PDRRMO Admin', isAdmin: true, lguCode: 'PDRRMO' },
  { username: 'PDRRMO Admin', password: 'pdrrmo0926', lgu: 'PDRRMO Admin', isAdmin: true, lguCode: 'PDRRMO' },
  { username: 'antipolo', password: 'antipolo1870', lgu: 'City of Antipolo', isAdmin: false, lguCode: 'ANTIPOLO' },
  { username: 'angono', password: 'angono1930', lgu: 'Municipality of Angono', isAdmin: false, lguCode: 'ANGONO' },
  { username: 'baras', password: 'baras1970', lgu: 'Municipality of Baras', isAdmin: false, lguCode: 'BARAS' },
  { username: 'binangonan', password: 'binangonan1940', lgu: 'Municipality of Binangonan', isAdmin: false, lguCode: 'BINANGONAN' },
  { username: 'cainta', password: 'cainta1900', lgu: 'Municipality of Cainta', isAdmin: false, lguCode: 'CAINTA' },
  { username: 'cardona', password: 'cardona1950', lgu: 'Municipality of Cardona', isAdmin: false, lguCode: 'CARDONA' },
  { username: 'jalajala', password: 'jalajala1980', lgu: 'Municipality of Jalajala', isAdmin: false, lguCode: 'JALAJALA' },
  { username: 'morong', password: 'morong1960', lgu: 'Municipality of Morong', isAdmin: false, lguCode: 'MORONG' },
  { username: 'montalban', password: 'montalban1960', lgu: 'Municipality of Rodriguez', isAdmin: false, lguCode: 'RODRIGUEZ' },
  { username: 'pililla', password: 'pililla1910', lgu: 'Municipality of Pililla', isAdmin: false, lguCode: 'PILILLA' },
  { username: 'sanmateo', password: 'sanmateo1850', lgu: 'Municipality of San Mateo', isAdmin: false, lguCode: 'SAN_MATEO' },
  { username: 'tanay', password: 'tanay1980', lgu: 'Municipality of Tanay', isAdmin: false, lguCode: 'TANAY' },
  { username: 'taytay', password: 'taytay1920', lgu: 'Municipality of Taytay', isAdmin: false, lguCode: 'TAYTAY' },
  { username: 'teresa', password: 'teresa1880', lgu: 'Municipality of Teresa', isAdmin: false, lguCode: 'TERESA' },
];

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      onLogin(user.username, user.isAdmin, user.lguCode);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="text-2xl font-bold">DRRM Resource Management</h1>
          <p className="text-blue-200 mt-1">Province of Rizal</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">LGUs Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your LGU username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Login
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Available LGU Accounts:</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              {USERS.map((user) => (
                <div key={user.username} className="text-center py-1 px-2 bg-gray-100 rounded">
                  {user.lgu.replace('Municipality of ', '').replace('City of ', '')}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500">
          <p>© 2024 Province of Rizal - PDRRMO</p>
          <p className="mt-1">All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}
