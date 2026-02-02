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
import { useNavigate } from "@tanstack/react-router";
import { GitBranch, Globe, PresentationIcon } from "lucide-react";
import { type ReactNode } from "react";

const data: { navMain: { title: string; icon: ReactNode; url: string }[] } = {
  navMain: [
    {
      title: "Projects",
      icon: <PresentationIcon />,
      url: "#",
    },
    {
      title: "Repositories",
      icon: <GitBranch />,
      url: "#",
    },
  ],
};

const AppNavBar = () => {
  const navigate = useNavigate();

  return (
    <Sidebar className={"transition-all"} variant={"floating"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate({ to: "/" })}
              className={"gap-4 px-3"}
            >
              <div className="[&_svg]:h-6! [&_svg]:w-6!">
                <Globe />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">ProjekteJwkk</span>
                <span className="truncate text-xs">Janne Keipert</span>
              </div>
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
                  <a href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
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
