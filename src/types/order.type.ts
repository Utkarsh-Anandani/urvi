import { OrderStatus, PaymentStatus } from "@prisma/client";

export type GetUsersOrdersReturnType = {
  status: number;
  data: {
    id: string;
    createdAt: Date;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    finalAmount: number;
    items: {
      product: {
        name: string;
      };
      variant: {
        name: string;
      } | null;
    }[];
  }[];
  message?: string;
};
