"use client";
import { sidebarItems } from "@/lib/constants";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

const NavMenuGroup = () => {
  const pathName = usePathname();
  const { state, setOpen } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <SidebarGroup className="p-2 pt-4">
      <SidebarMenu>
        <SidebarMenuItem className={cn(isExpanded ? "ml-auto" : "")}>
          <SidebarMenuButton
            asChild
            tooltip={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <PanelLeftClose onClick={() => setOpen(false)} />
            ) : (
              <PanelRightClose onClick={() => setOpen(true)} />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        {sidebarItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              className={cn(
                pathName === item.url
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "bg-inherit",
              )}
              asChild
              tooltip={item.name}
            >
              <Link href={item.url}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden ">
                  {item.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMenuGroup;
