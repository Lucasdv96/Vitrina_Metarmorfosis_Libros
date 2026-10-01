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
 * Convierte el CSV publicado de la planilla en libros.
 *
 * La hoja "Por género" agrupa los libros en secciones: una fila
 * "[merged] <Género>" (celda combinada) antes de cada grupo, seguida
 * del encabezado de columnas repetido ("Libro, Autor/a, ...") y recién
 * después las filas de libros. También hay filas de categoría suelta
 * ("/ FICCIÓN", "/ NO FICCIÓN") sin relación con ningún género.
 *
 * Este parser recorre las filas llevando el "género actual": lo
 * actualiza al pasar por una fila [merged], ignora los encabezados
 * repetidos y las filas de categoría, y asigna ese género a cada libro
 * real. Si en el futuro la planilla vuelve a tener una columna
 * "Género" explícita, se usa esa en vez de la sección.
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
  let currentGenero: string | undefined;

  for (const row of rows.slice(1)) {
    const primeraCelda = (row[0] ?? '').trim();

    if (primeraCelda.toLowerCase().startsWith('[merged]')) {
      const seccion = primeraCelda.replace(/^\[merged\]\s*/i, '').trim();
      // Ignora separadores alfabéticos de una sola letra (ej. "[merged] A"),
      // que no son género.
      if (seccion.length > 1) currentGenero = seccion || undefined;
      continue;
    }

    if (primeraCelda.startsWith('/')) continue; // categoría suelta, ej. "/ FICCIÓN"

    const titulo = (row[idxTitulo] ?? '').trim();
    if (!titulo || titulo.toLowerCase() === 'libro') continue; // vacía o encabezado repetido

    const generoColumna = idxGenero >= 0 ? row[idxGenero]?.trim() : undefined;
    const genero = generoColumna || currentGenero;

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
