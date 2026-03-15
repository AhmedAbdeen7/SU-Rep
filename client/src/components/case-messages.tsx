import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { CaseMessage } from "@/types/schema";

interface CaseMessagesProps {
  caseId: string;
  title?: string;
}

function parseApiDate(value: Date | string): Date {
  if (value instanceof Date) return value;

  // Handle MySQL format: "YYYY-MM-DD HH:mm:ss" as UTC, then let browser convert to local timezone
  if (typeof value === "string" && value.includes(" ") && !value.includes("T")) {
    return new Date(`${value.replace(" ", "T")}Z`);
  }

  return new Date(value);
}

export function CaseMessages({ caseId, title = "Messages" }: CaseMessagesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");

  const currentUserEmail = (user?.email || "").toLowerCase();

  const {
    data: messages,
    isLoading,
    isError,
    error,
  } = useQuery<CaseMessage[]>({
    queryKey: ["/api/v1/cases", caseId, "messages"],
    enabled: !!caseId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("POST", `/api/v1/cases/${caseId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases", caseId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases", caseId, "updates"] });
      setMessageText("");
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const orderedMessages = useMemo(
    () => (messages ? [...messages].sort((a, b) => +parseApiDate(a.createdAt) - +parseApiDate(b.createdAt)) : []),
    [messages]
  );

  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed) {
      toast({
        title: "Message is empty",
        description: "Please type a message before sending.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate(trimmed);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 overflow-y-auto rounded-md border p-3 bg-muted/20">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">
              Failed to load messages{error instanceof Error ? `: ${error.message}` : "."}
            </p>
          ) : orderedMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
          ) : (
            <div className="space-y-3">
              {orderedMessages.map((item) => {
                const fromCurrentUser =
                  !!currentUserEmail &&
                  !!item.senderEmail &&
                  item.senderEmail.toLowerCase() === currentUserEmail;

                return (
                  <div
                    key={item.id}
                    className={`flex ${fromCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        fromCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : item.senderRole === "admin"
                            ? "bg-blue-100 text-blue-950 dark:bg-blue-900/30 dark:text-blue-100"
                            : "bg-card border"
                      }`}
                    >
                      <div className="text-xs opacity-80 mb-1">
                        {item.senderName || (item.senderRole === "admin" ? "Admin" : "Student")}
                        {" • "}
                        {format(parseApiDate(item.createdAt), "MMM d, yyyy h:mm a")}
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">{item.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            data-testid="textarea-case-message"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSend}
              disabled={sendMessageMutation.isPending}
              data-testid="button-send-case-message"
            >
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
