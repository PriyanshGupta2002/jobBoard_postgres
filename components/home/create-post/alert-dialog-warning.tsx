import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FC } from "react";

const AlertDialogWarning: FC<AlertDialogWarningProps> = ({
  onOpenChange,
  open,
  setImages,
  setPreviewForImage,
  setMedia,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="top">
        <AlertDialogHeader>
          <AlertDialogTitle>Discard Changes?</AlertDialogTitle>

          <AlertDialogDescription>
            If you go back now, the images you selected will be lost. Are you
            sure you want to discard your changes?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              setImages([]);
              setPreviewForImage(null);
              setMedia(null);
            }}
          >
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogWarning;
