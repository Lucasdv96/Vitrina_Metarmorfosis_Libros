import { Book } from './types';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

// Las portadas no cambian: cachear por 7 días evita repetir la misma
// consulta a Google en cada visita.
const REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

async function resolveCoverUrl(titulo: string, autor: string): Promise<string | undefined> {
  const q = encodeURIComponent(`intitle:${titulo} inauthor:${autor}`);
  const url = `${GOOGLE_BOOKS_URL}?q=${q}&maxResults=1`;

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
