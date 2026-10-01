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

/**
 * En la planilla los títulos están tipeados con comillas literales
 * (ej. "Angeles y demonios"). Las saca para que no se vean en el sitio.
 */
function limpiarTitulo(raw: string): string {
  const t = raw.trim();
  if (t.length > 1 && t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1).trim();
  }
  return t;
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

function isHeaderRow(row: string[]): boolean {
  return (row[0] ?? '').trim().toLowerCase() === 'libro';
}

/**
 * Convierte el CSV publicado de la planilla en libros.
 *
 * La hoja "Por género" agrupa los libros en secciones: una fila con
 * solo el nombre del género en la primera columna (celda combinada,
 * el resto de columnas vacías) antes de cada grupo, seguida del
 * encabezado de columnas repetido ("Libro,Autor/a,..."). La fila 1 del
 * archivo no es el encabezado — es una categoría suelta ("/ FICCIÓN",
 * "/ NO FICCIÓN"), así que el encabezado hay que buscarlo en cualquier
 * parte del archivo, no asumir que es la primera fila.
 *
 * Este parser busca el primer encabezado real para saber en qué
 * columna está cada dato, y después recorre todas las filas llevando
 * el "género actual": una fila donde solo la primera celda tiene texto
 * (autor/estado/precio/stock vacíos) es un separador de sección, no un
 * libro — actualiza el género y sigue. Si en el futuro la planilla
 * tiene una columna "Género" explícita, se usa esa en vez de la
 * sección.
 */
export function parseBooksCsv(csvText: string): Book[] {
  const rows = parseCsv(csvText);
  if (rows.length === 0) return [];

  const headerRow = rows.find(isHeaderRow) ?? rows[0];
  const header = headerRow.map((h) => HEADER_ALIASES[h.trim().toLowerCase()] ?? h.trim().toLowerCase());
  const colIndex = (name: string) => header.indexOf(name);

  const idxTitulo = colIndex('titulo');
  const idxAutor = colIndex('autor');
  const idxEstado = colIndex('estado');
  const idxPrecio = colIndex('precio');
  const idxStock = colIndex('stock');
  const idxGenero = colIndex('genero');

  const books: Book[] = [];
  let currentGenero: string | undefined;

  for (const row of rows) {
    if (isHeaderRow(row)) continue;

    const primeraCelda = (row[0] ?? '').trim();
    if (!primeraCelda) continue;
    if (primeraCelda.startsWith('/')) continue; // categoría suelta, ej. "/ FICCIÓN"

    const sinOtrasColumnas =
      !(row[idxAutor] ?? '').trim() &&
      !(row[idxEstado] ?? '').trim() &&
      !(row[idxPrecio] ?? '').trim() &&
      !(row[idxStock] ?? '').trim();

    if (sinOtrasColumnas) {
      // Solo tiene la primera celda con texto: es un separador de
      // sección (género), no un libro.
      currentGenero = primeraCelda;
      continue;
    }

    const titulo = limpiarTitulo(row[idxTitulo] ?? '');
    if (!titulo) continue;

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
