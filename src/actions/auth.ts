"use server";

import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import client from "@/lib/prisma";
import { SignInSchema, SignUpSchema } from "@/schema/auth.schema";
import { SignInBody, SignUpBody } from "@/types/auth.types";

export async function SignUpAction(body: SignUpBody) {
  try {
    const parsed = SignUpSchema.safeParse(body);

    if (!parsed.success) return { status: 400, message: parsed.error.message };
    const { email, firstName, lastName, password } = parsed.data;

    const existingUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser)
      return {
        status: 400,
        message: "User already exists with provided email",
      };

    const { salt, hash } = await hashPassword(password);
    const newUser = await client.user.create({
      data: {
        email,
        password: hash,
        salt,
        firstName,
        lastName,
      },
      select: {
        email: true,
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    const session = await getSession();
    session.email = newUser.email;
    session.id = newUser.id;
    session.role = newUser.role;
    session.loggedIn = true;

    await session.save();

    if (newUser)
      return {
        status: 201,
        message: "User created successfully",
        data: newUser,
      };

    return { status: 400, message: "An error occured" };
  } catch (error) {
    console.error("Sign up error: ", error);
    return { status: 500, message: "Internal Server Error" };
  }
}

export async function SignInAction(body: SignInBody) {
  try {
    const parsed = SignInSchema.safeParse(body);

    if (!parsed.success) return { status: 400, message: parsed.error.message };
    const { email, password } = parsed.data;

    const existingUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser)
      return {
        status: 400,
        message: "User doesn't exists with provided email",
      };

    const isVerified = await verifyPassword(
      password,
      existingUser.password,
      existingUser.salt,
    );
    if (!isVerified) return { status: 401, message: "Incorrect Credentials" };

    const session = await getSession();
    session.email = existingUser.email;
    session.id = existingUser.id;
    session.role = existingUser.role;
    session.loggedIn = true;

    await session.save();

    return { status: 200, message: "Logged In successfully" };
  } catch (error) {
    console.error("Sign in error: ", error);
    return { status: 500, message: "Internal Server Error" };
  }
}
