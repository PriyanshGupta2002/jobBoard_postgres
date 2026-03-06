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

type media = "Image" | "Video" | "Article";

type imageType = { file: File; preview: string };

interface ImageUploadProps {
  setMedia: (mediaType: media | null) => void;
  setImages: React.Dispatch<React.SetStateAction<imageType[]>>;
  images: imageType[];
}

interface AlertDialogWarningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setImages: React.Dispatch<React.SetStateAction<imageType[] | []>>;
  setPreviewForImage: (image: string | null) => void;
  setMedia: (mediaType: media | null) => void;
}

interface createPostActionMediaUpload {
  type: "image" | "video";
  url: string;
}

interface createPostActionProps {
  content: string;
  media: createPostActionMediaUpload[];
}
