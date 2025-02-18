import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Note } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotesSection({ platformId }: { platformId: number }) {
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm();

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/notes", {
        ...data,
        platformId,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      form.reset();
      setIsCreating(false);
    },
  });

  const platformNotes = notes?.filter(note => note.platformId === platformId) ?? [];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? "Cancel" : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        {isCreating && (
          <form onSubmit={form.handleSubmit((data) => createNoteMutation.mutate(data))} className="space-y-4 mb-6">
            <div>
              <Input
                placeholder="Note title"
                {...form.register("title")}
              />
            </div>
            <div>
              <Textarea
                placeholder="Write your note here..."
                className="min-h-[100px]"
                {...form.register("content")}
              />
            </div>
            <div>
              <Input
                placeholder="Source URL (optional)"
                {...form.register("sourceUrl")}
              />
            </div>
            <Button type="submit" disabled={createNoteMutation.isPending}>
              {createNoteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Note
            </Button>
          </form>
        )}

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : platformNotes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No notes yet. Create one to get started!
          </p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {platformNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">{note.title}</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-2">
                      {note.content}
                    </p>
                    {note.sourceUrl && (
                      <a
                        href={note.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Source
                      </a>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
