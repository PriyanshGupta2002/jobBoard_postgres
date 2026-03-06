"use server";
import { db } from "@/db";
import { media, socialPost } from "@/db/schema";
import { getCurrentUserWithProfile } from "@/lib/currentUser";

export const createPostAction = async (payload: createPostActionProps) => {
  const content = payload?.content;
  const mediaItems = payload?.media;

  const user = await getCurrentUserWithProfile();
  if (!user?.profile?.id) {
    throw new Error("User profile not found");
  }

  try {
    const [createdPost] = await db
      .insert(socialPost)
      .values({
        profileId: user?.profile?.id,
        postDescription: content,
      })
      .returning({ id: socialPost.id });

    if (mediaItems?.length) {
      await db.insert(media).values(
        mediaItems.map((item) => ({
          mediaUrl: item.url,
          mediaType: item.type,
          socialPostId: createdPost.id,
        })),
      );
    }
  } catch (error) {
    console.error(error);
  }
};
