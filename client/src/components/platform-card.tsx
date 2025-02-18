import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Platform } from "@shared/schema";
import { Link } from "wouter";
import { SiInstagram, SiFacebook, SiWhatsapp, SiTelegram, SiYoutube, SiThreads } from "react-icons/si";
import { cn } from "@/lib/utils";

const platformConfig = {
  instagram: { icon: SiInstagram, color: "bg-pink-500" },
  facebook: { icon: SiFacebook, color: "bg-blue-600" },
  whatsapp: { icon: SiWhatsapp, color: "bg-green-500" },
  telegram: { icon: SiTelegram, color: "bg-sky-500" },
  youtube: { icon: SiYoutube, color: "bg-red-600" },
  threads: { icon: SiThreads, color: "bg-black" },
};

export function PlatformCard({ platform }: { platform: Platform }) {
  const config = platformConfig[platform.type as keyof typeof platformConfig];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <Icon className={cn("h-6 w-6", config.color)} />
        </CardTitle>
        <Badge variant={platform.connected ? "default" : "secondary"}>
          {platform.connected ? "Connected" : "Not Connected"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <Link href={`/platform/${platform.type}`}>
            <Button className="w-full">Manage</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
