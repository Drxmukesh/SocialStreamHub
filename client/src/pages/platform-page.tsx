import { useParams } from "wouter";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Platform } from "@shared/schema";
import { SiInstagram, SiFacebook, SiWhatsapp, SiTelegram, SiYoutube, SiThreads, SiLinkedin, SiTiktok, SiPinterest, SiX } from "react-icons/si";
import { NotesSection } from "@/components/notes-section";
import { WishlistSection } from "@/components/wishlist-section";

const platformConfig = {
  instagram: { icon: SiInstagram, name: "Instagram", color: "text-pink-500" },
  facebook: { icon: SiFacebook, name: "Facebook", color: "text-blue-600" },
  whatsapp: { icon: SiWhatsapp, name: "WhatsApp", color: "text-green-500" },
  telegram: { icon: SiTelegram, name: "Telegram", color: "text-sky-500" },
  youtube: { icon: SiYoutube, name: "YouTube", color: "text-red-600" },
  threads: { icon: SiThreads, name: "Threads", color: "text-black" },
  linkedin: { icon: SiLinkedin, name: "LinkedIn", color: "text-blue-700" },
  tiktok: { icon: SiTiktok, name: "TikTok", color: "text-black" },
  pinterest: { icon: SiPinterest, name: "Pinterest", color: "text-red-700" },
  twitter: { icon: SiX, name: "X/Twitter", color: "text-black" },
};

export default function PlatformPage() {
  const { type } = useParams();
  const { data: platform } = useQuery<Platform>({
    queryKey: [`/api/platforms/${type}`],
  });

  const config = platformConfig[type as keyof typeof platformConfig];
  const Icon = config?.icon;

  if (!config || !platform) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <Icon className={`h-8 w-8 ${config.color}`} />
          <h1 className="text-3xl font-bold">{config.name}</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
                  <p className="text-muted-foreground">
                    {platform?.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
                <Button variant={platform?.connected ? "destructive" : "default"}>
                  {platform?.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <NotesSection platformId={platform.id} />
            <WishlistSection platformId={platform.id} />
          </div>
        </div>
      </main>
    </div>
  );
}