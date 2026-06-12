import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const response = await API.post(endpoint, { email, password });
      
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#eaeaf9] p-4">
      
      {/* Brand Header */}
            {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-4">
        {/* The New Cyan Sparkle Icon (Slightly larger for the login screen) */}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md">
          <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
        </div>
        
        {/* The Updated Wordmark */}
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-800">
          Query<span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Genie</span>
        </h1>
        
        <p className="text-base font-medium text-slate-500">
          Natural Language to SQL Translator
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
        <h2 className="font-heading mb-6 text-center text-xl font-bold tracking-wide text-slate-800">
          {isRegistering ? 'Create your workspace' : 'Welcome back'}
        </h2>
        
        {error && (
          <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 p-3 text-center text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full rounded-xl bg-[#1B2A47] py-3.5 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-1.5 font-bold text-blue-600 transition-colors hover:text-blue-800"
            >
              {isRegistering ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}