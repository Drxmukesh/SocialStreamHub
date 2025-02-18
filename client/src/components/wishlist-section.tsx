import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Wishlist } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Plus, Star } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WishlistSection({ platformId }: { platformId: number }) {
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm();

  const { data: wishlistItems, isLoading } = useQuery<Wishlist[]>({
    queryKey: ["/api/wishlist"],
  });

  const createWishlistMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/wishlist", {
        ...data,
        platformId,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      form.reset();
      setIsCreating(false);
    },
  });

  const platformWishlist = wishlistItems?.filter(item => item.platformId === platformId) ?? [];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Wishlist</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
          >
            {isCreating ? "Cancel" : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        {isCreating && (
          <form onSubmit={form.handleSubmit((data) => createWishlistMutation.mutate(data))} className="space-y-4 mb-6">
            <div>
              <Input
                placeholder="Title"
                {...form.register("title")}
              />
            </div>
            <div>
              <Textarea
                placeholder="Description (optional)"
                className="min-h-[100px]"
                {...form.register("description")}
              />
            </div>
            <Button type="submit" disabled={createWishlistMutation.isPending}>
              {createWishlistMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to Wishlist
            </Button>
          </form>
        )}

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : platformWishlist.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Your wishlist is empty. Add items you want to remember!
          </p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {platformWishlist.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                            {item.description}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          Added: {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
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
