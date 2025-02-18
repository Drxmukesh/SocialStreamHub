import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { SiInstagram, SiFacebook, SiWhatsapp, SiTelegram, SiYoutube, SiThreads, SiLinkedin, SiTiktok, SiPinterest, SiX } from "react-icons/si";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

const platforms = [
  { name: "Instagram", icon: SiInstagram, href: "/platform/instagram" },
  { name: "Facebook", icon: SiFacebook, href: "/platform/facebook" },
  { name: "WhatsApp", icon: SiWhatsapp, href: "/platform/whatsapp" },
  { name: "Telegram", icon: SiTelegram, href: "/platform/telegram" },
  { name: "YouTube", icon: SiYoutube, href: "/platform/youtube" },
  { name: "Threads", icon: SiThreads, href: "/platform/threads" },
  { name: "LinkedIn", icon: SiLinkedin, href: "/platform/linkedin" },
  { name: "TikTok", icon: SiTiktok, href: "/platform/tiktok" },
  { name: "Pinterest", icon: SiPinterest, href: "/platform/pinterest" },
  { name: "X/Twitter", icon: SiX, href: "/platform/twitter" },
];

export function Sidebar() {
  const { logoutMutation } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex h-screen flex-col gap-4 border-r bg-sidebar transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="flex items-center justify-between px-3 py-2">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Social Dashboard
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link href="/">
                <Button variant="ghost" className={cn("w-full", isCollapsed ? "justify-center" : "justify-start")}>
                  <LayoutDashboard className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">Dashboard</span>}
                </Button>
              </Link>
              <Link href="/scheduler">
                <Button variant="ghost" className={cn("w-full", isCollapsed ? "justify-center" : "justify-start")}>
                  <Calendar className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">Scheduler</span>}
                </Button>
              </Link>
            </div>
          </div>
          <div className="px-3 py-2">
            {!isCollapsed && (
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-sidebar-foreground">
                Platforms
              </h2>
            )}
            <div className="space-y-1">
              {platforms.map((platform) => (
                <Link key={platform.name} href={platform.href}>
                  <Button variant="ghost" className={cn("w-full", isCollapsed ? "justify-center" : "justify-start")}>
                    <platform.icon className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">{platform.name}</span>}
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
          className={cn("w-full", isCollapsed ? "justify-center" : "justify-start")}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}