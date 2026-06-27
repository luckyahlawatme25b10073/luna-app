'use client';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-100 bg-white/60 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl filter drop-shadow-sm animate-float" style={{ animationDuration: '4s' }}>🌙</span>
        <span className="font-extrabold text-xl tracking-widest bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent font-headings">
          LUNA
        </span>
      </div>
      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" title="System Status: Connected" />
    </header>
  );
}