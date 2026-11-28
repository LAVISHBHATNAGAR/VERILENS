import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Scan,
  Newspaper,
  Lock,
  Info,
  History,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function OpticalShieldMark() {
  return (
    <div className="w-8.5 h-8.5 rounded-lg bg-[#12141b] dark:bg-[#12141b] border border-[var(--border-hairline)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] flex items-center justify-center shrink-0 transition-colors group-hover:border-[#ff2e2e]/55">
      <svg
        viewBox="0 0 28 28"
        className="w-5 h-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 2.5L23.5 6.4V13.8C23.5 19.3 19.4 23.8 14 25.5C8.6 23.8 4.5 19.3 4.5 13.8V6.4L14 2.5Z"
          stroke="#fcfcfc"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle
          cx="14"
          cy="13.5"
          r="5"
          stroke="#ff5e78"
          strokeWidth="1.1"
          strokeDasharray="2.5 1.8"
        />
        <circle cx="14" cy="13.5" r="2.2" fill="#ff2e2e" />
        <path d="M14 6.5V8.3M14 18.7V20.5M7 13.5H8.8M19.2 13.5H21" stroke="#a1a1aa" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function Navbar({
  activeTab,
  setActiveTab,
  historyCount = 0,
  onOpenHistory,
  onOpenApiConfig,
  isDemoMode = true,
  theme = 'dark',
  onToggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'checker', label: 'AI Image Checker', icon: Scan },
    { id: 'fakenews', label: 'Fake News Checker', icon: Newspaper },
    { id: 'privacy', label: 'Privacy Guide', icon: Lock },
    { id: 'about', label: 'About', icon: Info }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border-hairline)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),var(--shadow-sm)] transition-colors duration-300"
      style={{
        background: 'var(--bg-header)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div className="verilens-container flex items-center justify-between h-[64px]">
        {/* Brand Identity Lockup */}
        <button
          type="button"
          onClick={() => handleTabClick('checker')}
          className="flex items-center gap-2.5 text-left group focus:outline-none rounded-lg"
        >
          <OpticalShieldMark />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-[1.12rem] tracking-[-0.02em] text-[var(--text-primary)]">
                VERILENS
              </span>
              <span className="font-mono text-[9.5px] font-medium tracking-[0.09em] px-1.5 py-[1px] rounded-[4px] bg-[var(--bg-main)]/85 text-[var(--text-muted)] border border-[var(--border-hairline)]">
                v2.0.0
              </span>
            </div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Optical Forensics &amp; Truth Lab
            </div>
          </div>
        </button>

        {/* Center Machined Navigation Tabs (Hairline Sliding Bevel — No Nested Pill Capsules) */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-1 h-full"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`relative h-full inline-flex items-center gap-1.5 px-3.5 text-[0.83rem] transition-colors ${
                  isActive
                    ? 'text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium'
                }`}
              >
                {isActive && (
                  <>
                    <motion.span
                      layoutId="navbar-active-surface"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-x-1 inset-y-2.5 rounded-md bg-[var(--text-primary)]/[0.045] border border-[var(--border-hairline)]"
                    />
                    <motion.span
                      layoutId="navbar-active-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute left-3 right-3 bottom-0 h-[2px] rounded-t-full bg-gradient-to-r from-[#ff2e2e] to-[#ff5e78] shadow-[0_0_10px_rgba(255,46,46,0.7)]"
                    />
                  </>
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-[#ff5e78]' : ''}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility Telemetry Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center rounded-lg border border-[var(--border-hairline)] bg-[var(--sub-block-bg)]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] divide-x divide-[var(--border-hairline)] overflow-hidden">
            {/* Engine Status Trigger */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onOpenApiConfig}
                  className="inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)]/45 transition-colors"
                >
                  {isDemoMode ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />
                  ) : (
                    <span className="inline-flex items-end gap-[2px] h-3 shrink-0" aria-hidden="true">
                      <span className="w-[2px] h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="w-[2px] h-3 rounded-full bg-emerald-400" />
                      <span className="w-[2px] h-2 rounded-full bg-emerald-400/80 animate-pulse" />
                    </span>
                  )}
                  <span className={isDemoMode ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}>
                    {isDemoMode ? 'Local Mode' : 'Engine Online'}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Configure backend endpoint &amp; vision API keys</TooltipContent>
            </Tooltip>

            {/* Session History Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenHistory}
              aria-label="Open analysis history"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]/45 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-[#ff5e78]" />
              <span className="hidden md:inline">History</span>
              {historyCount > 0 && (
                <span className="font-mono text-[10px] font-semibold px-1.5 py-[1px] rounded-[4px] bg-[#ff2e2e]/18 text-[#ff5e78] border border-[#ff2e2e]/35 min-w-[18px] text-center tabular-nums">
                  {historyCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile History Button (only below sm breakpoint) */}
          <button
            type="button"
            onClick={onOpenHistory}
            aria-label="Open analysis history"
            className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--sub-block-bg)] text-xs text-[var(--text-primary)]"
          >
            <History className="w-3.5 h-3.5 text-[#ff5e78]" />
            {historyCount > 0 && (
              <span className="font-mono text-[10px] font-semibold px-1 rounded bg-[#ff2e2e]/20 text-[#ff5e78] tabular-nums">
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border-hairline)] bg-[var(--sub-block-bg)]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#ff5e78]/50 transition-all active:scale-95"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#ff8597]" />
                ) : (
                  <Moon className="w-4 h-4 text-[var(--primary)]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === 'dark' ? 'Switch to Precision Daylight' : 'Switch to Crimson Lab'}
            </TooltipContent>
          </Tooltip>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-1.5 rounded-lg bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5 text-[#ff5e78]" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-[var(--border-hairline)] px-5 py-3.5 space-y-1 shadow-[var(--shadow-lg)]"
          style={{
            background: 'var(--bg-header)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#ff2e2e]/12 text-[#ff5e78] border border-[#ff2e2e]/30 font-semibold'
                    : 'text-[var(--nav-text)] hover:text-[var(--text-primary)] font-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenApiConfig?.();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-mono bg-[var(--sub-block-bg)] border border-[var(--border-hairline)] text-[var(--text-secondary)] mt-2"
          >
            <span>Backend Status</span>
            <span>{isDemoMode ? 'Local Mode' : 'Engine Online'}</span>
          </button>
        </div>
      )}
    </header>
  );
}
