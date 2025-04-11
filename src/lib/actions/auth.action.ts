"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // 1 week in milliseconds

export async function signUp(params: SignUpParams) {
  const { uid, email, name } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please log in.",
      };
    }

    await db.collection("users").doc(uid).set({
      email,
      name,
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error: any) {
    console.log("Error signing up:", error);
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already in use",
      };
    }

    return {
      success: false,
      message: "Error signing up",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK,
  });

  cookieStore.set("session", sessionCookie, {
    httpOnly: true,
    maxAge: ONE_WEEK,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not found. Please sign up.",
      };
    }

    // const idToken = await auth.createCustomToken(userRecord.uid);

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (error: any) {
    console.log("Error signing in:", error);
    if (error.code === "auth/user-not-found") {
      return {
        success: false,
        message: "User not found. Please sign up.",
      };
    }

    return {
      success: false,
      message: "Error signing in",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value || null;

  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      return null;
    }

    return {
      ...userRecord.data(),
      id: decodedClaims.uid,
    } as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
