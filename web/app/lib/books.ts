import { Book } from './types';
import { parseBooksCsv } from './parse-books';
import { rawBooksCsv } from './raw-books-data';

/**
 * Fuente de datos del catálogo. Hoy lee el snapshot local; cuando la
 * planilla esté publicada como CSV, reemplazar por:
 *
 *   const res = await fetch(CSV_URL, { next: { revalidate: 3600 } });
 *   return parseBooksCsv(await res.text());
 */
export function getBooks(): Book[] {
  return parseBooksCsv(rawBooksCsv);
}
