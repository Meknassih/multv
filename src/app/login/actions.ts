"use server";

import { pb } from "@/lib/pocketbase";

export const login = async (email: string, password: string) => {
    const authData = await pb.collection("users").authWithPassword(email, password);
    return authData;
};