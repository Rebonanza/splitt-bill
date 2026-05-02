# 📋 PRD — SplitBill App
**Product Requirements Document**
Versi: 1.1.0 | Status: Draft | Diperbarui: Mei 2026

---

## 1. Overview

### 1.1 Deskripsi Produk
SplitBill adalah Progressive Web App (PWA) yang memudahkan pengguna membagi tagihan bersama secara adil dan transparan. Target pengguna adalah Gen Z yang sering makan/belanja bareng dan butuh cara cepat untuk hitung siapa bayar berapa, tanpa drama.

### 1.2 Masalah yang Diselesaikan
- Hitung-hitungan split bill manual itu ribet dan rawan salah
- Screenshot struk/nota dari ojol atau resto harus diinput manual satu-satu
- Tidak ada tools yang bisa langsung share hasil ke WhatsApp dengan format yang rapi
- Kebanyakan tools split bill kaku — tidak bisa custom biaya tambahan atau potongan

### 1.3 Solusi
Aplikasi web yang:
- Input pesanan per orang dengan nama item dan harga
- Support custom biaya tambahan dan potongan (delivery, admin, discount, dll)
- Scan struk atau screenshot → otomatis isi form via OCR + Gemini AI
- Output bisa di-share ke WhatsApp atau di-download sebagai gambar
- Tersedia offline sebagai PWA

---

## 2. Tech Stack & Keputusan Arsitektur

### 2.1 Prinsip Pemilihan Library
> **Pakai library hanya jika benar-benar dibutuhkan. Jangan over-engineer.**

Sebelum tambah dependency, tanya: *"Bisa diselesaikan dengan React built-in (useState, useReducer, useContext) atau custom hook biasa?"* Kalau bisa — tidak perlu library tambahan.

### 2.2 Core
| Layer | Teknologi | Alasan |
|---|---|---|
| Framework | React 19 + Vite 6 | Fast build, modern React |
| Language | TypeScript (strict mode) | Type safety, DX lebih baik |
| Styling | Tailwind CSS v4 | Utility-first, dark mode built-in |
| UI Components | shadcn/ui | Accessible, customizable, headless |
| PWA | vite-plugin-pwa + Workbox | Offline support, installable |

### 2.3 State Management — Keputusan

**Tidak pakai Zustand.** State aplikasi ini bisa dihandle dengan:
- `useReducer` + `useContext` untuk bill state (persons, fees)
- `useState` lokal untuk UI state per komponen

Zustand baru dipertimbangkan jika state mulai shared ke banyak layer yang jauh dan prop drilling terasa menyakitkan. Untuk scope SplitBill saat ini, context + reducer sudah lebih dari cukup.

```
BillContext (useReducer)
├── persons[]
├── fees[]
└── actions: addPerson, updateItem, addFee, dst.
```

### 2.4 Data Fetching — Keputusan

**Tidak pakai TanStack Query.** Satu-satunya external call adalah ke Gemini API saat scan struk — hanya terjadi sekali per scan, bukan polling atau caching berkelanjutan. Native fetch dalam custom hook `useGeminiParser` sudah cukup.

TanStack Query baru relevan jika ada fitur seperti sync riwayat tagihan ke server, real-time, atau banyak endpoint yang saling bergantung.

### 2.5 AI & OCR
| Fitur | Teknologi | Alasan |
|---|---|---|
| OCR | Tesseract.js | Client-side, tidak perlu backend, gratis |
| AI Parsing | Google Gemini API (gemini-2.0-flash) | User sudah punya API key, murah, fast |
| HTTP | Native `fetch` | Tidak perlu axios untuk 1 endpoint |

### 2.6 Utilities
| Kebutuhan | Solusi |
|---|---|
| Screenshot/Download | html2canvas |
| Share WA | WhatsApp URL Scheme (native) |
| Copy clipboard | Navigator Clipboard API (native) |
| ID generation | `crypto.randomUUID()` (native) |
| Class merging | clsx + tailwind-merge (via shadcn/ui) |

