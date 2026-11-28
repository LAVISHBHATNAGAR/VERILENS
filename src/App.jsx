import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import KineticGrid from '@/components/ui/kinetic-grid';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Hero from './components/Hero';
import DigicamScrollShowcase from './components/DigicamScrollShowcase';
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
  const [activeTab, setActiveTab] = useState('checker');
  const [currentImage, setCurrentImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Dark-first theme with full Light parity
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('verilens_theme');
      return saved || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('verilens_theme', nextTheme);
      } catch {
        // Storage disabled
      }
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Ephemeral session history
  const [history, setHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [historyOpen, setHistoryOpen] = useState(false);

  // API & engine config
  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState({
    mode: DETECTION_MODES.REAL_ENGINE,
    apiEndpoint: '',
    apiKey: ''
  });

  const applyHealthResult = useCallback((health) => {
    setIsBackendOnline(health.online);
    setApiConfig((prev) => ({
      ...prev,
      mode: health.online ? DETECTION_MODES.REAL_ENGINE : DETECTION_MODES.DEMO,
      apiEndpoint: health.online ? health.apiEndpoint : prev.apiEndpoint
    }));
  }, []);

  const probeBackend = useCallback(
    async (customUrl = '') => {
      const health = await checkBackendHealth(customUrl);
      applyHealthResult(health);
      return health;
    },
    [applyHealthResult]
  );

  // Initial & periodic backend health probe (async update avoids synchronous effect cascade)
  useEffect(() => {
    let isMounted = true;

    const runProbe = async () => {
      try {
        const health = await checkBackendHealth();
        if (isMounted) applyHealthResult(health);
      } catch {
        // Ignore transient probe failures
      }
    };

    runProbe();
    const interval = setInterval(runProbe, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [applyHealthResult]);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn('SessionStorage quota or privacy notice:', err);
    }
  }, [history]);

  const handleImageSelected = (imageItem) => {
    setCurrentImage(imageItem);
    setAnalysisResult(null);
    setAnalysisError('');
  };

  const handleRemoveImage = () => {
    setCurrentImage(null);
    setAnalysisResult(null);
    setAnalysisError('');
    setIsAnalyzing(false);
  };

  const executeAnalysis = async (targetImg) => {
    const target = targetImg || currentImage;
    if (!target || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisError('');
    setScanProgress(5);
    setScanStep('Initializing forensic sandbox...');

    try {
      const result = await analyzeImage(target.file || target, target.element, {
        mode: apiConfig.mode,
        apiEndpoint: apiConfig.apiEndpoint || '/api/detect',
        apiKey: apiConfig.apiKey,
        onProgress: (pct, msg) => {
          setScanProgress(pct);
          setScanStep(msg);
        }
      });

      setAnalysisResult(result);

      if (result.isRealEngine) {
        setIsBackendOnline(true);
      }

      const historyItem = {
        id: result.id,
        timestamp: result.timestamp,
        previewUrl: target.dataUrl,
        result,
        imageData: {
          name: target.name,
          size: target.size,
          dimensions: target.dimensions
        }
      };

      setHistory((prev) => {
        const filtered = prev.filter(
          (p) => (p.imageData?.name || p.result.metadata?.fileName) !== target.name
        );
        return [historyItem, ...filtered.slice(0, 19)];
      });
    } catch (err) {
      setAnalysisError(`Analysis notice: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
      setScanProgress(0);
    }
  };

  const handleAnalyze = () => executeAnalysis(currentImage);

  const handleReanalyzeItem = (item) => {
    const img = new Image();
    img.onload = () => {
      const imgObj = {
        name: item.result.metadata?.fileName || item.imageData?.name || 'reanalyzed_image.png',
        size: item.imageData?.size || 1000000,
        type: item.result.metadata?.mimeType || 'image/png',
        dataUrl: item.previewUrl,
        element: img,
        dimensions: item.imageData?.dimensions || { width: 1024, height: 1024 }
      };
      setCurrentImage(imgObj);
      setAnalysisResult(null);
      setActiveTab('checker');
      setHistoryOpen(false);
      executeAnalysis(imgObj);
    };
    img.src = item.previewUrl;
  };

  const handleSelectHistoryItem = (item) => {
    setAnalysisResult(item.result);
    const img = new Image();
    img.onload = () => {
      setCurrentImage({
        name: item.result.metadata?.fileName || item.imageData?.name || 'image.png',
        size: item.imageData?.size || 1000000,
        type: item.result.metadata?.mimeType || 'image/png',
        dataUrl: item.previewUrl,
        element: img,
        dimensions: item.imageData?.dimensions || { width: 1024, height: 1024 }
      });
    };
    img.src = item.previewUrl;
    setActiveTab('checker');
  };

  const handleClearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem(SESSION_HISTORY_KEY);
  };

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <KineticGrid
            globalColor={theme === 'dark' ? 'crimson-dark' : 'crimson-light'}
            contentClassName="min-h-screen flex flex-col"
          >
            {/* Top Navigation */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            historyCount={history.length}
            onOpenHistory={() => setHistoryOpen(true)}
            onOpenApiConfig={() => setApiConfigOpen(true)}
            isDemoMode={!isBackendOnline}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          {/* Main Workspace */}
          <main className="flex-1 py-8 sm:py-12">
            <div className="verilens-container">
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'checker' && (
                  <motion.div
                    key="tab-checker"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-24 lg:space-y-32"
                  >
                    <Hero
                      theme={theme}
                      isBackendOnline={isBackendOnline}
                      onOpenApiConfig={() => setApiConfigOpen(true)}
                      onLearnMore={() => {
                        setActiveTab('about');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />

                    <DigicamScrollShowcase onInspectDigicamPhoto={handleImageSelected} />

                    {analysisError && (
                      <div
                        role="alert"
                        className="max-w-5xl mx-auto mb-5 rounded-2xl bg-[var(--error-bg)] border border-red-500/30 px-4 py-3 flex items-center gap-2.5 text-sm text-[var(--error)]"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{analysisError}</span>
                      </div>
                    )}

                    {!currentImage && !analysisResult && (
                      <ImageUploader onImageSelected={handleImageSelected} />
                    )}

                    {currentImage && !analysisResult && (
                      <div>
                        <ImagePreview
                          imageItem={currentImage}
                          onRemove={handleRemoveImage}
                          onAnalyze={handleAnalyze}
                          isAnalyzing={isAnalyzing}
                        />

                        {isAnalyzing && (
                          <ScanningAnimation
                            progress={scanProgress}
                            currentStep={scanStep}
                          />
                        )}
                      </div>
                    )}

                    {analysisResult && (
                      <AnalysisResult
                        result={analysisResult}
                        imageItem={currentImage}
                        onReset={handleRemoveImage}
                        onOpenApiConfig={() => setApiConfigOpen(true)}
                      />
                    )}
                  </motion.div>
                )}

                {activeTab === 'fakenews' && (
                  <motion.div
                    key="tab-fakenews"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="pt-4"
                  >
                    <FakeNewsChecker />
                  </motion.div>
                )}

                {activeTab === 'privacy' && (
                  <motion.div
                    key="tab-privacy"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="pt-4"
                  >
                    <PrivacyGuide />
                  </motion.div>
                )}

                {activeTab === 'about' && (
                  <motion.div
                    key="tab-about"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="pt-4"
                  >
                    <AboutSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Session History Slide-Over Drawer */}
          <AnalysisHistory
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            history={history}
            onSelectHistoryItem={handleSelectHistoryItem}
            onReanalyzeItem={handleReanalyzeItem}
            onClearHistory={handleClearHistory}
          />

          {/* API & Engine Configuration Dialog */}
          {apiConfigOpen && (
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
          )}

          {/* Footer */}
          <Footer
            isBackendOnline={isBackendOnline}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
          </KineticGrid>
        </TooltipProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
