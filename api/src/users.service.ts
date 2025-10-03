import { Injectable } from '@nestjs/common';
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
  private readonly users: User[];

  constructor() {
    // Genera el hash en runtime para evitar errores de copiado
    const demoHash = bcrypt.hashSync('Agromat123', 10);
    this.users = [
      {
        id: 1,
        name: 'Admin Demo',
        email: 'admin@agromat.test',
        passwordHash: demoHash,
        role: 'admin',
        isActive: true,
      },
    ];
    console.log('[UsersService] demo user hash:', this.users[0].passwordHash);
  }

  async findByEmail(email: string): Promise<User | null> {
    const u = this.users.find(x => x.email === email && x.isActive) ?? null;
    console.log('[UsersService.findByEmail]', email, 'found:', !!u);
    return u;
  }

  async validatePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare((plain ?? '').trim(), hash);
  }
}
