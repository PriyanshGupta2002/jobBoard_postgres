// import { FC, Ref, useState } from "react";
// import Image from "next/image";

// type imageType = { file: File; preview: string };

// interface CreatePostInputProps {
//   editorRef: Ref<HTMLDivElement>;
//   images: imageType[];
// }

// const CreatePostInput: FC<CreatePostInputProps> = ({ editorRef, images }) => {
//       const [showEmoji, setShowEmoji] = useState<boolean>(false);

//   const insertEmoji = (emoji: string) => {
//     if (!editorRef) {
//         return
//     }
//     const editor = editorRef?.current;
//     if (!editor) return;

//     editor.focus();

//     const selection = window.getSelection();
//     const range = selection?.getRangeAt(0);

//     const node = document.createTextNode(emoji);
//     range?.insertNode(node);

//     range?.setStartAfter(node);
//     range?.collapse(true);

//     selection?.removeAllRanges();
//     range && selection?.addRange(range);
//   };

//   return (
//     <div className="flex flex-col gap-3">
//       <div
//         ref={editorRef}
//         contentEditable
//         suppressContentEditableWarning
//         className="min-h-40 max-h-75 overflow-y-auto overflow-x-hidden outline-none text-white break-all whitespace-pre-wrap w-full"
//         data-placeholder="What do you want to talk about?"
//       />

//       {images.length > 0 && (
//         <div className="flex gap-2 overflow-x-auto pb-2">
//           {images.map((img, index) => (
//             <div
//               key={index}
//               className="relative w-28 h-28 rounded-md overflow-hidden shrink-0 bg-zinc-600/70"
//             >
//               <Image
//                 src={img.preview}
//                 alt="post-image"
//                 fill
//                 className="object-contain"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreatePostInput;

"use client";

import { FC, RefObject, useRef, useState } from "react";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreatePostInputProps {
  editorRef: RefObject<HTMLDivElement | null>;
  images: imageType[];
}

const CreatePostInput: FC<CreatePostInputProps> = ({ editorRef, images }) => {
  const [showEmoji, setShowEmoji] = useState(false);

  const insertEmoji = (emoji: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();

    if (savedSelection.current) {
      selection?.removeAllRanges();
      selection?.addRange(savedSelection.current);
    }

    const range = selection?.getRangeAt(0);

    const node = document.createTextNode(emoji);
    range?.insertNode(node);

    range?.setStartAfter(node);
    range?.collapse(true);

    savedSelection.current = range ?? null;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");

    document.execCommand("insertText", false, text);
  };

  const savedSelection = useRef<Range | null>(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0);
    }
  };
  return (
    <div className="flex flex-col gap-3 relative">
      {/* TEXT EDITOR */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        className="min-h-40 max-h-75 overflow-y-auto overflow-x-hidden outline-none text-white break-words whitespace-pre-wrap w-full"
        data-placeholder="What do you want to talk about?"
      />

      {/* IMAGES */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-28 h-28 rounded-md bg-zinc-900/50 overflow-hidden"
            >
              <Image
                src={img.preview}
                alt="preview"
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {/* TOOLBAR */}
      <div className="flex items-center gap-3 relative">
        <Button
          onClick={() => setShowEmoji((prev) => !prev)}
          className="p-2 rounded-md hover:bg-zinc-800"
        >
          <Smile size={18} />
        </Button>

        {showEmoji && (
          <div className="absolute -top-90 -left-30 z-50">
            <EmojiPicker
              onEmojiClick={(emoji) => {
                insertEmoji(emoji.emoji);
                setShowEmoji(false);
              }}
              width={300}
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostInput;
