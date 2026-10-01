import { Book } from './types';
import { parseBooksCsv } from './parse-books';
import { rawBooksCsv } from './raw-books-data';

/**
 * Fuente de datos del catálogo. Si CATALOG_CSV_URL está configurada,
 * lee la planilla publicada en vivo (sin cachear, para que cada visita
 * refleje los últimos cambios de Soledad); si no está seteada, o si el
 * fetch falla por cualquier motivo, cae al snapshot local para que el
 * sitio nunca se rompa.
 */
export async function getBooks(): Promise<Book[]> {
  const csvUrl = process.env.CATALOG_CSV_URL;

  if (csvUrl) {
    try {
      const res = await fetch(csvUrl, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        const books = parseBooksCsv(text);
        if (books.length > 0) return books;
      }
    } catch {
      // sigue al snapshot local
    }
  }

  return parseBooksCsv(rawBooksCsv);
}
