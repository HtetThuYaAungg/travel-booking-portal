"use server"
import { cookies } from "next/headers";
import Cookies from "js-cookie";

export const getCookie = async (key: string): Promise<string | null> => {
  if (typeof window === "undefined") {
    const storeCookie = await cookies();
    return storeCookie.get(key)?.value || null;
  } else {
    return Cookies.get(key) || null;
  }
};

export const setCookie = async (key: string, value: string): Promise<void> => {
  if (typeof window === "undefined") {
    const storeCookie = await cookies();
    storeCookie.set(key, value);
  } else {
    Cookies.set(key, value);
  }
};

export const removeCookie = async (key: string): Promise<void> => {
  if (typeof window === "undefined") {
    const storeCookie = await cookies();
    storeCookie.delete(key);
  } else {
    Cookies.remove(key);
  }
};