### 2.7 Dev Tools
- ESLint + Prettier — code style
- Husky + lint-staged — pre-commit hooks
- Vitest + React Testing Library — unit & integration test
- TypeScript strict mode — no `any`, no implicit types

---

## 3. Struktur Proyek

```
splitbill/
├── public/
│   ├── icons/                    # PWA icons (72, 96, 128, 144, 152, 192, 384, 512)
│   ├── manifest.webmanifest      # PWA manifest
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Root: providers + layout
│   ├── vite-env.d.ts
│   │
│   ├── types/                    # Semua TypeScript types & interfaces
│   │   ├── index.ts              # Re-export barrel
│   │   ├── bill.types.ts         # Person, Item, Fee, BillSummary
│   │   └── ocr.types.ts          # OCRResult, ParsedReceipt, GeminiResponse
│   │
│   ├── context/                  # React Context (state management)
│   │   ├── BillContext.tsx       # Context + Provider + useReducer
│   │   └── bill.reducer.ts       # Pure reducer function + action types
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useBill.ts            # Consume BillContext, expose actions
│   │   ├── useBillSummary.ts     # Kalkulasi derived state (subtotal, total, dll)
│   │   ├── useOCR.ts             # Tesseract.js wrapper dengan progress
│   │   ├── useGeminiParser.ts    # Fetch Gemini API, parse response
│   │   ├── useShareExport.ts     # Download PNG, share WA, copy text
│   │   └── useTheme.ts           # Dark/light mode toggle + localStorage
│   │
│   ├── lib/                      # Pure utility functions (zero React, zero side effects)
│   │   ├── formatters.ts         # formatCurrency, formatDate
│   │   ├── calculators.ts        # calculateBillSummary (pure function)
│   │   ├── validators.ts         # isValidPrice, isValidName
│   │   └── constants.ts          # DEFAULT_FEES, COLORS, APP_NAME
│   │
│   ├── services/                 # External service adapters
│   │   └── gemini.service.ts     # buildPrompt(), callGeminiAPI(), parseResponse()
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui generated components (jangan edit manual)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── toast.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Logo + dark mode toggle + tombol scan
│   │   │   └── PageWrapper.tsx   # Max-width container + padding
│   │   │
│   │   ├── bill/                 # Domain: input pesanan
│   │   │   ├── PersonList.tsx    # Grid semua PersonCard + AddPersonButton
│   │   │   ├── PersonCard.tsx    # Kartu 1 orang: nama + list item
│   │   │   ├── ItemRow.tsx       # 1 baris: nama item + harga + hapus
│   │   │   └── AddPersonButton.tsx
│   │   │
│   │   ├── fees/                 # Domain: biaya tambahan
│   │   │   ├── FeeSection.tsx    # Container: title + list + add button
│   │   │   └── FeeRow.tsx        # Toggle +/-, nama, amount, hapus
│   │   │
│   │   ├── summary/              # Domain: hasil kalkulasi
│   │   │   ├── SummaryPanel.tsx  # Wrapper ringkasan + action bar
│   │   │   ├── PersonSummary.tsx # Ringkasan 1 orang: items + fee share + total
│   │   │   ├── GrandTotalBar.tsx # Total keseluruhan
│   │   │   └── ActionBar.tsx     # Tombol: Download | Share WA | Copy
│   │   │
│   │   ├── scanner/              # Domain: OCR scanner
│   │   │   ├── ScannerModal.tsx  # Dialog utama scanner
│   │   │   ├── ImageUploader.tsx # Drag & drop area + kamera input
│   │   │   ├── OCRProgress.tsx   # Progress bar + status text
│   │   │   └── ParsedPreview.tsx # Review hasil sebelum apply ke bill
│   │   │
│   │   └── shared/              # Komponen reusable lintas domain
│   │       ├── EmptyState.tsx
│   │       ├── OfflineBanner.tsx # Muncul saat tidak ada internet
│   │       └── ReceiptSnapshot.tsx # Hidden component untuk html2canvas
│   │
│   ├── pages/
│   │   └── Home.tsx              # Rakit semua section
│   │
│   └── styles/
│       └── globals.css           # Tailwind directives + CSS variables tema
│
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Types & Interfaces

```typescript
// src/types/bill.types.ts

