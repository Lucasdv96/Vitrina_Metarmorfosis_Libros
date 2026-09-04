import Header from './components/Header';
import Hero from './components/Hero';
import Sobre from './components/Sobre';
import Catalog from './components/Catalog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { getBooks } from './lib/books';

export default function Page() {
  const books = getBooks();

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
