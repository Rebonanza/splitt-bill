import { Moon, Sun, ScanLine, RefreshCw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { InstallAppButton } from '../InstallAppButton';

interface HeaderProps {
  onScanClick: () => void;
  onReset: () => void;
}

export function Header({ onScanClick, onReset }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: isDark
          ? 'rgba(15,15,19,0.85)'
          : 'rgba(250,250,248,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.webp"
            alt="SplitBill Logo"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
          >
            SplitBill
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <InstallAppButton />
          <button
            onClick={onReset}
            title="Reset bill"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
            }}
          >
            <RefreshCw size={15} />
          </button>


          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={onScanClick}
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-fg)',
            }}
          >
            <ScanLine size={16} />
            <span className="hidden sm:inline">Scan Struk</span>
          </button>
        </div>
      </div>
    </header>
  );
}
