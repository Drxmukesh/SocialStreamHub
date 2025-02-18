import { Sidebar } from "@/components/sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Platform, ScheduledPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Scheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const form = useForm();
  
  const { data: platforms } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const { data: scheduledPosts } = useQuery<ScheduledPost[]>({
    queryKey: ["/api/scheduled-posts"],
  });

  const scheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/scheduled-posts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scheduled-posts"] });
      form.reset();
    },
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Content Scheduler</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Schedule New Post</h2>
              <form onSubmit={form.handleSubmit((data) => {
                scheduleMutation.mutate({
                  ...data,
                  scheduledFor: selectedDate,
                });
              })}>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  <Textarea
                    placeholder="Write your post content..."
                    {...form.register("content")}
                  />
                  <Button type="submit" disabled={scheduleMutation.isPending}>
                    Schedule Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>
              {scheduledPosts?.length === 0 ? (
                <p className="text-muted-foreground">No posts scheduled</p>
              ) : (
                <div className="space-y-4">
                  {scheduledPosts?.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <p className="mb-2">{post.content}</p>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for: {new Date(post.scheduledFor).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
