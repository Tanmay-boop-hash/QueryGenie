import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Dashboard() {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState('');
  const [rawSchema, setRawSchema] = useState('');
  const [userText, setUserText] = useState('');
  const [generatedSql, setGeneratedSql] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // STATE FOR SAVING SCHEMAS
  const [newSchemaName, setNewSchemaName] = useState('');
  const [newSchemaText, setNewSchemaText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [isCopied, setIsCopied] = useState(false);
  
  const navigate = useNavigate();

  // 1. Fetch saved schemas on load
  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const res = await API.get('/schemas');
        setSchemas(res.data.schemas);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      }
    };
    fetchSchemas();
  }, [navigate]);

  // 2. Handle SQL generation based on user input
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setGeneratedSql('');
    setIsLoading(true);

    try {
      const payload = { user_text: userText };

      if (selectedSchemaId) {
        payload.schema_id = selectedSchemaId;
      } else if (rawSchema) {
        payload.schema_context = rawSchema;
      } else {
        setError("Please either select a saved schema or provide raw schema text.");
        setIsLoading(false);
        return;
      }

      const res = await API.post('/query', payload);
      setGeneratedSql(res.data.sql);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate SQL.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle saving new schemas to the database
  const handleSaveSchema = async (e) => {
    e.preventDefault();
    setSaveMessage('');
    setIsSaving(true);

    try {
      const res = await API.post('/schemas', {
        name: newSchemaName,
        schema_text: newSchemaText
      });
      
      // Add the new schema to the top of the dropdown list
      setSchemas([res.data.schema, ...schemas]);
      
      // Automatically select the newly saved schema
      setSelectedSchemaId(res.data.schema.id);
      
      // Clear the form fields
      setNewSchemaName('');
      setNewSchemaText('');
      setRawSchema('');
      
      setSaveMessage("Schema saved successfully!");
      setTimeout(() => setSaveMessage(''), 3000); // Hide message after 3 seconds
    } catch (err) {
      setSaveMessage(err.response?.data?.error || "Failed to save schema.");
    } finally {
      setIsSaving(false);
    }
  };

    // Copy to Clipboard 
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSql);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="mx-auto max-w-5xl p-6">

      {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-12">
        { /* LEFT COLUMN */ }
        <div className="flex flex-col gap-6 lg:col-span-5">
          
          {/* Main Query Form Card */}
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div>
              <label className=" font-heading mb-3 block text-base font-extrabold tracking-wide text-slate-800">
                1. Select or Paste Schema
              </label>
              
              {schemas.length > 0 ? (
                              <select 
                className="mb-4 w-full appearance-none cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-medium text-slate-700 shadow-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
                value={selectedSchemaId}
                onChange={(e) => {
                  setSelectedSchemaId(e.target.value);
                  setRawSchema(''); 
                }}
              >
                  <option value="">Choose a saved database</option>
                  {schemas.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              ) : (
                <p className="mb-4 text-sm text-slate-500">No saved schemas yet.</p>
              )}

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="mx-4 flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-300">or raw text</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <textarea
                className="mt-4 min-h-[100px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste temporary table structures here..."
                value={rawSchema}
                onChange={(e) => {
                  setRawSchema(e.target.value);
                  setSelectedSchemaId(''); 
                }}
              />
            </div>

            <div className="pt-2">
              <label className="font-heading mb-3 block text-base font-extrabold tracking-wide text-slate-800">
                2. What do you want to query?
              </label>
              <textarea
                className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder="e.g., Find all users who signed up in the last 30 days..."
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full rounded-xl bg-[#1B2A47] py-3.5 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isLoading ? 'Generating...' : 'Generate SQL'}
              </button>
            </div>
          </div>

          {/* Save Schema Form Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <h3 className="font-heading mb-4 text-sm font-bold tracking-wide text-slate-700">
              Save a New Schema
            </h3>
            <form onSubmit={handleSaveSchema} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Schema Name (e.g., E-Commerce DB)"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newSchemaName}
                onChange={(e) => setNewSchemaName(e.target.value)}
              />
              <textarea
                required
                rows="2"
                placeholder="Paste the table structures here..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newSchemaText}
                onChange={(e) => setNewSchemaText(e.target.value)}
              />
              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-900 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save to Database'}
              </button>
            </form>
            {saveMessage && (
              <p className={`mt-3 text-center text-sm font-medium ${saveMessage.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {saveMessage}
              </p>
            )}
          </div>
        </div>

    {/* RIGHT COLUMN: Output */}
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#1e293b] shadow-xl lg:col-span-7">
          
          {/* Editor Header / Title Bar */}
          <div className="flex items-center justify-between border-b border-slate-700/50 bg-[#0f172a] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span className="ml-3 text-xs font-medium tracking-wide text-slate-400">
                generated_query.sql
              </span>
            </div>
            
            {generatedSql && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
              >
                {isCopied ? (
                  <>
                    <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
        </div>

          {/* Editor Body */}
          <div className="flex-grow overflow-auto p-6">
            {generatedSql ? (
              <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-emerald-400">
                <code>{generatedSql}</code>
              </pre>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-500">
                <svg className="mb-4 h-12 w-12 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Your SQL output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}