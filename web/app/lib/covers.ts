import { Book } from './types';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

// Las portadas no cambian: cachear por 7 días evita repetir la misma
// consulta a Google en cada visita.
const REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

async function queryGoogleBooks(query: string): Promise<string | undefined> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=1${apiKey ? `&key=${apiKey}` : ''}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return undefined;

    const data = await res.json();
    const imageLinks = data?.items?.[0]?.volumeInfo?.imageLinks;
    const thumbnail: string | undefined = imageLinks?.thumbnail ?? imageLinks?.smallThumbnail;
    if (!thumbnail) return undefined;

    // Google devuelve las URLs en http; forzar https evita contenido mixto.
    return thumbnail.replace(/^http:/, 'https:');
  } catch {
    return undefined;
  }
}

/**
 * Primero prueba la búsqueda exigente (título + autor); si no encuentra
 * nada, prueba solo por título. No se baja a búsqueda de texto libre
 * para no arriesgar traer la portada de un libro equivocado.
 */
async function resolveCoverUrl(titulo: string, autor: string): Promise<string | undefined> {
  const porTituloYAutor = await queryGoogleBooks(`intitle:${titulo} inauthor:${autor}`);
  if (porTituloYAutor) return porTituloYAutor;

  return queryGoogleBooks(`intitle:${titulo}`);
}

/**
 * Agrega la portada (si se encuentra) a cada libro, consultando Google
 * Books en paralelo. Si no hay resultado o la consulta falla, el libro
 * queda sin `portada` y la tarjeta cae a su diseño normal sin foto.
 */
export async function withCovers(books: Book[]): Promise<Book[]> {
  return Promise.all(
    books.map(async (book) => {
      const portada = await resolveCoverUrl(book.titulo, book.autor);
      return portada ? { ...book, portada } : book;
    }),
  );
}
