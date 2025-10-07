import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Fertilizante NPK 20-20-20',
      description: 'Fertilizante completo para cultivos de alto rendimiento.',
      price: 250,
      stock: 120,
      isActive: true,
    },
    {
      id: 2,
      name: 'Semilla de maíz híbrido',
      description: 'Semilla de alta productividad resistente a sequías.',
      price: 600,
      stock: 50,
      isActive: true,
    },
  ];

  // ✅ Listar con filtros/paginación/ordenación
  list(params: {
    page?: number;
    limit?: number;
    q?: string;
    onlyActive?: boolean;
    sortBy?: 'name' | 'price' | 'stock' | 'id';
    sortDir?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));
    const needle = (params.q ?? '').toLowerCase();
    const onlyActive = !!params.onlyActive;
    const sortBy = params.sortBy ?? 'id';
    const sortDir = params.sortDir ?? 'asc';

    let data = [...this.products];

    if (onlyActive) data = data.filter((p) => p.isActive);
    if (needle) {
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          (p.description ?? '').toLowerCase().includes(needle),
      );
    }

    // Ordenar
    data.sort((a, b) => {
      const A = a[sortBy];
      const B = b[sortBy];
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginación
    const total = data.length;
    const start = (page - 1) * limit;
    const pageData = data.slice(start, start + limit);
    const pageCount = Math.max(1, Math.ceil(total / limit));

    return {
      data: pageData,
      meta: { page, limit, total, pageCount, sortBy, sortDir },
    };
  }

  // ✅ Obtener producto por ID
  getById(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  // ✅ Crear nuevo producto
  create(dto: CreateProductDto) {
    const newProduct: Product = {
      id: this.products.length ? Math.max(...this.products.map((p) => p.id)) + 1 : 1,
      name: dto.name,
      description: dto.description ?? '',
      price: dto.price,
      stock: dto.stock ?? 0,
      isActive: true,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // ✅ Actualizar producto
  update(id: number, dto: UpdateProductDto) {
    const product = this.getById(id);
    Object.assign(product, dto);
    return product;
  }

  // ✅ Activar o desactivar producto
  setActive(id: number, active: boolean) {
    const product = this.getById(id);
    product.isActive = active;
    return product;
  }

  // ✅ Eliminar producto
  remove(id: number) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    const deleted = this.products[index];
    this.products.splice(index, 1);
    return deleted;
  }
}
