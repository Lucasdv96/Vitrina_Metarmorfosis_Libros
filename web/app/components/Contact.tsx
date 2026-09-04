const WHATSAPP_URL = 'https://wa.me/5492235474644';
const INSTAGRAM_URL = 'https://www.instagram.com/libros.metamorfosis/';

export default function Contact() {
  return (
    <section id="contacto" className="block">
      <div className="wrap">
        <h2>Contacto</h2>
        <p className="section-lede">¿Encontraste algo que te gustó? Escribime y coordinamos la entrega.</p>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>WhatsApp</h3>
            <p>Retiro en mano en Mar del Plata o envío por correo a cualquier provincia del país.</p>
            <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener">
              Escribir por WhatsApp
            </a>
          </div>
          <div className="contact-card">
            <h3>Instagram</h3>
            <p>Novedades, nuevos ingresos y el detrás de escena de la librería.</p>
            <a className="btn btn-ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener">
              @libros.metamorfosis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
