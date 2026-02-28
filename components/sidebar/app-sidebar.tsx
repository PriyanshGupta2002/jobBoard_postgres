import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavMenuGroup from "./nav-menu-group";
import { getCurrentUserWithProfile } from "@/lib/currentUser";
import { NavUser } from "./nav-user";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await getCurrentUserWithProfile();
  const userData = {
    name: user?.user.name,
    email: user?.user.email,
    avatar: user?.user?.image,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMenuGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
