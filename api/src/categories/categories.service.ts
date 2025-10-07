import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './category.model';

@Injectable()
export class CategoriesService {
  private items: Category[] = [];
  private seq = 1;

  constructor() {
    // Seeds de ejemplo
    this.items.push(
      { id: this.seq++, name: 'Fertilizantes', isActive: true },
      { id: this.seq++, name: 'Semillas', isActive: true },
      { id: this.seq++, name: 'Herbicidas', isActive: true },
    );
  }

  list(params: { page?: number; limit?: number; q?: string; onlyActive?: boolean }) {
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));
    const needle = (params.q ?? '').toLowerCase();
    const onlyActive = !!params.onlyActive;

    let data = [...this.items];

    if (onlyActive) data = data.filter(c => c.isActive);
    if (needle) data = data.filter(c => c.name.toLowerCase().includes(needle));

    const total = data.length;
    const start = (page - 1) * limit;
    const pageData = data.slice(start, start + limit);
    const pageCount = Math.max(1, Math.ceil(total / limit));

    return { data: pageData, meta: { page, limit, total, pageCount } };
  }

  getById(id: number): Category {
    const c = this.items.find(x => x.id === id);
    if (!c) throw new NotFoundException('Categoría no encontrada');
    return c;
  }

  create(name: string): Category {
    const entity: Category = { id: this.seq++, name, isActive: true };
    this.items.push(entity);
    return entity;
  }

  update(id: number, input: Partial<Category>): Category {
    const c = this.getById(id);
    Object.assign(c, input);
    return c;
  }

  setActive(id: number, isActive: boolean) {
    const c = this.getById(id);
    c.isActive = isActive;
    return c;
  }

  remove(id: number) {
    const idx = this.items.findIndex(x => x.id === id);
    if (idx === -1) throw new NotFoundException('Categoría no encontrada');
    const deleted = this.items[idx];
    this.items.splice(idx, 1);
    return deleted;
  }
}
