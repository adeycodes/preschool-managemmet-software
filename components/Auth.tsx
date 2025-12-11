
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { LogIn, UserPlus, KeyRound, ArrowLeft, Cloud, User as UserIcon, School, Mail, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await authService.login(email, password);
        onLogin(user);
      } else if (mode === 'signup') {
        const user = await authService.signup(name, username, email, password);
        onLogin(user);
      } else if (mode === 'forgot') {
        await authService.resetPassword(email, password);
        setSuccessMsg('Password reset link sent to your email.');
        setTimeout(() => {
          setMode('login');
          setSuccessMsg('');
          setPassword('');
        }, 3000);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password. If you are new, please Create an Account.');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const user = await authService.loginAsGuest();
      onLogin(user);
    } catch (e) {
      setError('Could not start guest session.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setPassword('');
  };

  const renderHeader = () => {
    switch (mode) {
      case 'login':
        return { title: 'Teacher Login', icon: <LogIn size={20} /> };
      case 'signup':
        return { title: 'Create Account', icon: <UserPlus size={20} /> };
      case 'forgot':
        return { title: 'Reset Password', icon: <KeyRound size={20} /> };
    }
  };

  const header = renderHeader();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      
      {/* Main Auth Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-red-700 p-8 text-center relative">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-red-700 font-bold text-2xl">
            <School size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">KinderReport</h1>
          <p className="text-red-100">Preschool Management System</p>
          
          <div className="absolute top-4 right-4 text-red-900/40" title="Powered by Supabase">
             <Cloud size={24} />
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            {header.icon}
            {header.title}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
            )}
            
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white text-gray-900 pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="username"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-gray-900 pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="name@school.com"
                />
              </div>
            </div>
            
            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white text-gray-900 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white py-2 rounded-lg font-medium hover:bg-red-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-4">
               <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
               </div>
               <button
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full bg-gray-50 text-gray-700 border border-gray-200 py-2 rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm"
               >
                 <ShieldCheck size={16} />
                 Continue as Guest (Offline Mode)
               </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            {mode === 'forgot' ? (
              <button
                onClick={() => switchMode('login')}
                className="text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            ) : (
              <>
                <span className="text-gray-600">
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-red-700 font-medium hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Login'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
