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
  Sparkles
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
      background: 'rgba(9, 39, 66, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(248, 248, 255, 0.08)',
      boxShadow: '0 4px 20px rgba(5, 24, 41, 0.6)',
      transition: 'all 0.3s ease'
    }}>
      <div className="verilens-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
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
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0c3355 0%, #134673 100%)',
            border: '1px solid rgba(210, 245, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(210, 245, 0, 0.15)'
          }}>
            <ShieldCheck size={24} color="#D2F500" />
            <div style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#D2F500',
              boxShadow: '0 0 10px #D2F500'
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-main)', 
                fontWeight: '800', 
                fontSize: '1.4rem', 
                letterSpacing: '0.04em',
                color: 'var(--ghost-white)'
              }}>
                VERILENS
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 7px',
                borderRadius: '5px',
                background: 'rgba(210, 245, 0, 0.12)',
                color: '#D2F500',
                border: '1px solid rgba(210, 245, 0, 0.3)',
                fontWeight: '700'
              }}>
                v2.4
              </span>
            </div>
            <div style={{ 
              fontSize: '0.68rem', 
              color: 'var(--ghost-white-muted)', 
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: '600'
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
          background: 'rgba(5, 24, 41, 0.65)',
          padding: '5px 8px',
          borderRadius: '12px',
          border: '1px solid rgba(248, 248, 255, 0.08)'
        }} className="desktop-nav">
          <button
            onClick={() => handleTabClick('checker')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'checker' ? 'rgba(210, 245, 0, 0.12)' : 'transparent',
              border: activeTab === 'checker' ? '1px solid rgba(210, 245, 0, 0.4)' : '1px solid transparent',
              color: activeTab === 'checker' ? '#D2F500' : 'var(--ghost-white-subtle)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'checker' ? '700' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'checker' ? '0 0 16px rgba(210, 245, 0, 0.15)' : 'none'
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
                  background: isActive ? 'rgba(210, 245, 0, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(210, 245, 0, 0.4)' : '1px solid transparent',
                  color: isActive ? '#D2F500' : 'var(--ghost-white-subtle)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 0 16px rgba(210, 245, 0, 0.15)' : 'none'
                }}
              >
                <Icon size={15} color={isActive ? '#D2F500' : 'var(--ghost-white-muted)'} />
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
              background: 'rgba(12, 51, 85, 0.8)',
              border: isDemoMode ? '1px solid rgba(248, 248, 255, 0.14)' : '1px solid rgba(210, 245, 0, 0.4)',
              color: isDemoMode ? 'var(--ghost-white-subtle)' : '#D2F500',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isDemoMode ? 'var(--ghost-white-muted)' : '#D2F500',
              boxShadow: isDemoMode ? 'none' : '0 0 8px #D2F500'
            }} />
            <span className="hide-on-mobile">{isDemoMode ? 'Demo Engine' : 'Live Engine Active'}</span>
            <Sliders size={13} color={isDemoMode ? 'var(--ghost-white-muted)' : '#D2F500'} />
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
              background: 'rgba(12, 51, 85, 0.8)',
              border: '1px solid rgba(248, 248, 255, 0.14)',
              color: 'var(--ghost-white)',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <History size={15} color="#D2F500" />
            <span className="hide-on-mobile">History</span>
            {historyCount > 0 && (
              <span style={{
                background: '#D2F500',
                color: '#092742',
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '1px 6px',
                borderRadius: '10px',
                minWidth: '18px',
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
              color: 'var(--ghost-white)',
              padding: '6px',
              cursor: 'pointer'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} color="#D2F500" /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(5, 24, 41, 0.98)',
          borderBottom: '1px solid rgba(248, 248, 255, 0.12)',
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
              background: activeTab === 'checker' ? 'rgba(210, 245, 0, 0.12)' : 'transparent',
              color: activeTab === 'checker' ? '#D2F500' : 'var(--ghost-white)',
              border: activeTab === 'checker' ? '1px solid rgba(210, 245, 0, 0.35)' : 'none',
              fontSize: '0.95rem',
              fontWeight: '600',
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
                background: activeTab === item.id ? 'rgba(210, 245, 0, 0.12)' : 'transparent',
                color: activeTab === item.id ? '#D2F500' : 'var(--ghost-white)',
                border: activeTab === item.id ? '1px solid rgba(210, 245, 0, 0.35)' : 'none',
                fontSize: '0.95rem',
                fontWeight: '600',
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
