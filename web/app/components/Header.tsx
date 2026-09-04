import Image from 'next/image';

export default function Header() {
  return (
    <header className="topbar">
      <div className="wrap">
        <a className="brandmark" href="#hero">
          <Image src="/logo.png" alt="Metamorfosis" width={38} height={38} />
          Metamorfosis
        </a>
        <nav className="links">
          <a href="#hero">Inicio</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#sobre">Sobre mí</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </div>
    </header>
  );
}
