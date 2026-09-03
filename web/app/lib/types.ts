export type Estado = 'Usado' | 'Nuevo';
export type Stock = 'Disponible' | 'Vendido';

export interface Book {
  titulo: string;
  autor: string;
  estado: Estado;
  precio: number;
  stock: Stock;
  genero?: string;
}
