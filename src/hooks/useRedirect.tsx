import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export const useRedirect = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // TODO: Figure out why the callback url part is not working
      redirect("/?callbackUrl=/products");
    },
  });
  return;
};
