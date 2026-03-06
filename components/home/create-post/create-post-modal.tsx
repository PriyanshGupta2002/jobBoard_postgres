"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, Fragment, useCallback, useRef, useState } from "react";
import CreatePostInput from "./create-post-input";
import { AvatarImg } from "@/components/shared/Avatar";
import { useSessionStore } from "@/store/authStore";
import { CreatePostActionButton } from "./create-post-action-button";
import { FileImage, Newspaper, Video } from "lucide-react";
import UploadImage from "./upload-image";
import { Button } from "@/components/ui/button";
import { upload } from "@imagekit/next";
import { createPostAction } from "@/actions/socialPost.action";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostModal: FC<CreatePostModalProps> = ({ onOpenChange, open }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<imageType[]>([]);
  const [progress, setProgress] = useState(0);
  const abortController = new AbortController();

  const [media, setMedia] = useState<media | null>(null);
  const modalWidth =
    media === "Image" ? "sm:max-w-[1200px]" : "sm:max-w-[800px]";

  const mediaComponents = [
    {
      name: "Video",
      icon: (
        <CreatePostActionButton
          icon={Video}
          label="Video"
          onClick={() => setMedia("Video")}
        />
      ),
    },
    {
      name: "Image",
      icon: (
        <CreatePostActionButton
          icon={FileImage}
          label="Image"
          onClick={() => setMedia("Image")}
        />
      ),
    },
    {
      name: "Article",
      icon: (
        <CreatePostActionButton
          icon={Newspaper}
          label="Article"
          onClick={() => setMedia("Article")}
        />
      ),
    },
  ];

  const { session } = useSessionStore();

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const uploadAllImages = async () => {
    const authParams = await authenticator();

    const uploads = images.map((img) =>
      upload({
        ...authParams,
        file: img.file,
        fileName: img.file.name,
      }),
    );

    const results = await Promise.allSettled(uploads);

    const uploadedImages = results
      .filter((res) => res.status === "fulfilled")
      .map((res) => ({
        url: res.value.url,
        type: "image",
      }));

    return uploadedImages;
  };

  const createPost = async () => {
    const uploadedImages = await uploadAllImages();

    const editorContent = editorRef.current?.innerHTML ?? "";

    const payload = {
      content: editorContent,
      media: uploadedImages as createPostActionMediaUpload[],
    };

    await createPostAction(payload);
  };

  if (!open) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={modalWidth}
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          editorRef.current?.focus();
        }}
      >
        {media === null && (
          <Fragment>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-1.5">
                <AvatarImg
                  name={session?.user?.name}
                  src={session?.user?.image}
                />
                <span>
                  Hi, {session?.user?.name} what&apos; on your mind today?
                </span>
              </DialogTitle>
            </DialogHeader>
            <CreatePostInput editorRef={editorRef} images={images} />
            <div className="flex items-center gap-2">
              {mediaComponents.map((comp, idx) => (
                <div key={idx}>{comp.icon}</div>
              ))}
            </div>
            <Button size={"sm"} onClick={createPost} className="cursor-pointer">
              Post
            </Button>
          </Fragment>
        )}
        {media === "Image" && (
          <UploadImage
            setMedia={setMedia}
            images={images}
            setImages={setImages}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
