import Header from './components/Header';
import Hero from './components/Hero';
import Sobre from './components/Sobre';
import Catalog from './components/Catalog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { getBooks } from './lib/books';
import { withCovers } from './lib/covers';

// El catálogo tiene que leerse en cada visita (no servir una versión
// vieja cacheada); las portadas individuales igual se cachean por su
// cuenta en covers.ts.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const books = await withCovers(await getBooks());

  return (
    <>
      <Header />
      <div className="endpaper" />
      <Hero />
      <Sobre />
      <Catalog books={books} />
      <Contact />
      <div className="endpaper" />
      <Footer />
    </>
  );
}
