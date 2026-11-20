import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scan, 
  Newspaper, 
  Lock, 
  Info, 
  History, 
  Sliders, 
  Menu, 
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  historyCount = 0, 
  onOpenHistory, 
  onOpenApiConfig,
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
      background: 'rgba(6, 9, 19, 0.82)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
      transition: 'all 0.3s ease'
    }}>
      <div className="verilens-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
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
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(168, 85, 247, 0.25) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.25)'
          }}>
            <ShieldCheck size={24} color="#00f0ff" />
            <div style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00f0ff',
              boxShadow: '0 0 8px #00f0ff'
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-main)', 
                fontWeight: '800', 
                fontSize: '1.35rem', 
                letterSpacing: '0.06em',
                background: 'linear-gradient(135deg, #ffffff 40%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                VERILENS
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontWeight: '600'
              }}>
                v2.4
              </span>
            </div>
            <div style={{ 
              fontSize: '0.68rem', 
              color: 'var(--text-muted)', 
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: '500'
            }}>
              Digital Truth &amp; Safety Assistant
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.55)',
          padding: '5px 8px',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.1)'
        }} className="desktop-nav">
          <button
            onClick={() => handleTabClick('checker')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'home' || activeTab === 'checker' ? '#ffffff' : '#94a3b8',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Home
          </button>
          
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
                  gap: '7px',
                  background: isActive ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(168, 85, 247, 0.2) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 240, 255, 0.35)' : '1px solid transparent',
                  color: isActive ? '#00f0ff' : '#94a3b8',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 0 15px rgba(0, 240, 255, 0.15)' : 'none'
                }}
              >
                <Icon size={15} color={isActive ? '#00f0ff' : '#94a3b8'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mode Pill / API Config button */}
          <button
            onClick={onOpenApiConfig}
            title="Configure Forensic Engine / API Mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isDemoMode ? 'rgba(168, 85, 247, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: isDemoMode ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
              color: isDemoMode ? '#c084fc' : '#34d399',
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isDemoMode ? '#c084fc' : '#34d399',
              boxShadow: isDemoMode ? '0 0 6px #c084fc' : '0 0 6px #34d399'
            }} />
            <span className="hide-on-mobile">{isDemoMode ? 'Demo Heuristics' : 'Live API Active'}</span>
            <Sliders size={13} />
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            title="View Analysis History"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(30, 41, 59, 0.65)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              color: '#f8fafc',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <History size={15} color="#38bdf8" />
            <span className="hide-on-mobile">History</span>
            {historyCount > 0 && (
              <span style={{
                background: '#00f0ff',
                color: '#060913',
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '1px 5px',
                borderRadius: '10px',
                minWidth: '16px',
                textAlign: 'center'
              }}>
                {historyCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              padding: '6px',
              cursor: 'pointer'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(11, 15, 25, 0.98)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={() => handleTabClick('checker')}
            style={{
              textAlign: 'left',
              padding: '12px',
              borderRadius: '8px',
              background: activeTab === 'checker' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
              color: activeTab === 'checker' ? '#00f0ff' : '#cbd5e1',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Home / AI Image Checker
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              style={{
                textAlign: 'left',
                padding: '12px',
                borderRadius: '8px',
                background: activeTab === item.id ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                color: activeTab === item.id ? '#00f0ff' : '#cbd5e1',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Responsive Inline CSS helper for mobile view */}
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
