import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, uploadFile } from "@/lib/queryClient";
import { Pencil, Trash2, XCircle } from "lucide-react";

interface AwarenessVideo {
  id: number;
  title: string;
  description?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}

function normalizeEmbedUrl(url: string) {
  if (!url) return url;

  const safeUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  if (safeUrl.includes("youtube.com/watch?v=")) {
    const videoId = new URL(safeUrl).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  if (safeUrl.includes("youtu.be/")) {
    const videoId = safeUrl.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  return url;
}

export default function AwarenessVideosPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState<"youtube" | "upload">("youtube");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState("0");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadController, setUploadController] = useState<AbortController | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const { data: response, isLoading, error } = useQuery<ApiResponse<AwarenessVideo[]>>({
    queryKey: ["/api/v1/info/awareness-videos"],
  });

  const videos = useMemo(() => response?.data || [], [response]);

  const createVideoMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (sourceType === "upload") {
        if (!videoFile) {
          throw new Error("Please select a video file to upload");
        }

        setUploadProgress(0);
        const controller = new AbortController();
        setUploadController(controller);

        return uploadFile(
          "/api/v1/admin/awareness-videos",
          videoFile,
          {
            title: title.trim(),
            description: description.trim(),
            sourceType,
            sortOrder,
          },
          (progress) => setUploadProgress(progress),
          controller.signal
        );
      }

      if (!videoUrl.trim()) {
        throw new Error("YouTube URL is required");
      }

      return apiRequest("POST", "/api/v1/admin/awareness-videos", {
        title: title.trim(),
        description: description.trim(),
        sourceType,
        videoUrl: videoUrl.trim(),
        sortOrder,
      });
    },
    onSuccess: async () => {
      setTitle("");
      setDescription("");
      setSourceType("youtube");
      setVideoUrl("");
      setVideoFile(null);
      setSortOrder("0");
      setUploadProgress(0);
      setUploadController(null);
      await queryClient.invalidateQueries({ queryKey: ["/api/v1/info/awareness-videos"] });
      toast({
        title: "Video added",
        description: "The awareness video has been published successfully.",
      });
    },
    onError: (mutationError: unknown) => {
      setUploadController(null);

      if (mutationError instanceof Error && mutationError.name === "AbortError") {
        setUploadProgress(0);
        toast({
          title: "Upload canceled",
          description: "You can start a new upload when ready.",
        });
        return;
      }

      setUploadProgress(0);
      const message = mutationError instanceof Error ? mutationError.message : "Unable to add awareness video";
      toast({
        title: "Failed to add video",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleCreateVideo = () => {
    createVideoMutation.mutate();
  };

  const updateTitleMutation = useMutation({
    mutationFn: async ({ videoId, title }: { videoId: number; title: string }) => {
      return apiRequest("PATCH", `/api/v1/admin/awareness-videos/${videoId}/title`, { title });
    },
    onSuccess: async () => {
      setEditingVideoId(null);
      setEditingTitle("");
      await queryClient.invalidateQueries({ queryKey: ["/api/v1/info/awareness-videos"] });
      toast({ title: "Title updated", description: "Video title updated successfully." });
    },
    onError: (mutationError: unknown) => {
      const message = mutationError instanceof Error ? mutationError.message : "Unable to update title";
      toast({ title: "Failed to update title", description: message, variant: "destructive" });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: number) => {
      return apiRequest("DELETE", `/api/v1/admin/awareness-videos/${videoId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/v1/info/awareness-videos"] });
      toast({ title: "Video deleted", description: "Video removed successfully." });
    },
    onError: (mutationError: unknown) => {
      const message = mutationError instanceof Error ? mutationError.message : "Unable to delete video";
      toast({ title: "Failed to delete video", description: message, variant: "destructive" });
    },
  });

  const startEditingTitle = (video: AwarenessVideo) => {
    setEditingVideoId(video.id);
    setEditingTitle(video.title);
  };

  const saveEditingTitle = () => {
    if (!editingVideoId) return;
    if (!editingTitle.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    updateTitleMutation.mutate({ videoId: editingVideoId, title: editingTitle.trim() });
  };

  const cancelUpload = () => {
    uploadController?.abort();
    setUploadController(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Awareness Videos</h1>
        <p className="text-muted-foreground">
          Short videos that explain services, support channels, and important student union topics.
        </p>
      </div>

      {isAdmin && (
        <section className="mb-8 rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add Awareness Video</h2>
          <div className="grid gap-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              data-testid="input-awareness-title"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="min-h-24"
              data-testid="textarea-awareness-description"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={sourceType === "youtube" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceType("youtube")}
              >
                YouTube Link
              </Button>
              <Button
                type="button"
                variant={sourceType === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceType("upload")}
              >
                Upload Video
              </Button>
            </div>

            {sourceType === "youtube" ? (
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube URL"
                data-testid="input-awareness-youtube-url"
              />
            ) : (
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                data-testid="input-awareness-video-file"
              />
            )}

            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="Sort order"
              data-testid="input-awareness-sort-order"
            />

            <Button
              type="button"
              onClick={handleCreateVideo}
              disabled={createVideoMutation.isPending}
              className="w-fit"
              data-testid="button-add-awareness-video"
            >
              {createVideoMutation.isPending ? "Adding..." : "Add Awareness Video"}
            </Button>

            {sourceType === "upload" && createVideoMutation.isPending && (
              <Button
                type="button"
                variant="destructive"
                onClick={cancelUpload}
                className="w-fit"
                data-testid="button-cancel-awareness-upload"
              >
                <XCircle className="h-4 w-4" />
                Cancel Upload
              </Button>
            )}

            {sourceType === "upload" && createVideoMutation.isPending && (
              <div className="space-y-2 pt-1">
                <Progress value={uploadProgress} className="h-2 w-full" />
                <p className="text-xs text-muted-foreground">
                  Uploading and saving the video... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading videos...</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          Failed to load awareness videos{error instanceof Error ? `: ${error.message}` : "."}
        </p>
      ) : videos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No awareness videos are available yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => {
            const isYouTube = video.video_url.includes("youtube.com") || video.video_url.includes("youtu.be");
            const embedUrl = isYouTube ? normalizeEmbedUrl(video.video_url) : video.video_url;
            return (
              <article key={video.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="aspect-video w-full bg-muted">
                  {isYouTube ? (
                    <iframe
                      title={video.title}
                      src={embedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={embedUrl}
                      controls
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  {isAdmin && editingVideoId === video.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        data-testid={`input-edit-awareness-title-${video.id}`}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={saveEditingTitle}
                          disabled={updateTitleMutation.isPending}
                          data-testid={`button-save-awareness-title-${video.id}`}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingVideoId(null);
                            setEditingTitle("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold leading-snug">{video.title}</h2>
                      {isAdmin && (
                        <div className="flex shrink-0 gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingTitle(video)}
                            data-testid={`button-edit-awareness-title-${video.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit title
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteVideoMutation.mutate(video.id)}
                            disabled={deleteVideoMutation.isPending}
                            data-testid={`button-delete-awareness-video-${video.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {video.description ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{video.description}</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
