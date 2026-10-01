import { parseBooksCsv } from '@/app/lib/parse-books';

/**
 * Ruta de diagnóstico temporal: hace el mismo fetch que getBooks() y
 * devuelve lo que recibió crudo, para diagnosticar por qué el catálogo
 * en vivo no refleja cambios de la planilla. Borrar una vez resuelto.
 */
export async function GET() {
  const csvUrl = process.env.CATALOG_CSV_URL;

  if (!csvUrl) {
    return Response.json({ error: 'CATALOG_CSV_URL no está seteada en este entorno' });
  }

  try {
    const res = await fetch(csvUrl, { cache: 'no-store' });
    const text = await res.text();
    const books = parseBooksCsv(text);

    return Response.json({
      status: res.status,
      ok: res.ok,
      contentType: res.headers.get('content-type'),
      bodyLength: text.length,
      bodyPreview: text.slice(0, 500),
      librosParseados: books.length,
      primerosLibros: books.slice(0, 3),
    });
  } catch (err) {
    return Response.json({ error: String(err) });
  }
}