export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface Person {
  id: string;
  name: string;
  items: Item[];
  colorIndex: number; // index ke COLORS constant
}

export type FeeType = 'add' | 'subtract';

export interface Fee {
  id: string;
  name: string;
  amount: number;
  type: FeeType;
  isDefault: boolean; // true = tidak bisa dihapus, hanya di-reset ke 0
}

// Derived / calculated types
export interface PersonCalculation extends Person {
  subtotal: number;      // jumlah semua item
  ratio: number;         // subtotal / grandSubtotal (0–1)
  feeShare: number;      // porsi fee yang ditanggung (bisa negatif jika discount)
  total: number;         // subtotal + feeShare
}

export interface BillSummary {
  persons: PersonCalculation[];
  grandSubtotal: number;
  totalAdditional: number;  // total semua fee type 'add'
  totalDeductions: number;  // total semua fee type 'subtract'
  netFees: number;          // totalAdditional - totalDeductions
  grandTotal: number;
}
```

```typescript
// src/types/ocr.types.ts

export interface OCRResult {
  text: string;
  confidence: number;  // 0–100
}

export interface ParsedReceiptItem {
  name: string;
  price: number;
}

export interface ParsedReceipt {
  items: ParsedReceiptItem[];
  rawText: string;       // untuk fallback manual edit
  confidence: 'high' | 'medium' | 'low';
}

export type GeminiParseStatus =
  | 'idle'
  | 'ocr-processing'
  | 'ai-parsing'
  | 'done'
  | 'error';
```

```typescript
// src/context/bill.reducer.ts

export type BillAction =
  | { type: 'ADD_PERSON' }
  | { type: 'REMOVE_PERSON'; id: string }
  | { type: 'UPDATE_PERSON_NAME'; id: string; name: string }
  | { type: 'ADD_ITEM'; personId: string }
  | { type: 'UPDATE_ITEM'; personId: string; itemId: string; field: 'name' | 'price'; value: string | number }
  | { type: 'REMOVE_ITEM'; personId: string; itemId: string }
  | { type: 'ADD_FEE' }
  | { type: 'UPDATE_FEE'; id: string; field: keyof Fee; value: unknown }
  | { type: 'REMOVE_FEE'; id: string }
  | { type: 'APPLY_PARSED_RECEIPT'; personId: string; items: ParsedReceiptItem[] }
  | { type: 'RESET_BILL' };
```

---

## 5. Design System

### 5.1 Color Tokens (CSS Variables)

```css
/* src/styles/globals.css */

:root {
  /* Light mode */
  --bg: #fafaf8;
  --surface: #ffffff;
  --surface-2: #f4f4f0;
  --border: #e4e4dc;
  --accent: #b5d400;
  --accent-fg: #1a1a0f;
  --text: #1a1a1a;
  --muted: #737373;
  --success: #22c55e;
  --danger: #ef4444;
  --radius: 12px;
}

.dark {
  --bg: #0f0f13;
  --surface: #18181f;
  --surface-2: #21212c;
  --border: #2e2e3e;
  --accent: #c8f135;
  --accent-fg: #0f0f13;
  --text: #f0f0f5;
  --muted: #7a7a9a;
  --success: #3ddc84;
  --danger: #ff5a5a;
}
```

Di Tailwind config, token ini dipetakan ke utility class:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      bg: 'var(--bg)',
      surface: 'var(--surface)',
      'surface-2': 'var(--surface-2)',
      border: 'var(--border)',
      accent: 'var(--accent)',
      'accent-fg': 'var(--accent-fg)',
      // dst...
    }
  }
}
```

