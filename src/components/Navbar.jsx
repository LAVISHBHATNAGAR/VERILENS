import React, { useState } from 'react';
import { ShieldCheck, Scan, Newspaper, Lock, Info, History, Menu, X } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  historyCount = 0,
  onOpenHistory,
  isDemoMode = true
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
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'all 0.3s ease'
    }}>
      <div className="verilens-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
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
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)',
            flexShrink: 0
          }}>
            <ShieldCheck size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-main)',
                fontWeight: '800',
                fontSize: '1.3rem',
                letterSpacing: '0.03em',
                color: '#172B4D'
              }}>
                VERILENS
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid rgba(37,99,235,0.2)',
                fontWeight: '700'
              }}>
                v2.4
              </span>
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: '#64748B',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Digital Truth & Safety Assistant
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '4px'
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
                  background: isActive ? '#EFF6FF' : 'transparent',
                  border: isActive ? '1px solid rgba(37,99,235,0.2)' : '1px solid transparent',
                  color: isActive ? '#2563EB' : '#475569',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-main)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#172B4D';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* System status badge — read-only, not clickable by users */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: isDemoMode ? '#F1F5F9' : '#F0FDF4',
            border: `1px solid ${isDemoMode ? '#E2E8F0' : '#BBF7D0'}`,
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '600',
            color: isDemoMode ? '#64748B' : '#16A34A',
            userSelect: 'none'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isDemoMode ? '#94A3B8' : '#16A34A',
              boxShadow: isDemoMode ? 'none' : '0 0 6px rgba(22,163,74,0.5)',
              flexShrink: 0
            }} />
            <span className="hide-on-mobile">
              {isDemoMode ? 'Local Mode' : 'System Active'}
            </span>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            title="View Analysis History"
            className="btn-secondary"
            style={{
              position: 'relative',
              padding: '8px 14px',
              fontSize: '0.84rem',
              gap: '6px'
            }}
          >
            <History size={15} color="#2563EB" />
            <span className="hide-on-mobile">History</span>
            {historyCount > 0 && (
              <span style={{
                background: '#2563EB',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: '800',
                padding: '1px 6px',
                borderRadius: '10px',
                minWidth: '18px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)'
              }}>
                {historyCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#475569',
              padding: '6px',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} color="#172B4D" /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: isActive ? '#EFF6FF' : 'transparent',
                  color: isActive ? '#2563EB' : '#475569',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-main)'
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
