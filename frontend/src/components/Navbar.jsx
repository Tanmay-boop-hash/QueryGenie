import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Helps us highlight the active page

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Don't show the navbar on the login page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

      return (
    // Changed bg to your custom hex and removed the bottom border since the dark color provides its own separation
    <nav className="sticky top-0 z-50 bg-[#1B2A47] px-6 py-4 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        
        {/* Left Side: Brand Wordmark */}
        <Link to="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                {/* Magic Sparkles / AI Icon */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
          </div>
          <span className="font-heading text-[30px] font-extrabold tracking-tight text-gray-200">
            Query<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Genie</span>
          </span>
        </Link>

        {/* Right Side: Links & Logout */}
        <div className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className={`text-base font-bold transition-colors ${
              location.pathname === '/dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Workspace
          </Link>
          
          <Link 
            to="/history" 
            className={`text-base font-bold transition-colors ${
              location.pathname === '/history' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            History
          </Link>
          
          <button
            onClick={handleLogout}
            className="ml-2 rounded-lg px-4 py-2 text-base font-bold text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}