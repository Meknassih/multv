import PocketBase from "pocketbase";

export const usePocketbase = () => {
    const pb = new PocketBase(process.env.POCKETBASE_URL);
    return pb;
}