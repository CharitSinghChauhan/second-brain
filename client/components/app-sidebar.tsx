"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FilesIcon, LinkBreakIcon, VideoIcon, XLogoIcon } from "@phosphor-icons/react";
import { TagIcon } from "@phosphor-icons/react/dist/ssr";

export function AppSidebar() {
  const item = [
    {
      title: "Tweets/X",
      icon: <XLogoIcon size={32} />,
    },
    {
      title: "Videos",
      icon: <VideoIcon size={32} />,
    },
    {
      title: "Documents",
      icon: <FilesIcon size={32} />,
    },
    {
      title: "Links",
      icon: <LinkBreakIcon size={32} />,
    },
    {
      title: "Tags",
      icon: <TagIcon size={32} />,
    },
  ];

  return (
    <Sidebar variant="inset" >
      <SidebarHeader className="flex justify-center items-center">
        <h1>Second Brain</h1>
      </SidebarHeader>
      <SidebarContent className="px-8">
        <SidebarGroup />
        <SidebarGroupContent>
          <SidebarMenu>
            {item.map(({ title, icon }, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton >
                  <a
                    href={"#"}
                    className="flex justify-start items-center gap-4 w-full"
                  >
                    <span>{icon}</span>
                    <span>{title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
}
