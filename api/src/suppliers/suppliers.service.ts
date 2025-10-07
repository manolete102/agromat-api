import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier } from './supplier.model';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierQueryDto } from './dto/supplier-query.dto';

@Injectable()
export class SuppliersService {
  private suppliers: Supplier[] = [];
  private seq = 1;

  // 🔹 Helper interno para paginar sin dependencias externas
  private paginate<T>(items: T[], page: number, limit: number) {
    const p = Math.max(1, page || 1);
    const l = Math.max(1, limit || 10);
    const start = (p - 1) * l;
    const end = start + l;
    return {
      data: items.slice(start, end),
      meta: {
        total: items.length,
        page: p,
        limit: l,
        pageCount: Math.ceil(items.length / l),
      },
    };
  }

  // 🔹 Listar con filtros
  list(query: SupplierQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const q = (query.q ?? '').toLowerCase();
    const onlyActive = (query.onlyActive ?? '').toLowerCase() === 'true';

    let data = this.suppliers.slice();

    if (q) {
      data = data.filter(s => s.name.toLowerCase().includes(q));
    }
    if (onlyActive) {
      data = data.filter(s => s.isActive);
    }

    return this.paginate(data, page, limit);
  }

  // 🔹 Buscar por ID
  getById(id: number): Supplier {
    const found = this.suppliers.find(s => s.id === id);
    if (!found) throw new NotFoundException('Supplier not found');
    return found;
  }

  // 🔹 Crear nuevo supplier
  create(dto: CreateSupplierDto): Supplier {
    const now = new Date().toISOString();
    const supplier: Supplier = {
      id: this.seq++,
      name: dto.name.trim(),
      email: dto.email?.trim(),
      phone: dto.phone?.trim(),
      address: dto.address?.trim(),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.suppliers.push(supplier);
    return supplier;
  }

  // 🔹 Actualizar supplier
  update(id: number, dto: UpdateSupplierDto): Supplier {
    const current = this.getById(id);
    const updated: Supplier = {
      ...current,
      ...dto,
      name: (dto.name ?? current.name).trim(),
      email: dto.email?.trim() ?? current.email,
      phone: dto.phone?.trim() ?? current.phone,
      address: dto.address?.trim() ?? current.address,
      updatedAt: new Date().toISOString(),
    };
    const idx = this.suppliers.findIndex(s => s.id === id);
    this.suppliers[idx] = updated;
    return updated;
  }

  // 🔹 Activar o desactivar supplier
  setActive(id: number, value: boolean): Supplier {
    const s = this.getById(id);
    s.isActive = value;
    s.updatedAt = new Date().toISOString();
    return s;
  }

  // 🔹 Eliminar supplier
  remove(id: number): void {
    const exists = this.suppliers.some(s => s.id === id);
    if (!exists) throw new NotFoundException('Supplier not found');
    this.suppliers = this.suppliers.filter(s => s.id !== id);
  }
}
