import Image from 'next/image';

const WHATSAPP_URL = 'https://wa.me/5492235474644';
const INSTAGRAM_URL = 'https://www.instagram.com/libros.metamorfosis/';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="medallion">
        <Image
          className="hero-logo"
          src="/logo.png"
          alt="Metamorfosis — Librería Online"
          width={260}
          height={260}
          priority
        />
      </div>
      <div className="hero-body">
        <h1>Libros usados, elegidos con cariño</h1>
        <p className="lede">
          Cada ejemplar pasó por mis manos antes de llegar a las tuyas. Retiro en mano en Mar del
          Plata o envío a cualquier provincia.
        </p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener">
            Escribir por WhatsApp
          </a>
          <a className="btn btn-ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener">
            @libros.metamorfosis
          </a>
        </div>
      </div>
    </section>
  );
}
