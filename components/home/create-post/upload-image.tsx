"use client";

import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLeft, ArrowRight, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AlertDialogWarning from "./alert-dialog-warning";

const UploadImage: FC<ImageUploadProps> = ({ images, setImages, setMedia }) => {
  const [previewForImage, setPreviewForImage] = useState<string | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updated = [...images, ...newImages];

    setImages(updated);

    if (!previewForImage && updated.length > 0) {
      setPreviewForImage(updated[0].preview);
    }

    e.target.value = "";
  };
  useEffect(() => {
    if (images.length === 0 && inputRef.current) {
      inputRef?.current.click();
    }
  }, [images.length]);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const handleDelete = useCallback(() => {
    const filteredImages = images.filter(
      (img) => img.preview !== previewForImage,
    );
    setImages(filteredImages);
    setPreviewForImage(null);
  }, [images, previewForImage, setImages]);

  const handleGoBack = () => {
    if (images.length === 0) {
      setMedia(null);
    } else {
      setShowAlertDialog(true);
    }
  };

  return (
    <>
      <AlertDialogWarning
        onOpenChange={setShowAlertDialog}
        open={showAlertDialog}
        setImages={setImages}
        setPreviewForImage={setPreviewForImage}
        setMedia={setMedia}
      />
      <DialogHeader>
        <DialogTitle className="flex items-center gap-1.5">
          <span>Upload Images</span>
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
        {/* LEFT SIDE */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleSelectImages}
        />
        <div className="md:w-2/3 h-full aspect-7/4 relative w-full flex flex-col items-center justify-center border border-zinc-700 rounded-xl  bg-zinc-900/40">
          {previewForImage && images.length > 0 ? (
            <Image
              alt="Image"
              src={previewForImage}
              className="object-contain"
              fill
            />
          ) : (
            <Fragment>
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 bg-sidebar-primary text-white px-4 py-2 rounded-lg"
              >
                <Plus size={18} />
                Upload Images
              </button>
            </Fragment>
          )}
        </div>

        {/* RIGHT SIDE PREVIEW */}
        <div className="md:w-1/3 w-full flex  md:flex-row md:flex-wrap gap-3 max-h-80 overflow-y-auto">
          {images.map((img, index) => {
            return (
              <div
                key={index}
                onClick={() => setPreviewForImage(img.preview)}
                className={cn(
                  "w-32 bg-black/60 relative rounded-md overflow-hidden h-37.5 border-[1.5px] border-solid",
                  img.preview === previewForImage
                    ? "border-sidebar-primary"
                    : "border-transparent",
                )}
              >
                <Image
                  src={img.preview}
                  key={index}
                  className={"rounded-lg object-contain"}
                  fill
                  alt="Image"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ADD BUTTON */}

      <DialogFooter className="w-full">
        {images.length > 0 && (
          <Button className="mr-auto" onClick={handleDelete}>
            <Trash className="w-5 h-5" />
          </Button>
        )}

        {images.length > 0 && (
          <div className="mt-4 flex justify-center items-center gap-3">
            <Button
              onClick={() => inputRef.current?.click()}
              className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-full border border-zinc-600 hover:border-sidebar-primary"
            >
              <Plus size={18} />
            </Button>
            <Button onClick={handleGoBack} className="cursor-pointer">
              <ArrowLeft size={18} />
              <span>Back</span>
            </Button>
            <Button className="cursor-pointer" onClick={() => setMedia(null)}>
              <span>Next</span>
              <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </DialogFooter>
    </>
  );
};

export default UploadImage;
