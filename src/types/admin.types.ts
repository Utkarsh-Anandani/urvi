import { OrderStatus, PaymentStatus, Role } from "@/generated/enums";

export type GetAdminDashboardStatsReturnType = {
  status: number;
  data: {
    stats: {
      totalEarnings: number;
      totalOrders: number;
      totalProducts: number;
      totalCustomers: number;
    };
    topProducts: {
      id: string;
      name: string;
      slug: string;
      category: string;
      price: number;
      discountPrice: number | null;
      stock: number;
      rating: number;
    }[];
    recentOrders: {
      id: string;
      customerName: string;
      finalAmount: number;
      status: OrderStatus;
      createdAt: Date;
    }[];
  };
};

export type AdminOrder = {
  id: string;
  customerName: string;
  createdAt: Date;
  itemsCount: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

export type GetAdminOrdersReturnType = {
  status: number;
  data: AdminOrder[];
};

export type GetAdminCustomersReturnType = {
  status: number;
  data: {
    id: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpendings: number;
    joinedAt: Date;
    role: Role;
  }[];
};
