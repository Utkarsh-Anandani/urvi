import { Gender, Role } from "@/generated/enums";
import { AddNewAddressSchema, UpdateUserProfileSchema } from "@/schema/user.schema";
import z from "zod";

export type AddNewAddressType = z.infer<typeof AddNewAddressSchema>;
export type UpdateUserProfileType = z.infer<typeof UpdateUserProfileSchema>;

export type GetAllAddressesReturnType = {
  status: number;
  data: {
    id: string;
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
};

export type Profile = {
  addressesCount: number;
  ordersCount: number;
  totalSpendings: number;
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  dob: string | null;
  gender: Gender | null;
  image: string | null;
  role: Role;
  createdAt: Date;
};

export type GetUserProfileReturnType =
  | {
      status: number;
      data: Profile;
    }
  | {
      status: number;
      data: null;
    };
