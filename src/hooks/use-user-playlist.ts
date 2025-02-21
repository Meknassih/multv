import { useSession } from "next-auth/react";
import { getUserPlaylist } from "../app/settings/actions";

export const useUserPlaylist = () => {
    const { data: session } = useSession();
    const playlist = getUserPlaylist(session?.user.id);
    return playlist;
}