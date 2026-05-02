import { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface ExtendedNavigator extends Navigator {
  standalone?: boolean;
}

export const InstallAppButton = ({ className }: { className?: string }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as ExtendedNavigator).standalone;

      setIsStandalone(!!isStandaloneMode);

      if (isStandaloneMode) return;

      const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
      setIsIos(isIosDevice);

      if (isIosDevice) {
        setIsVisible(true);
      }
    };

    checkStatus();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIos) {
      setShowIosTip(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (isStandalone || !isVisible) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg px-3 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95',
          'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20',
          className
        )}
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        <Download size={14} />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* iOS Installation Tip */}
      {showIosTip && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 sm:items-center animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-slide-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Smartphone size={20} />
                </div>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
                  Install SplitBill
                </h3>
              </div>
              <button
                onClick={() => setShowIosTip(false)}
                className="rounded-lg p-2 text-muted hover:bg-surface-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-muted">
              Install aplikasi ini di iPhone kamu untuk akses lebih cepat:
            </p>

            <ol className="space-y-4 text-sm">
              <li className="flex items-start gap-4">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  1
                </span>
                <span style={{ color: 'var(--text)' }}>
                  Tap tombol <strong className="text-accent">Share</strong> di browser (ikon kotak dengan panah)
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  2
                </span>
                <span style={{ color: 'var(--text)' }}>
                  Scroll ke bawah dan pilih <strong className="text-accent">Add to Home Screen</strong>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  3
                </span>
                <span style={{ color: 'var(--text)' }}>
                  Tap <strong className="text-accent">Add</strong> di pojok kanan atas
                </span>
              </li>
            </ol>

            <button
              className="mt-8 w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-widest transition-all hover:brightness-110 active:scale-95"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontFamily: 'Syne, sans-serif' }}
              onClick={() => setShowIosTip(false)}
            >
              OKE, SAYA MENGERTI
            </button>
          </div>
        </div>
      )}
    </>
  );
};
