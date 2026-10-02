import { Book } from './types';

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

// Las portadas no cambian: cachear por 7 días evita repetir la misma
// consulta a Google en cada visita.
const REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

interface VolumeInfo {
  authors?: string[];
  imageLinks?: { thumbnail?: string; smallThumbnail?: string };
}

async function searchGoogleBooks(query: string, maxResults: number): Promise<VolumeInfo[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}${apiKey ? `&key=${apiKey}` : ''}`;

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.items ?? []).map((item: { volumeInfo?: VolumeInfo }) => item.volumeInfo ?? {});
  } catch {
    return [];
  }
}

function getThumbnail(volume: VolumeInfo): string | undefined {
  const thumbnail = volume.imageLinks?.thumbnail ?? volume.imageLinks?.smallThumbnail;
  // Google devuelve las URLs en http; forzar https evita contenido mixto.
  return thumbnail?.replace(/^http:/, 'https:');
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** "Moscardi, M." -> "Moscardi"; "Marguerite Yourcenar" -> "Yourcenar". */
function apellidoDe(autor: string): string {
  const base = autor.includes(',') ? autor.split(',')[0] : (autor.trim().split(/\s+/).pop() ?? autor);
  return normalizar(base.trim());
}

function autorCoincide(volumeAuthors: string[] | undefined, autor: string): boolean {
  if (!volumeAuthors?.length) return false;
  const apellido = apellidoDe(autor);
  if (!apellido) return false;
  return volumeAuthors.some((a) => normalizar(a).includes(apellido));
}

/**
 * Primero prueba la búsqueda exigente (título + autor); si no encuentra
 * nada, prueba solo por título entre varios resultados, pero solo
 * acepta uno cuyo autor coincida con el buscado — evita traer la
 * portada de otro libro con el mismo título (ej. "El Amante" existe
 * de varios autores).
 */
async function resolveCoverUrl(titulo: string, autor: string): Promise<string | undefined> {
  const [exacto] = await searchGoogleBooks(`intitle:${titulo} inauthor:${autor}`, 1);
  const portadaExacta = exacto && getThumbnail(exacto);
  if (portadaExacta) return portadaExacta;

  const candidatos = await searchGoogleBooks(`intitle:${titulo}`, 5);
  const match = candidatos.find((v) => autorCoincide(v.authors, autor) && getThumbnail(v));
  return match ? getThumbnail(match) : undefined;
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