### 5.2 Typography
| Peran | Font | Weight |
|---|---|---|
| Display / Heading | Syne | 700, 800 |
| Body / Label | DM Sans | 300, 400, 500 |
| Angka / Currency | JetBrains Mono | 400, 600 |

### 5.3 Dark Mode Strategy
- `darkMode: 'class'` di Tailwind config
- Class `dark` di-toggle di `document.documentElement`
- Default: ikuti `prefers-color-scheme` sistem
- Preferensi user disimpan di `localStorage` dengan key `splitbill-theme`
- Hook `useTheme` menghandle semua ini

---

## 6. Feature Specifications

### 6.1 Manajemen Orang & Item

**Rules:**
- Minimal 1 orang, tidak ada maksimum praktis
- Nama orang editable inline, placeholder "Person A", "Person B", dst.
- Setiap orang minimal punya 1 baris item (tidak bisa kosong sama sekali)
- Item kosong (nama kosong DAN harga 0) dikecualikan dari kalkulasi dan summary
- Harga: input number, format Rupiah otomatis saat blur

**UX:**
- Saat tambah orang → auto focus ke input nama
- Saat hapus orang terakhir → toast error, aksi dibatalkan
- Saat hapus item terakhir dari seorang → toast error, aksi dibatalkan

### 6.2 Fee Management

**Default fees (hardcoded di constants, `isDefault: true`):**
```typescript
// src/lib/constants.ts
export const DEFAULT_FEES: Omit<Fee, 'id'>[] = [
  { name: 'Delivery Fee', amount: 0, type: 'add', isDefault: true },
  { name: 'Admin Fee',    amount: 0, type: 'add', isDefault: true },
  { name: 'Discount',     amount: 0, type: 'subtract', isDefault: true },
];
```

- Default fees **tidak bisa dihapus**, hanya bisa diisi 0
- Custom fees bisa ditambah dan dihapus bebas
- Toggle +/- mengubah `type` antara `'add'` dan `'subtract'`

**Formula distribusi fee:**
```
// src/lib/calculators.ts
grandSubtotal   = Σ person.subtotal
netFees         = Σ fee.amount (add) − Σ fee.amount (subtract)
ratio[person]   = person.subtotal / grandSubtotal  // 0 jika grandSubtotal = 0
feeShare[person] = netFees × ratio[person]
total[person]   = person.subtotal + feeShare[person]
grandTotal      = grandSubtotal + netFees
```

Edge case: jika `grandSubtotal = 0` (semua item kosong), fee dibagi rata.

### 6.3 OCR Scanner + Gemini AI

**Flow lengkap:**
```
User buka modal
  → Upload foto / gunakan kamera
  → Tesseract.js proses gambar (tampil progress %)
  → Raw OCR text dikirim ke Gemini API
  → Gemini return JSON terstruktur
  → User preview + assign ke orang mana
  → Apply → items ter-append ke person yang dipilih
```

**Gemini API — model & prompt:**
```typescript
// src/services/gemini.service.ts

const MODEL = 'gemini-2.0-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_PROMPT = `
Kamu adalah parser struk belanja Indonesia.
Dari teks OCR berikut, ekstrak semua nama item dan harganya.
Abaikan total, subtotal, pajak, dan baris yang bukan item.
Normalisasi harga: hilangkan titik/koma pemisah ribuan, return angka integer.
Kembalikan HANYA JSON valid tanpa markdown, tanpa penjelasan:
{ "items": [{ "name": string, "price": number }] }
`;
```

**Penanganan error & fallback:**
- Gemini API gagal (network/quota) → tampilkan raw OCR text di textarea, user edit manual
- Tesseract confidence < 60% → tampilkan warning, tetap lanjut
- JSON Gemini tidak valid → coba `JSON.parse` di dalam try-catch, fallback ke manual

