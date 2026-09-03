import { Book, Estado, Stock } from './types';

/**
 * Parser CSV genérico: soporta campos entre comillas (con comas o comillas
 * escapadas como "") tal como los exporta Google Sheets.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

/**
 * Precios vienen como "$6.000,00". Tolera datos mal cargados (ej.
 * "$13.000,001000$") tomando el primer número con formato válido y
 * descartando el resto.
 */
function parsePrecio(raw: string): number {
  const cleaned = raw.replace(/[^\d.,]/g, '');
  const match = cleaned.match(/^(\d{1,3}(?:\.\d{3})*)(?:,\d{2})?/);
  if (!match) return 0;
  return Number(match[1].replace(/\./g, ''));
}

function normalizeEstado(raw: string): Estado {
  return raw.trim() === 'Nuevo' ? 'Nuevo' : 'Usado';
}

function normalizeStock(raw: string): Stock {
  return raw.trim() === 'Vendido' ? 'Vendido' : 'Disponible';
}

const HEADER_ALIASES: Record<string, string> = {
  libro: 'titulo',
  autor: 'autor',
  'autor/a': 'autor',
  estado: 'estado',
  precio: 'precio',
  stock: 'stock',
  genero: 'genero',
  'género': 'genero',
};

/**
 * Convierte el CSV publicado de la planilla en libros. Ignora filas
 * separadoras (ej. "[merged] A") y filas sin título.
 */
export function parseBooksCsv(csvText: string): Book[] {
  const rows = parseCsv(csvText);
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => HEADER_ALIASES[h.trim().toLowerCase()] ?? h.trim().toLowerCase());
  const colIndex = (name: string) => header.indexOf(name);

  const idxTitulo = colIndex('titulo');
  const idxAutor = colIndex('autor');
  const idxEstado = colIndex('estado');
  const idxPrecio = colIndex('precio');
  const idxStock = colIndex('stock');
  const idxGenero = colIndex('genero');

  const books: Book[] = [];

  for (const row of rows.slice(1)) {
    const titulo = (row[idxTitulo] ?? '').trim();
    if (!titulo || titulo.toLowerCase().startsWith('[merged]')) continue;

    const genero = idxGenero >= 0 ? row[idxGenero]?.trim() : undefined;

    books.push({
      titulo,
      autor: (row[idxAutor] ?? '').trim(),
      estado: normalizeEstado(row[idxEstado] ?? ''),
      precio: parsePrecio(row[idxPrecio] ?? ''),
      stock: normalizeStock(row[idxStock] ?? ''),
      genero: genero ? genero : undefined,
    });
  }

  return books;
}
