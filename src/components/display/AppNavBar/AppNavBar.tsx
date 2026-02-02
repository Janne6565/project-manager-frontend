import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Link } from "@tanstack/react-router";
import { GitBranch, PresentationIcon } from "lucide-react";
import { type ReactNode } from "react";
import Logo from "@/components/display/FloatingHeader/Logo/Logo.tsx";

const data: { navMain: { title: string; icon: ReactNode; url: string }[] } = {
  navMain: [
    {
      title: "Projects",
      icon: <PresentationIcon />,
      url: "/",
    },
    {
      title: "Repositories",
      icon: <GitBranch />,
      url: "/repositories",
    },
  ],
};

const AppNavBar = () => {
  return (
    <Sidebar className={"transition-all"} variant={"floating"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppNavBar;