**Lazy loading:**
- Tesseract.js di-import via dynamic `import()` — hanya saat modal scanner dibuka pertama kali
- Hemat ~2MB initial bundle

### 6.4 Output & Sharing

**Download PNG:**
```typescript
// useShareExport.ts
const downloadImage = async () => {
  const el = document.getElementById('receipt-snapshot')!;
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: null });
  const link = document.createElement('a');
  link.download = `splitbill-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
```

**Share WhatsApp:**
- Format teks menggunakan WA markdown (*bold* untuk nama dan total)
- `window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')`

**Copy teks:**
- `navigator.clipboard.writeText(text)` → toast "Tersalin! ✓" selama 2 detik

### 6.5 Progressive Web App (PWA)

**Kapabilitas:**
- ✅ Installable (Add to Home Screen di Android & iOS)
- ✅ Offline: core app fully functional
- ✅ Offline: OCR lokal (Tesseract) tetap bisa jalan
- ❌ Offline: Gemini API tidak bisa (butuh internet) → tampil `OfflineBanner`

**Workbox caching strategy:**
| Asset | Strategi |
|---|---|
| App shell (JS, CSS, HTML) | Cache-first |
| Google Fonts | StaleWhileRevalidate |
| Tesseract WASM + traineddata | Cache-first (file besar) |
| Gambar upload user | Tidak di-cache |
| Gemini API | Network-only (tidak bisa offline) |

---

## 7. Non-Functional Requirements

| Aspek | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse PWA Score | ≥ 90 |
| Lighthouse Performance | ≥ 85 |
| Initial bundle size | < 200KB gzip (tanpa Tesseract) |
| Tesseract | Lazy loaded, hanya saat dibutuhkan |
| Mobile-first | Breakpoints: sm 640px, md 768px |
| Aksesibilitas | ARIA labels, keyboard navigable, fokus visible |

---

## 8. Environment Variables

```env
# .env.example
VITE_GEMINI_API_KEY=AIza...    # Required untuk fitur scan struk
VITE_APP_VERSION=1.0.0
```

> ⚠️ **Keamanan:** API key Gemini akan terekspos di client-side bundle karena ini pure frontend. Untuk penggunaan pribadi/internal ini oke. Jika nanti di-deploy public, gunakan proxy ringan (Cloudflare Worker / Vercel Edge Function) agar key tidak terekspos.

---

## 9. Roadmap & Step-by-Step Development

---

### 🟢 Phase 0 — Project Setup *(Hari 1, ~2–3 jam)*

**Tujuan:** Project bisa jalan, semua tooling terkonfigurasi.

```bash
# Init
pnpm create vite@latest splitbill -- --template react-ts
cd splitbill

# Tailwind v4
pnpm add tailwindcss @tailwindcss/vite
pnpm add clsx tailwind-merge

# shadcn/ui
pnpm dlx shadcn@latest init

# PWA
pnpm add -D vite-plugin-pwa

# OCR
pnpm add tesseract.js

# Export
pnpm add html2canvas

# Icon set
pnpm add lucide-react

# Dev tools
pnpm add -D prettier eslint-config-prettier
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D husky lint-staged
```

**Checklist:**
- [ ] `tsconfig.json` — strict mode on, path alias `@/` → `./src/`
- [ ] `vite.config.ts` — alias `@/`, plugin PWA (config minimal dulu)
- [ ] `tailwind.config.ts` — darkMode class, extend colors dari CSS vars
- [ ] `src/styles/globals.css` — CSS variables light/dark, Tailwind directives
- [ ] `.eslintrc.json` + `.prettierrc` — rules standar
- [ ] Husky pre-commit: `lint-staged` (eslint + prettier)
- [ ] Buat semua folder struktur kosong + barrel `index.ts`
- [ ] Install shadcn/ui components: `pnpm dlx shadcn@latest add button input card dialog badge switch toast skeleton`

