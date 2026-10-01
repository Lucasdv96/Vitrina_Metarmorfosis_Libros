/**
 * Ruta de diagnóstico temporal: hace la misma consulta a Google Books
 * que covers.ts y devuelve la respuesta cruda, para ver por qué no
 * aparecen portadas en el catálogo. Borrar una vez resuelto.
 *
 * Uso: /api/debug-cover?titulo=El%20Hobbit&autor=Tolkien
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const titulo = searchParams.get('titulo') ?? 'El Hobbit';
  const autor = searchParams.get('autor') ?? 'Tolkien';

  const q = encodeURIComponent(`intitle:${titulo} inauthor:${autor}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=3`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return Response.json({ queryUrl: url, status: res.status, ok: res.ok, data });
  } catch (err) {
    return Response.json({ queryUrl: url, error: String(err) });
  }
}
