"use server";

import { pb } from "@/lib/pocketbase";

export async function getUser(id: string) {
    const user = await pb.collection("users").getOne(id);
    return user;
}