---

### 🟢 Phase 1 — Types, Constants & Pure Logic *(Hari 2, ~3 jam)*

**Tujuan:** Fondasi logika yang bisa ditest tanpa React.

**Deliverable:**
- [ ] `src/types/bill.types.ts` — semua interfaces
- [ ] `src/types/ocr.types.ts` — OCR + Gemini types
- [ ] `src/types/index.ts` — re-export
- [ ] `src/lib/constants.ts` — `DEFAULT_FEES`, `COLORS[]`, `APP_NAME`
- [ ] `src/lib/formatters.ts` — `formatCurrency(n)`, `formatPercent(n)`
- [ ] `src/lib/calculators.ts` — `calculateBillSummary(persons, fees): BillSummary`
- [ ] `src/lib/validators.ts` — `isValidPrice(v)`, `isNonEmptyString(v)`
- [ ] Test: `calculators.test.ts` — unit test edge cases (subtotal 0, discount > total, 1 orang)

---

### 🟢 Phase 2 — State Management (Context + Reducer) *(Hari 2–3, ~3 jam)*

**Tujuan:** State global bill bisa diakses dan dimodifikasi dari mana saja.

**Deliverable:**
- [ ] `src/context/bill.reducer.ts` — pure reducer + semua action types
- [ ] `src/context/BillContext.tsx` — Context, Provider, initial state dengan default fees
- [ ] `src/hooks/useBill.ts` — shortcut hook: `const { persons, fees, addPerson, ... } = useBill()`
- [ ] `src/hooks/useBillSummary.ts` — `useMemo` dari context untuk derived BillSummary
- [ ] Wrap `App.tsx` dengan `BillProvider`
- [ ] Test: `bill.reducer.test.ts` — test tiap action

---

### 🟢 Phase 3 — Core UI Components *(Hari 3–5, ~1–2 hari)*

**Tujuan:** Tampilan utama fungsional — input orang, item, fee.

**Urutan build:**
1. [ ] `layout/Header.tsx` — logo + placeholder theme toggle
2. [ ] `layout/PageWrapper.tsx`
3. [ ] `bill/ItemRow.tsx` — input nama + harga
4. [ ] `bill/PersonCard.tsx` — nama person + list ItemRow
5. [ ] `bill/PersonList.tsx` — grid cards
6. [ ] `bill/AddPersonButton.tsx`
7. [ ] `fees/FeeRow.tsx` — toggle +/-, nama, amount
8. [ ] `fees/FeeSection.tsx`
9. [ ] `pages/Home.tsx` — rakit semua

**QA checkpoint:** App bisa input data, state terupdate, tidak ada console error.

---

### 🟢 Phase 4 — Summary & Export *(Hari 6, ~4 jam)*

**Tujuan:** Kalkulasi tampil dengan benar, share/download bisa dipakai.

**Deliverable:**
- [ ] `summary/PersonSummary.tsx`
- [ ] `summary/GrandTotalBar.tsx`
- [ ] `summary/SummaryPanel.tsx`
- [ ] `shared/ReceiptSnapshot.tsx` — hidden component untuk html2canvas
- [ ] `summary/ActionBar.tsx` — 3 tombol
- [ ] `src/hooks/useShareExport.ts` — download, WA share, copy
- [ ] Test manual: download PNG, buka di WA, copy paste

---

### 🟢 Phase 5 — Dark Mode & Polish *(Hari 7, ~3 jam)*

**Tujuan:** Dark/light mode mulus, UI terasa polished.

**Deliverable:**
- [ ] `src/hooks/useTheme.ts` — toggle, persist, sync sistem
- [ ] Theme toggle button di Header
- [ ] Audit semua komponen: pastikan ada `dark:` variant yang tepat
- [ ] Tambahkan animasi: fade-in card, smooth transition theme
- [ ] Toast notifications (pakai shadcn/ui Sonner atau Toast)
- [ ] Responsive check: mobile 375px, tablet 768px, desktop 1280px

