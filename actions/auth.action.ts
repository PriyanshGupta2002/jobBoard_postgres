"use server";
import { db } from "@/db";
import { organization, profile } from "@/db/schema";
import { auth } from "@/lib/auth";

type signUp = {
  email: string;
  password: string;
  name: string;
  role: roles;
};

type signIn = {
  email: string;
  password: string;
};
export const signUp = async (payload: signUp) => {
  const data = await auth.api.signUpEmail({
    body: {
      email: payload.email,
      name: payload.name,
      password: payload.password,
    },
  });

  const [newUser] = await db
    .insert(profile)
    .values({
      authUserId: data.user.id,
      role: payload.role,
      name: payload.name,
    })
    .returning({ id: profile.id });

  if (payload.role === "org") {
    const [newOrg] = await db
      .insert(organization)
      .values({
        profileId: newUser.id,
        companyDomain: "",
        countOfEmployee: "",
      })
      .returning({ id: organization.id });

    return newOrg;
  }

  return newUser;
};
export const signIn = async (payload: signIn) => {
  const data = await auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
    },
  });

  return data.user;
};
