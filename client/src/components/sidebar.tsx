import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, LogOut } from "lucide-react";
import { SiInstagram, SiFacebook, SiWhatsapp, SiTelegram, SiYoutube, SiThreads } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";

const platforms = [
  { name: "Instagram", icon: SiInstagram, href: "/platform/instagram" },
  { name: "Facebook", icon: SiFacebook, href: "/platform/facebook" },
  { name: "WhatsApp", icon: SiWhatsapp, href: "/platform/whatsapp" },
  { name: "Telegram", icon: SiTelegram, href: "/platform/telegram" },
  { name: "YouTube", icon: SiYoutube, href: "/platform/youtube" },
  { name: "Threads", icon: SiThreads, href: "/platform/threads" },
];

export function Sidebar() {
  const { logoutMutation } = useAuth();

  return (
    <div className="flex h-screen flex-col gap-4 border-r bg-sidebar">
      <div className="px-3 py-2">
        <h2 className="px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
          Social Dashboard
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/scheduler">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Scheduler
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
              Platforms
            </h2>
            <div className="space-y-1">
              {platforms.map((platform) => (
                <Link key={platform.name} href={platform.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <platform.icon className="mr-2 h-4 w-4" />
                    {platform.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
