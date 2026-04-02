'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number}[]>([]);

  useEffect(() => {
    const p = Array.from({length: 30}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 10
    }));
    setParticles(p);
  }, []);

  const handleDownload = async () => {
    if (!key.trim()) {
      setStatus('Kérlek adj meg egy kulcsot!');
      setError(true);
      return;
    }

    setLoading(true);
    setStatus('Ellenőrzés...');
    setError(false);

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim(), hwid: 'WEB' })
      });

      const data = await res.json();

      if (data.valid || data.message === 'This key is activated on another machine!') {
        // Ha valid VAGY már aktiválva van másik gépen - letöltés engedélyezve
        const dlRes = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: key.trim() })
        });
        const dlData = await dlRes.json();

        if (dlData.valid) {
          setStatus('✓ Kulcs elfogadva! Letöltés indul...');
          setError(false);
          const a = document.createElement('a');
          a.href = dlData.downloadUrl;
          a.download = 'etha.executor.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        setStatus(data.message);
        setError(true);
      }
    } catch {
      setStatus('Szerver hiba! Próbáld újra.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1a] overflow-hidden relative">
      
      {/* Animált háttér particlek */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#0ea5e9] opacity-20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Gradient glow háttér */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0ea5e9]/10 via-transparent to-transparent" />

      {/* Navbar */}
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-8 py-4 border-b border-[#0ea5e9]/20"
    >
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-[#0ea5e9] rounded-lg flex items-center justify-center text-white font-bold">
      E
    </div>
    <span className="text-white font-bold text-lg">ETHA EXECUTOR</span>
  </div>

  <a
    href="https://discord.gg/DISCORD_LINK"
    target="_blank"
    className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-xl transition-colors duration-200 text-sm font-bold"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
    Discord
    </a>
    </motion.nav>

      {/* Hero section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl font-bold text-white mb-4"
            animate={{ 
              textShadow: ['0 0 20px #0ea5e9', '0 0 40px #0ea5e9', '0 0 20px #0ea5e9']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ETHA <span className="text-[#0ea5e9]">EXECUTOR</span>
          </motion.h1>
          <p className="text-[#38bdf8] text-lg">
            A legjobb Roblox executor
          </p>
        </motion.div>

        {/* Download kártya */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#0c1828] border border-[#0ea5e9]/50 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-[#0ea5e9]/20 relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] rounded-2xl opacity-10 blur" />
          
          <div className="relative">
            <h2 className="text-white font-bold text-xl mb-1">Letöltés</h2>
            <p className="text-[#38bdf8] text-sm mb-6">Add meg a kulcsodat a letöltéshez</p>

            <div className="w-full h-px bg-[#0ea5e9]/30 mb-6" />

            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
              placeholder="Írd be a kulcsod..."
              className="w-full bg-[#0a1520] border border-[#0ea5e9]/50 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-[#38bdf8]/30 focus:outline-none focus:border-[#0ea5e9] mb-4 transition-colors"
            />

            {status && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-sm mb-4 ${error ? 'text-red-400' : 'text-[#38bdf8]'}`}
              >
                {status}
              </motion.p>
            )}

            <motion.button
              onClick={handleDownload}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#0ea5e9] hover:bg-[#38bdf8] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors duration-200"
            >
              {loading ? '⏳ Ellenőrzés...' : '⬇ Letöltés'}
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[#38bdf8]/30 text-xs mt-6"
        >
          Etha Executor © 2026
        </motion.p>
      </div>
    </main>
  );
}