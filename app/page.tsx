'use client';
import { useState } from 'react';

export default function Home() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    if (!key.trim()) {
      setStatus('Please enter your key!');
      setError(true);
      return;
    }

    setLoading(true);
    setStatus('Checking key...');
    setError(false);

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim() })
      });

      const data = await res.json();

      if (data.valid) {
        setStatus('✓ Key valid! Downloading...');
        setError(false);
        const a = document.createElement('a');

        a.href = data.downloadUrl;
        a.download = 'etha.executor.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

      } else {
        setStatus(data.message);
        setError(true);
      }
    } catch {
      setStatus('Server error! Please try again.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
      <div className="bg-[#0c1828] border border-[#0ea5e9] rounded-2xl p-8 w-full max-w-md shadow-lg shadow-[#0ea5e9]/20">
        

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#0ea5e9] rounded-xl flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">ETHA </h1>
            <p className="text-[#38bdf8] text-sm">Enter your key to download</p>
          </div>
        </div>


        <div className="w-full h-px bg-[#0ea5e9] mb-6" />


        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
          placeholder="Your key..."
          className="w-full bg-[#0c1c34] border border-[#0ea5e9] rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-[#38bdf8]/50 focus:outline-none focus:border-[#38bdf8] mb-4"
        />


        {status && (
          <p className={`text-sm mb-4 ${error ? 'text-red-400' : 'text-[#38bdf8]'}`}>
            {status}
          </p>
        )}


        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-[#0ea5e9] hover:bg-[#38bdf8] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors duration-200"
        >
          {loading ? '⏳ Checking...' : '⬇ download'}
        </button>


        <p className="text-[#38bdf8]/50 text-xs text-center mt-4">
          Etha Softworks LLC © 2026
        </p>
      </div>
    </main>
  );
}