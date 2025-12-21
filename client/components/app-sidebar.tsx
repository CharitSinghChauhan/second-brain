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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/store";
import {
  CaretUpDownIcon,
  FilesIcon,
  LinkBreakIcon,
  VideoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import { TagIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { api } from "@/axios/axios";

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

  const { isAuthenticated, user, logout } = useAuthStore();
  const { isMobile } = useSidebar();
  const router = useRouter();

  console.log("user", user);

  const signOut = async () => {
    await api.get("/auth/signout");
    logout();
    router.push("/sign-in")
  };

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="flex justify-center items-center"></SidebarHeader>
      <SidebarContent className="px-8">
        <SidebarGroup />
        <SidebarGroupContent>
          <SidebarMenu>
            {item.map(({ title, icon }, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton>
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
      <SidebarFooter>
        {!isAuthenticated ? (
          <div>
            <Button onClick={() => router.push("/sign-in")}>SignIn</Button>
            <Button onClick={() => router.push("/sign-up")}>SignUp</Button>
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex gap-2 justify-center items-center">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.username}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <CaretUpDownIcon size={32} className="ml-auto size-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="rounded-lg">
                            CN
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {user?.username}
                          </span>
                          <span className="truncate text-xs">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Upgrade to Pro</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
