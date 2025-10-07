export interface Supplier {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    createdAt: string; // ISO
    updatedAt: string; // ISO
  }
  