import { Sidebar } from "@/components/sidebar";
import { PlatformCard } from "@/components/platform-card";
import { AnalyticsCard } from "@/components/analytics-card";
import { useQuery } from "@tanstack/react-query";
import { Platform } from "@shared/schema";

export default function Dashboard() {
  const { data: platforms } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"]
  });

  const mockAnalyticsData = [
    { date: "Mon", value: 400 },
    { date: "Tue", value: 300 },
    { date: "Wed", value: 500 },
    { date: "Thu", value: 280 },
    { date: "Fri", value: 590 },
    { date: "Sat", value: 350 },
    { date: "Sun", value: 400 },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms?.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-12 mb-6">Analytics Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnalyticsCard 
            title="Total Engagement"
            data={mockAnalyticsData}
            color="#2563eb"
          />
          <AnalyticsCard 
            title="Reach"
            data={mockAnalyticsData}
            color="#16a34a"
          />
          <AnalyticsCard 
            title="Impressions"
            data={mockAnalyticsData}
            color="#9333ea"
          />
        </div>
      </main>
    </div>
  );
}
