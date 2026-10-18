import { InvoiceHistoryItem } from '../types/types';

export const HISTORY_EXPORT_VERSION = 1;

export interface HistoryExportJSON {
  version: number;
  exportedAt: string;
  items: InvoiceHistoryItem[];
}

export interface ParseResult {
  items: InvoiceHistoryItem[];
  skipped: number;
}

export type ImportMode = 'merge' | 'replace';

export interface ImportResult {
  added: number;
  skipped: number;
  total: number;
}

const HISTORY_FIELDS: (keyof InvoiceHistoryItem)[] = [
  'id',
  'companyId',
  'companyName',
  'invoiceNumber',
  'purpose',
  'amount',
  'startDate',
  'endDate',
  'generatedAt',
];

const escapeCsvField = (value: string): string => {
  if (value == null) return '';
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const serializeHistoryToCSV = (history: InvoiceHistoryItem[]): string => {
  const header = HISTORY_FIELDS.join(',');
  const rows = history.map(item =>
    HISTORY_FIELDS.map(field => escapeCsvField(item[field] ?? '')).join(',')
  );
  return [header, ...rows].join('\r\n');
};

export const serializeHistoryToJSON = (history: InvoiceHistoryItem[]): string => {
  const payload: HistoryExportJSON = {
    version: HISTORY_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    items: history,
  };
  return JSON.stringify(payload, null, 2);
};

// Minimal RFC 4180-aware CSV parser (single-table, no streaming).
export const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = '';
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (char === ',') {
      current.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (char === '\r') {
      // Normalize CRLF; skip and let \n handle row break.
      i += 1;
      continue;
    }
    if (char === '\n') {
      current.push(field);
      rows.push(current);
      current = [];
      field = '';
      i += 1;
      continue;
    }

    field += char;
    i += 1;
  }

  // Flush trailing field/row (unless the file ended on a newline with nothing after).
  if (field.length > 0 || current.length > 0) {
    current.push(field);
    rows.push(current);
  }

  return rows;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const coerceHistoryItem = (raw: Record<string, unknown>): InvoiceHistoryItem | null => {
  if (!isNonEmptyString(raw.id)) return null;
  const item: InvoiceHistoryItem = {
    id: String(raw.id),
    companyId: typeof raw.companyId === 'string' ? raw.companyId : '',
    companyName: typeof raw.companyName === 'string' ? raw.companyName : '',
    invoiceNumber: typeof raw.invoiceNumber === 'string' ? raw.invoiceNumber : '',
    purpose: typeof raw.purpose === 'string' ? raw.purpose : '',
    amount: typeof raw.amount === 'string' ? raw.amount : String(raw.amount ?? ''),
    startDate: typeof raw.startDate === 'string' ? raw.startDate : '',
    endDate: typeof raw.endDate === 'string' ? raw.endDate : '',
    generatedAt: typeof raw.generatedAt === 'string' ? raw.generatedAt : '',
  };
  return item;
};

export const parseHistoryFromCSV = (text: string): ParseResult => {
  const rows = parseCSV(text).filter(row => row.length > 1 || (row.length === 1 && row[0] !== ''));
  if (rows.length === 0) {
    return { items: [], skipped: 0 };
  }

  const header = rows[0].map(h => h.trim());
  if (!header.includes('id')) {
    throw new Error('CSV header is missing required column "id".');
  }

  const items: InvoiceHistoryItem[] = [];
  let skipped = 0;
  for (let r = 1; r < rows.length; r += 1) {
    const row = rows[r];
    if (row.every(cell => cell === '')) continue;
    const record: Record<string, unknown> = {};
    header.forEach((key, idx) => {
      record[key] = row[idx] ?? '';
    });
    const item = coerceHistoryItem(record);
    if (item) {
      items.push(item);
    } else {
      skipped += 1;
    }
  }
  return { items, skipped };
};

export const parseHistoryFromJSON = (text: string): ParseResult => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }

  let rawItems: unknown[];
  if (Array.isArray(parsed)) {
    rawItems = parsed;
  } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown }).items)) {
    rawItems = (parsed as { items: unknown[] }).items;
  } else {
    throw new Error('JSON does not contain an array of invoice history items.');
  }

  const items: InvoiceHistoryItem[] = [];
  let skipped = 0;
  for (const raw of rawItems) {
    if (raw && typeof raw === 'object') {
      const item = coerceHistoryItem(raw as Record<string, unknown>);
      if (item) {
        items.push(item);
        continue;
      }
    }
    skipped += 1;
  }
  return { items, skipped };
};

export const detectFormat = (filename: string, text: string): 'csv' | 'json' => {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.json')) return 'json';
  if (lower.endsWith('.csv')) return 'csv';
  const trimmed = text.trimStart();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  return 'csv';
};

export const mergeHistory = (
  existing: InvoiceHistoryItem[],
  incoming: InvoiceHistoryItem[]
): { merged: InvoiceHistoryItem[]; added: number } => {
  const byId = new Map<string, InvoiceHistoryItem>();
  for (const item of existing) byId.set(item.id, item);
  let added = 0;
  for (const item of incoming) {
    if (!byId.has(item.id)) added += 1;
    byId.set(item.id, item);
  }
  const merged = Array.from(byId.values()).sort((a, b) => {
    if (!a.generatedAt && !b.generatedAt) return 0;
    if (!a.generatedAt) return 1;
    if (!b.generatedAt) return -1;
    return b.generatedAt.localeCompare(a.generatedAt);
  });
  return { merged, added };
};

export const downloadBlob = (
  contents: string,
  filename: string,
  mimeType: string
): void => {
  if (typeof window === 'undefined') return;
  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const historyExportFilename = (ext: 'csv' | 'json', now: Date = new Date()): string => {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `invoice-history-${yyyy}-${mm}-${dd}.${ext}`;
};
