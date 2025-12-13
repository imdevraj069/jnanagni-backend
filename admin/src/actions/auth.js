'use server'

import { cookies } from "next/headers";
import { loginApi, getCurrentUser } from "@/lib/api"; // Updated imports

export async function loginAction(email, password) {
  try {
    // 1. Call the backend
    const response = await loginApi({ email, password });
    
    // Structure: response.data.user, response.data.token
    const { user, token } = response.data;

    // 2. Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  return { success: true };
}

export async function getSessionAction() {
  const user = await getCurrentUser();
  return user;
}