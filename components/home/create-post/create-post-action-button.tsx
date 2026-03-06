import { LucideIcon } from "lucide-react";

export const CreatePostActionButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="group flex items-center gap-1 text-sm bg-zinc-400/10 p-2 rounded-lg cursor-pointer border-[1.5px] border-transparent transition-all duration-200 hover:border-sidebar-primary hover:bg-sidebar-primary/10"
  >
    <Icon className="w-4 h-4 transition-colors duration-200 group-hover:text-sidebar-primary" />
    <span className="transition-colors duration-200 group-hover:text-sidebar-primary">
      {label}
    </span>
  </div>
);
