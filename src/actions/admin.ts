"use server";
import { OrderStatus, PaymentStatus } from "@/generated/enums";
import { requireRole } from "@/lib/auth";
import client from "@/lib/prisma";

export async function GetAdminDashboardStats() {
  try {
    await requireRole("ADMIN");

    const [
      earnings,
      totalOrders,
      totalProducts,
      totalCustomers,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      client.order.aggregate({
        _sum: {
          finalAmount: true,
        },
        where: {
          paymentStatus: "SUCCESS",
        },
      }),

      client.order.count(),

      client.product.count(),

      client.user.count(),

      client.product.findMany({
        where: {
            isActive: true
        },
        orderBy: {
          avgRating: "desc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          discountPrice: true,
          stock: true,
          avgRating: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      }),

      client.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          finalAmount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);

    return {
      status: 200,
      data: {
        stats: {
          totalEarnings: earnings._sum.finalAmount || 0,
          totalOrders,
          totalProducts,
          totalCustomers,
        },

        topProducts: topProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category?.name || "Uncategorized",
          price: p.price,
          discountPrice: p.discountPrice,
          stock: p.stock,
          rating: p.avgRating,
        })),

        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          customerName:
            `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.trim(),
          finalAmount: o.finalAmount,
          status: o.status,
          createdAt: o.createdAt,
        })),
      },
    };
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return {
      status: 500,
      message: "Error fetching dashboard stats",
    };
  }
}

type OrderFilter = OrderStatus | "ALL";

export async function GetAdminOrders(filter: OrderFilter = "ALL") {
  try {
    await requireRole("ADMIN");

    const orders = await client.order.findMany({
      where: filter === "ALL" ? {} : { status: filter },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        finalAmount: true,
        status: true,
        paymentStatus: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return {
      status: 200,
      data: orders.map((order) => ({
        id: order.id,
        customerName: `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "Guest",
        createdAt: order.createdAt,
        itemsCount: order._count.items,
        finalAmount: order.finalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
      })),
    };
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return {
      status: 500,
      message: "Error fetching orders",
    };
  }
}

export async function UpdateOrderStatus({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}) {
  try {
    await requireRole("ADMIN");

    await client.order.update({
      where: { id: orderId },
      data: {
        status,
        paymentStatus,
      },
    });

    return {
      status: 200,
      message: "Order updated successfully!"
    };
  } catch (error) {
    console.error("Update order error:", error);
    return {
      status: 500,
      message: "Failed to update order",
    };
  }
}

export async function GetAdminCustomers() {
  try {
    await requireRole("ADMIN");

    const users = await client.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            orders: {
              where: {
                status: "CONFIRMED",
              }
            },
          },
        },
      },
    });

    // 2️⃣ Fetch total spendings grouped by user
    const spendings = await client.order.groupBy({
      by: ["userId"],
      _sum: {
        finalAmount: true,
      },
      where: {
        paymentStatus: "SUCCESS",
      },
    });

    // 3️⃣ Map spendings for quick lookup
    const spendingMap = new Map(
      spendings.map((s) => [s.userId, s._sum.finalAmount || 0])
    );

    // 4️⃣ Final shape
    const data = users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName || ""}`.trim(),
      email: u.email,
      totalOrders: u._count.orders,
      totalSpendings: spendingMap.get(u.id) || 0,
      joinedAt: u.createdAt,
      role: u.role,
    }));

    return {
      status: 200,
      data,
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      status: 500,
      message: "Error fetching customers",
    };
  }
}