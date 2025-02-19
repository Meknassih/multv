export type User = {
  avatar: string;
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  verified: boolean;
};

export const getLocalUser = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const user = window.localStorage.getItem("user");
  if (!user) {
    throw new Error("User not found");
  }
  return JSON.parse(user) as User;
};
