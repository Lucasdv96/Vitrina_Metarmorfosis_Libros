'use client';

import { useMemo, useState } from 'react';
import { Book } from '../lib/types';
import { formatPrecio } from '../lib/format';

interface CatalogProps {
  books: Book[];
}

type Orden = 'az' | 'za' | 'precio-asc' | 'precio-desc';

export default function Catalog({ books }: CatalogProps) {
  const toned = useMemo(() => books.map((b, i) => ({ ...b, tone: i % 5 })), [books]);

  const generos = useMemo(() => {
    const set = new Set(toned.filter((b) => b.genero).map((b) => b.genero as string));
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, [toned]);

  const precios = toned.map((b) => b.precio);
  const precioMin = precios.length ? Math.min(...precios) : 0;
  const precioMax = precios.length ? Math.max(...precios) : 0;

  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('todos');
  const [genero, setGenero] = useState('todos');
  const [orden, setOrden] = useState<Orden>('az');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [vendidos, setVendidos] = useState(false);

  const filtered = useMemo(() => {
    const list = toned.filter((b) => {
      if (q) {
        const query = q.toLowerCase();
        if (!b.titulo.toLowerCase().includes(query) && !b.autor.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (estado !== 'todos' && b.estado !== estado) return false;
      if (genero !== 'todos' && b.genero !== genero) return false;
      if (min !== '' && b.precio < Number(min)) return false;
      if (max !== '' && b.precio > Number(max)) return false;
      if (!vendidos && b.stock === 'Vendido') return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (orden === 'az') return a.titulo.localeCompare(b.titulo, 'es');
      if (orden === 'za') return b.titulo.localeCompare(a.titulo, 'es');
      if (orden === 'precio-asc') return a.precio - b.precio;
      return b.precio - a.precio;
    });
  }, [toned, q, estado, genero, orden, min, max, vendidos]);

  return (
    <section id="catalogo" className="block">
      <div className="wrap">
        <h2>Catálogo</h2>
        <p className="section-lede">
          {toned.length} libros y sumando. Buscá por título o autor, o filtrá por lo que estés
          buscando.
        </p>

        <div className="controls">
          <div className="field search">
            <label htmlFor="search">Buscar</label>
            <input
              type="search"
              id="search"
              placeholder="Título o autor…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="filter-estado">Estado</label>
            <select id="filter-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="Usado">Usado</option>
              <option value="Nuevo">Nuevo</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="filter-genero">Género</label>
            <select id="filter-genero" value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="todos">Todos</option>
              {generos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort">Ordenar por</label>
            <select id="sort" value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
              <option value="az">Título A → Z</option>
              <option value="za">Título Z → A</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
          <div className="field price">
            <label>Precio (ARS)</label>
            <div className="price-fields">
              <input
                type="number"
                placeholder={`Desde $${precioMin.toLocaleString('es-AR')}`}
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
              <input
                type="number"
                placeholder={`Hasta $${precioMax.toLocaleString('es-AR')}`}
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </div>
          </div>
          <div className="toggle-field">
            <input
              type="checkbox"
              id="toggle-vendidos"
              checked={vendidos}
              onChange={(e) => setVendidos(e.target.checked)}
            />
            <label htmlFor="toggle-vendidos" style={{ margin: 0 }}>
              Mostrar vendidos
            </label>
          </div>
        </div>

        <p className="results-count">
          Mostrando {filtered.length} de {toned.length} libros
        </p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            No encontramos libros con esos filtros.
            <br />
            Probá ampliar el rango de precio o borrar la búsqueda.
          </div>
        ) : (
          <div className="book-grid">
            {filtered.map((b) => (
              <article
                key={`${b.titulo}-${b.autor}`}
                className={`book-card card-tone-${b.tone}${b.stock === 'Vendido' ? ' vendido' : ''}`}
              >
                {b.stock === 'Vendido' && <span className="stamp">Vendido</span>}
                <div>
                  <div className="titulo">{b.titulo}</div>
                  <div className="autor">{b.autor}</div>
                  <div className="meta">
                    <span className="chip">{b.estado}</span>
                    {b.genero && <span className="chip">{b.genero}</span>}
                  </div>
                </div>
                <div className="precio">{formatPrecio(b.precio)}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
