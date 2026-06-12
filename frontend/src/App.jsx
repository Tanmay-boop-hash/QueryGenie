import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // <-- 1. Import it
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  return (
    <Router>
      {/* We change the background to a very soft SaaS-style gray */}
      <div className="min-h-screen bg-[#eaeaf9] text-gray-900 font-sans selection:bg-purple-200">
        
        <Navbar /> {/* <-- 2. Add it here */}

        {/* The main content area */}
        <main className="pt-8 pb-16">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;