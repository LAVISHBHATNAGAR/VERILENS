import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import ScanningAnimation from './components/ScanningAnimation';
import AnalysisResult from './components/AnalysisResult';
import AnalysisHistory from './components/AnalysisHistory';
import FakeNewsChecker from './components/FakeNewsChecker';
import PrivacyGuide from './components/PrivacyGuide';
import AboutSection from './components/AboutSection';
import ApiConfigModal from './components/ApiConfigModal';
import Footer from './components/Footer';
import { analyzeImage, checkBackendHealth, DETECTION_MODES } from './services/detectionService';

const SESSION_HISTORY_KEY = 'verilens_audit_history';

export default function App() {
  const [activeTab, setActiveTab] = useState('checker'); // 'checker' | 'fakenews' | 'privacy' | 'about'
  const [currentImage, setCurrentImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Session History State
  const [history, setHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [historyOpen, setHistoryOpen] = useState(false);

  // API Config State
  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    mode: DETECTION_MODES.REAL_ENGINE,
    apiEndpoint: '',
    apiKey: ''
  });

  // Verify backend connectivity
  const probeBackend = useCallback(async (customUrl = '') => {
    const health = await checkBackendHealth(customUrl || apiConfig.apiEndpoint);
    setIsBackendOnline(health.online);
    if (health.online) {
      setApiConfig((prev) => ({
        ...prev,
        mode: DETECTION_MODES.REAL_ENGINE,
        apiEndpoint: health.apiEndpoint
      }));
    } else {
      setApiConfig((prev) => ({
        ...prev,
        mode: DETECTION_MODES.DEMO
      }));
    }
    return health;
  }, [apiConfig.apiEndpoint]);

  // Initial and periodic backend health probe
  useEffect(() => {
    let isMounted = true;
    probeBackend();

    const interval = setInterval(() => {
      if (isMounted) probeBackend();
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [probeBackend]);

  // Sync history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn('SessionStorage quota or privacy notice:', err);
    }
  }, [history]);

  // Handle image selected from drop or sample
  const handleImageSelected = (imageItem) => {
    setCurrentImage(imageItem);
    setAnalysisResult(null);
  };

  // Remove current image
  const handleRemoveImage = () => {
    setCurrentImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  // Run forensic analysis
  const handleAnalyze = async () => {
    if (!currentImage || isAnalyzing) return;

    setIsAnalyzing(true);
    setScanProgress(5);
    setScanStep('Initializing forensic sandbox...');

    try {
      const result = await analyzeImage(
        currentImage.file || currentImage,
        currentImage.element,
        {
          mode: apiConfig.mode,
          apiEndpoint: apiConfig.apiEndpoint || '/api/detect',
          apiKey: apiConfig.apiKey,
          onProgress: (pct, msg) => {
            setScanProgress(pct);
            setScanStep(msg);
          }
        }
      );

      setAnalysisResult(result);

      // If result came from real backend, update status
      if (result.isRealEngine) {
        setIsBackendOnline(true);
      }

      // Save to session history (capped at 20 items)
      const historyItem = {
        id: result.id,
        timestamp: result.timestamp,
        previewUrl: currentImage.dataUrl,
        result,
        imageData: {
          name: currentImage.name,
          size: currentImage.size,
          dimensions: currentImage.dimensions
        }
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
    } catch (err) {
      alert(`Analysis notice: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
      setScanProgress(0);
    }
  };

  // Select item from history to review
  const handleSelectHistoryItem = (item) => {
    setAnalysisResult(item.result);
    const img = new Image();
    img.src = item.previewUrl;
    img.onload = () => {
      setCurrentImage({
        name: item.result.metadata.fileName,
        size: item.imageData?.size || 1000000,
        type: item.result.metadata.mimeType,
        dataUrl: item.previewUrl,
        element: img,
        dimensions: item.imageData?.dimensions || { width: 1024, height: 1024 }
      });
    };
    setActiveTab('checker');
  };

  // Clear session history
  const handleClearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem(SESSION_HISTORY_KEY);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background Cyber Grid */}
      <div className="cyber-grid-bg" />

      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenApiConfig={() => setApiConfigOpen(true)}
        isDemoMode={!isBackendOnline}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '16px 0 32px 0' }}>
        <div className="verilens-container">
          {/* TAB 1: AI IMAGE CHECKER (PRIMARY TOOL) */}
          {activeTab === 'checker' && (
            <div>
              {/* Hero Banner */}
              <Hero 
                onExploreSamples={() => {}} 
                onLearnMore={() => {
                  setActiveTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />

              {/* View 1: If no image uploaded yet, show large upload area */}
              {!currentImage && !analysisResult && (
                <ImageUploader onImageSelected={handleImageSelected} />
              )}

              {/* View 2: Image is uploaded, show image preview & controls */}
              {currentImage && !analysisResult && (
                <div>
                  <ImagePreview
                    imageItem={currentImage}
                    onRemove={handleRemoveImage}
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                  />

                  {/* Scanning Animation Progress overlay */}
                  {isAnalyzing && (
                    <ScanningAnimation 
                      progress={scanProgress} 
                      currentStep={scanStep} 
                    />
                  )}
                </div>
              )}

              {/* View 3: Analysis is completed, show full forensic report */}
              {analysisResult && (
                <div>
                  <AnalysisResult
                    result={analysisResult}
                    imageItem={currentImage}
                    onReset={handleRemoveImage}
                    onOpenApiConfig={() => setApiConfigOpen(true)}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAKE NEWS CHECKER */}
          {activeTab === 'fakenews' && (
            <div style={{ paddingTop: '24px' }}>
              <FakeNewsChecker />
            </div>
          )}

          {/* TAB 3: PRIVACY GUIDE */}
          {activeTab === 'privacy' && (
            <div style={{ paddingTop: '24px' }}>
              <PrivacyGuide />
            </div>
          )}

          {/* TAB 4: ABOUT */}
          {activeTab === 'about' && (
            <div style={{ paddingTop: '24px' }}>
              <AboutSection />
            </div>
          )}
        </div>
      </main>

      {/* History Slide-in Drawer */}
      <AnalysisHistory
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* API Configuration Modal */}
      <ApiConfigModal
        isOpen={apiConfigOpen}
        onClose={() => {
          setApiConfigOpen(false);
          probeBackend();
        }}
        config={apiConfig}
        onSaveConfig={(newConfig) => {
          setApiConfig(newConfig);
          probeBackend(newConfig.apiEndpoint);
        }}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
