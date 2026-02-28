type roles = "org" | "person";
type AuthSession = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
  };
  profile: {
    id: number;
    authUserId: string;
    name: string | null;
    headline: string | null;
    bio: string | null;
    role: roles | null;
    profilePhoto: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  } | null;
} | null;
