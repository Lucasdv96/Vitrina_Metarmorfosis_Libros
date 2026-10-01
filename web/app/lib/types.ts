export type Estado = 'Usado' | 'Nuevo';
export type Stock = 'Disponible' | 'Vendido';

export interface Book {
  titulo: string;
  autor: string;
  estado: Estado;
  precio: number;
  stock: Stock;
  genero?: string;
  /** URL de la portada resuelta contra Google Books. Ausente si no se encontró. */
  portada?: string;
}
