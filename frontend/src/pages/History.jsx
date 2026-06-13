import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get('/query/history');
        setHistory(res.data.history);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        } else {
          setError("Failed to load history.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">Query History</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Review your past interactions with the Genie.</p>
        </div>
        <Link 
          to="/dashboard" 
          className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-300"
        >
          &larr; Back to Workspace
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      {/* History Feed */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loading your past queries...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-20 text-center">
          <svg className="mb-4 h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="font-heading text-lg font-bold text-slate-700">No history yet</h3>
          <p className="mt-1 text-sm text-slate-500">Your generated SQL queries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {history.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              
              {/* Question Section */}
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-500">You asked</p>
                <p className="font-heading text-base font-semibold text-slate-800">{item.user_text}</p>
              </div>
              
              {/* Answer Section (Mini Code Editor) */}
              <div className="bg-[#1e293b] px-6 py-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                  <span className="ml-2 font-heading text-xs font-medium text-slate-400">Generated SQL</span>
                </div>
                <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-emerald-400">
                  <code>{item.generated_sql}</code>
                </pre>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}