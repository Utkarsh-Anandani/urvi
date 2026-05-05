import { CouponScope, DiscountType } from "@prisma/client";
import z from "zod";

export const CreateCouponSchema = z.object({
    code: z.string(),
    discountType: z.enum(DiscountType),
    discountValue: z.number().min(1),
    minOrderAmount: z.number().optional(),
    maxDiscount: z.number().optional(),
    usageLimit: z.number().optional(),
    maxUsagePerUser: z.number().optional(),
    isActive: z.boolean(),
    scope: z.enum(CouponScope),
    categoryIds: z.array(z.uuid()),
    productIds: z.array(z.uuid())
})