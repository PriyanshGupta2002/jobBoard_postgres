"use client";
import { Image, Newspaper, Video } from "lucide-react";
import { Separator } from "../../ui/separator";
import { CreatePostActionButton } from "./create-post-action-button";
import { lazy, Suspense, useState } from "react";
import { AvatarImg } from "@/components/shared/Avatar";
import { useSessionStore } from "@/store/authStore";

const CreatePostModal = lazy(() => import("./create-post-modal"));
const CreatePost = () => {
  const { session } = useSessionStore();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="p-2 space-y-2">
      <Suspense fallback={<h1>Loading...</h1>}>
        <CreatePostModal open={open} onOpenChange={setOpen} />
      </Suspense>

      <div className="flex items-center gap-2">
        <AvatarImg src={session?.user?.image} name={session?.user?.name} />

        <div
          onClick={() => setOpen(true)}
          className="h-10 w-full rounded-md border border-input bg-background p-2 text-muted-foreground text-sm cursor-pointer hover:bg-accent transition"
        >
          What&apos; on your mind today
        </div>
      </div>
      <Separator />

      <div className="flex items-center gap-7 px-2.5">
        <CreatePostActionButton icon={Image} label="Image" />
        <CreatePostActionButton icon={Video} label="Video" />
        <CreatePostActionButton icon={Newspaper} label="Article" />
      </div>
    </div>
  );
};

export default CreatePost;
