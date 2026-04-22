"use server";

import { requireServerAuth } from "@/lib/auth";
import client from "@/lib/prisma";
import {
  AddNewAddressSchema,
  UpdateUserProfileSchema,
} from "@/schema/user.schema";
import {
  AddNewAddressType,
  GetAllAddressesReturnType,
  UpdateUserProfileType,
} from "@/types/user.types";

export async function GetUserProfile() {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    const total = await client.order.aggregate({
      where: {
        userId: session.id,
        status: "CONFIRMED",
      },
      _sum: {
        finalAmount: true,
      },
    });

    const user = await client.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dob: true,
        gender: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            addresses: true,
            orders: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    const formatted = {
      ...user,
      addressesCount: user?._count?.addresses || 0,
      ordersCount: user?._count?.orders || 0,
      totalSpendings: total?._sum?.finalAmount || 0,
    };

    const { _count, ...rest } = formatted;

    return {
      status: 200,
      data: rest,
    };
  } catch (error) {
    console.error("Error fetching profile: ", error);
    return {
      status: 500,
      data: null,
    };
  }
}

export async function UpdateUserProfile(body: UpdateUserProfileType) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.loggedIn) throw new Error("Unauthorized");

    const parsed = UpdateUserProfileSchema.safeParse(body);
    if (!parsed.success) throw new Error("Inavlid body");

    const { firstName, lastName, email, phone, dob, gender, image } =
      parsed.data;

    await client.user.update({
      where: {
        id: session.id,
      },
      data: {
        firstName,
        lastName,
        dob,
        gender,
        image,
        email,
        phone,
      },
    });

    return {
      status: 200,
      message: "Profile updated!!",
    };
  } catch (error) {
    console.error("Error updating profile: ", error);
    return {
      status: 500,
      message: "Error updating profile",
    };
  }
}

export async function DeleteUserAccount() {
  try {
    const session = await requireServerAuth();
    if (!session || !session.loggedIn) throw new Error("Unauthorized");

    await client.user.delete({
      where: {
        id: session.id,
      },
    });

    return {
      status: 200,
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting account: ", error);
    return {
      status: 500,
      message: "Error deleting account",
    };
  }
}

export async function GetAllAddresses(): Promise<GetAllAddressesReturnType> {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    const data = await client.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        addresses: true,
      },
    });

    const addresses =
      data?.addresses.map((a) => ({
        id: a.id,
        name: a.fullName,
        phone: a.phone,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country,
        isDefault: a.isDefault,
      })) || [];

    return {
      status: 200,
      data: addresses,
    };
  } catch (error) {
    console.error("Error fetching addresses", error);
    return {
      status: 500,
      data: [],
    };
  }
}

export async function AddNewAddress(body: AddNewAddressType) {
  try {
    const session = await requireServerAuth();
    if (!session || !session.id) throw new Error("Unauthorized");

    const res = AddNewAddressSchema.safeParse(body);
    if (!res.success) throw new Error("Invalid Body");
    const {
      line1,
      line2,
      city,
      country,
      state,
      postalCode,
      isDefault,
      fullName,
      phone,
    } = res.data;

    await client.user.update({
      where: {
        id: session.id,
      },
      data: {
        addresses: {
          create: {
            line1,
            line2,
            city,
            country,
            state,
            postalCode,
            isDefault,
            fullName,
            phone,
          },
        },
      },
    });

    return {
      status: 201,
      data: null,
    };
  } catch (error) {
    console.error("Error creating addresses", error);
    return {
      status: 500,
      data: null,
    };
  }
}
