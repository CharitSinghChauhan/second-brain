import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AuthProvider from "@/provider/auth-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // TODO : why in layout sidebar
    <SidebarProvider>
      <AppSidebar />
      <Toaster position="top-center"/>
      <main className="w-screen h-screen">
        <SidebarTrigger />
        <AuthProvider />
        {children}
      </main>
    </SidebarProvider>
  );
}