---

### 🟢 Phase 6 — PWA *(Hari 8, ~2 jam)*

**Tujuan:** App bisa di-install dan jalan offline.

**Deliverable:**
- [ ] Generate PWA icons (pakai tools seperti PWA Asset Generator)
- [ ] `public/manifest.webmanifest` — name, icons, theme color, display standalone
- [ ] `vite.config.ts` — konfigurasi penuh vite-plugin-pwa dengan Workbox
- [ ] `shared/OfflineBanner.tsx` — deteksi `navigator.onLine`, tampil saat offline
- [ ] Test: install di Android Chrome, test offline mode

---

### 🟢 Phase 7 — OCR Scanner *(Hari 9–11, ~2–3 hari)*

**Tujuan:** Scan struk bisa jalan end-to-end.

**Deliverable:**
- [ ] `services/gemini.service.ts` — `callGemini(ocrText, apiKey): ParsedReceipt`
- [ ] `src/hooks/useOCR.ts` — lazy load Tesseract, progress callback, return `{ scan, progress, isLoading, error }`
- [ ] `src/hooks/useGeminiParser.ts` — orchestrate OCR → Gemini → return `ParsedReceipt`, handle semua error states
- [ ] `scanner/ImageUploader.tsx` — drag & drop + file input + kamera (accept="image/*,application/pdf")
- [ ] `scanner/OCRProgress.tsx` — progress bar + status teks
- [ ] `scanner/ParsedPreview.tsx` — tabel hasil + assign ke person mana + tombol apply
- [ ] `scanner/ScannerModal.tsx` — rakit komponen scanner dalam Dialog
- [ ] Tombol scan di Header → buka ScannerModal
- [ ] Test: foto struk ojol, struk supermarket, screenshot nota WA

---

### 🟢 Phase 8 — Testing & QA *(Hari 12, ~4 jam)*

**Tujuan:** Tidak ada bug kritikal sebelum deploy.

- [ ] Unit test: `calculators`, `formatters`, `validators`, `bill.reducer`
- [ ] Integration test: `BillContext` — flow add person → add item → hitung summary
- [ ] Manual test checklist:
  - [ ] Split 2 orang, 3 item, 1 fee, 1 discount — angka benar
  - [ ] Hapus orang → kalkulasi update
  - [ ] Toggle dark mode → persist setelah refresh
  - [ ] Download PNG — kualitas oke
  - [ ] Share WA — format teks rapi
  - [ ] Install PWA — bisa jalan offline
  - [ ] Scan struk — hasil masuk ke form

---

### 🟡 Phase 9 — Deploy *(Hari 13)*

**Recommended: Vercel atau Netlify (free tier, auto-deploy dari GitHub)**

```bash
# Build
pnpm build

# Preview lokal
pnpm preview
```

- [ ] Push ke GitHub
- [ ] Connect Vercel/Netlify → auto deploy
- [ ] Set environment variable `VITE_GEMINI_API_KEY` di dashboard
- [ ] Test production build — pastikan PWA, service worker, dan semua fitur jalan

---

## 10. Keputusan yang Ditunda (untuk dipertimbangkan nanti)

| Fitur | Status | Alasan ditunda |
|---|---|---|
| Riwayat tagihan (history) | Backlog | Butuh localStorage persistence atau backend |
| Multi-currency | Backlog | Scope terlalu luas untuk v1 |
| Split bill merata (bukan proporsional) | Backlog | Alternatif mode kalkulasi |
| Backend proxy untuk Gemini key | Backlog | Oke untuk personal use tanpa proxy |
| Kolaborasi real-time | Tidak direncanakan | Butuh backend & WebSocket |

---

*Dokumen ini living document — update seiring development.*