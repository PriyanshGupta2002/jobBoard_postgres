import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { FC } from "react";

interface AvatarImgProps {
  src?: string | null;
  name: string | undefined;
}
export const AvatarImg: FC<AvatarImgProps> = ({ src, name }) => {
  const initials = name && getInitials(name);
  return (
    <Avatar>
      {src && <AvatarImage src={src} alt="@shadcn" />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
