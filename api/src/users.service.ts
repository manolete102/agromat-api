import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'operador' | 'visor';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private seq = 1;

  constructor() {
    const demoHash = bcrypt.hashSync('Agromat123', 10);
    this.users.push({
      id: this.seq++,
      name: 'Admin Demo',
      email: 'admin@agromat.test',
      passwordHash: demoHash,
      role: 'admin',
      isActive: true,
    });
  }

  // ---------- queries ----------
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email.toLowerCase() === (email ?? '').toLowerCase()) ?? null;
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare((plain ?? '').trim(), hash);
  }

  // ---------- CRUD (en memoria) ----------
  async list(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.users.map(({ passwordHash, ...rest }) => rest);
  }

  async create(input: { name: string; email: string; password: string; role: UserRole }): Promise<Omit<User, 'passwordHash'>> {
    if (await this.findByEmail(input.email)) {
      throw new ConflictException('Email ya registrado');
    }
    const entity: User = {
      id: this.seq++,
      name: input.name,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 10),
      role: input.role,
      isActive: true,
    };
    this.users.push(entity);
    const { passwordHash, ...rest } = entity;
    return rest;
  }

  async setActive(id: number, isActive: boolean): Promise<void> {
    const u = this.users.find(x => x.id === id);
    if (!u) throw new NotFoundException('Usuario no encontrado');
    u.isActive = isActive;
  }

  async updateRole(id: number, role: UserRole): Promise<void> {
    const u = this.users.find(x => x.id === id);
    if (!u) throw new NotFoundException('Usuario no encontrado');
    u.role = role;
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const u = this.users.find(x => x.id === id);
    if (!u) throw new NotFoundException('Usuario no encontrado');
    u.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  async remove(id: number): Promise<void> {
    const idx = this.users.findIndex(x => x.id === id);
    if (idx === -1) throw new NotFoundException('Usuario no encontrado');
    this.users.splice(idx, 1);
  }
}
