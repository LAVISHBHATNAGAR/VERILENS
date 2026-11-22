import React, { useState } from 'react';
import { ShieldCheck, Scan, Newspaper, Lock, Info, History, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  historyCount = 0,
  onOpenHistory,
  isDemoMode = true,
  theme = 'light',
  onToggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'checker', label: 'AI Image Checker', icon: Scan },
    { id: 'fakenews', label: 'Fake News Checker', icon: Newspaper },
    { id: 'privacy', label: 'Privacy Guide', icon: Lock },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="verilens-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-header)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: 'var(--glass-border)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.35s ease'
    }}>
      <div className="verilens-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo (Plus Jakarta Sans, 800) */}
        <div
          onClick={() => handleTabClick('checker')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.32)',
            flexShrink: 0
          }}>
            <ShieldCheck size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '800',
                fontSize: '1.35rem',
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)'
              }}>
                VERILENS
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'var(--badge-blue-bg)',
                color: 'var(--badge-blue-text)',
                fontWeight: '600',
                boxShadow: '0 1px 4px rgba(37, 99, 235, 0.08)'
              }}>
                v2.4
              </span>
            </div>
            <div style={{
              fontSize: '0.68rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: '500'
            }}>
              Digital Truth &amp; Safety Assistant
            </div>
          </div>
        </div>

        {/* Desktop Navigation (Pill shapes, borderless) */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-nav-track)',
          padding: '4px',
          borderRadius: '9999px'
        }} className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? 'var(--bg-nav-active)' : 'transparent',
                  border: 'none',
                  color: isActive ? 'var(--nav-text-active)' : 'var(--nav-text)',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-body)',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--nav-text-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--nav-text)';
                  }
                }}
              >
                <Icon size={15} color={isActive ? 'var(--nav-text-active)' : 'var(--nav-text)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* System status badge (pill rounded, borderless) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '9999px',
            background: isDemoMode ? 'var(--sub-block-bg)' : 'var(--success-bg)',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '500',
            color: isDemoMode ? 'var(--text-muted)' : 'var(--success)',
            userSelect: 'none',
            boxShadow: isDemoMode ? 'none' : '0 2px 8px rgba(22, 163, 74, 0.12)'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isDemoMode ? '#94A3B8' : 'var(--success)',
              boxShadow: isDemoMode ? 'none' : '0 0 6px rgba(22,163,74,0.5)',
              flexShrink: 0
            }} />
            <span className="hide-on-mobile">
              {isDemoMode ? 'Local Mode' : 'System Active'}
            </span>
          </div>

          {/* History Button (Soft pill, borderless) */}
          <button
            onClick={onOpenHistory}
            title="View Analysis History"
            className="btn-secondary"
            style={{
              position: 'relative',
              padding: '8px 16px',
              fontSize: '0.84rem',
              gap: '6px',
              fontFamily: 'var(--font-body)',
              fontWeight: '500',
              borderRadius: '9999px',
              border: 'none',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <History size={16} color="var(--blue-light)" />
            <span className="hide-on-mobile">History</span>
            {historyCount > 0 && (
              <span style={{
                background: 'var(--blue)',
                color: '#FFFFFF',
                fontSize: '0.66rem',
                fontWeight: '600',
                padding: '1px 6px',
                borderRadius: '9999px',
                minWidth: '18px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)'
              }}>
                {historyCount}
              </span>
            )}
          </button>

          {/* DEDICATED THEME TOGGLE BUTTON (Requirement 6) */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="theme-toggle-btn"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'var(--glass-border)',
              background: theme === 'dark' ? 'rgba(15, 29, 57, 0.75)' : 'rgba(239, 246, 255, 0.95)',
              boxShadow: theme === 'dark' 
                ? '0 2px 10px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(96, 165, 250, 0.2)' 
                : '0 2px 10px rgba(37, 99, 235, 0.12)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              flexShrink: 0
            }}
          >
            {theme === 'dark' ? (
              <Sun size={18} color="#60A5FA" className="theme-toggle-icon" />
            ) : (
              <Moon size={18} color="#2563EB" className="theme-toggle-icon" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'var(--btn-sec-bg)',
              border: 'none',
              color: 'var(--text-primary)',
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '9999px',
              boxShadow: 'var(--shadow-sm)'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} color="var(--blue)" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Smooth rounded, borderless) */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-header)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          borderRadius: '0 0 20px 20px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '9999px',
                  background: isActive ? 'var(--bg-nav-active)' : 'transparent',
                  color: isActive ? 'var(--nav-text-active)' : 'var(--nav-text)',
                  border: 'none',
                  fontSize: '0.94rem',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 859px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
