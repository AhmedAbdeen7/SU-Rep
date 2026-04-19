import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export default function FAQPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [deletingFaq, setDeletingFaq] = useState<FaqItem | null>(null);

  const { data, isLoading, error } = useQuery<FaqItem[]>({
    queryKey: ["/api/v1/faqs"],
  });

  const faqs = useMemo(() => data || [], [data]);

  const addFaqMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/v1/faqs", {
        question: question.trim(),
        answer: answer.trim(),
      });
    },
    onSuccess: async () => {
      setQuestion("");
      setAnswer("");
      await queryClient.invalidateQueries({ queryKey: ["/api/v1/faqs"] });
      toast({
        title: "FAQ added",
        description: "The new FAQ has been published successfully.",
      });
    },
    onError: (mutationError: unknown) => {
      const message = mutationError instanceof Error ? mutationError.message : "Unable to add FAQ";
      toast({
        title: "Failed to add FAQ",
        description: message,
        variant: "destructive",
      });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: async () => {
      if (!editingFaq) {
        throw new Error("No FAQ selected for editing");
      }

      return apiRequest("PUT", `/api/v1/faqs/${editingFaq.id}`, {
        question: editQuestion.trim(),
        answer: editAnswer.trim(),
      });
    },
    onSuccess: async () => {
      setEditingFaq(null);
      setEditQuestion("");
      setEditAnswer("");
      await queryClient.invalidateQueries({ queryKey: ["/api/v1/faqs"] });
      toast({
        title: "FAQ updated",
        description: "The FAQ has been updated successfully.",
      });
    },
    onError: (mutationError: unknown) => {
      const message = mutationError instanceof Error ? mutationError.message : "Unable to update FAQ";
      toast({
        title: "Failed to update FAQ",
        description: message,
        variant: "destructive",
      });
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async () => {
      if (!deletingFaq) {
        throw new Error("No FAQ selected for deletion");
      }

      return apiRequest("DELETE", `/api/v1/faqs/${deletingFaq.id}`);
    },
    onSuccess: async () => {
      setDeletingFaq(null);
      await queryClient.invalidateQueries({ queryKey: ["/api/v1/faqs"] });
      toast({
        title: "FAQ deleted",
        description: "The FAQ has been removed successfully.",
      });
    },
    onError: (mutationError: unknown) => {
      const message = mutationError instanceof Error ? mutationError.message : "Unable to delete FAQ";
      toast({
        title: "Failed to delete FAQ",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleAddFaq = () => {
    if (!question.trim()) {
      toast({
        title: "Question is required",
        description: "Please provide a question before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!answer.trim()) {
      toast({
        title: "Answer is required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    addFaqMutation.mutate();
  };

  const openEditDialog = (faq: FaqItem) => {
    setEditingFaq(faq);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleUpdateFaq = () => {
    if (!editQuestion.trim()) {
      toast({
        title: "Question is required",
        description: "Please provide a question before saving.",
        variant: "destructive",
      });
      return;
    }

    if (!editAnswer.trim()) {
      toast({
        title: "Answer is required",
        description: "Please provide an answer before saving.",
        variant: "destructive",
      });
      return;
    }

    updateFaqMutation.mutate();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">Answers to common questions from students and admins.</p>

      {isAdmin && (
        <section className="mb-8 border rounded-lg p-4 bg-card">
          <h2 className="text-lg font-semibold mb-4">Add New FAQ</h2>
          <div className="space-y-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Question"
              className="w-full border rounded-md px-3 py-2 bg-background"
              data-testid="input-faq-question"
            />
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Answer"
              className="w-full border rounded-md px-3 py-2 min-h-28 bg-background"
              data-testid="textarea-faq-answer"
            />
            <button
              type="button"
              onClick={handleAddFaq}
              disabled={addFaqMutation.isPending}
              className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-60"
              data-testid="button-add-faq"
            >
              {addFaqMutation.isPending ? "Adding..." : "Add FAQ"}
            </button>
          </div>
        </section>
      )}

      <section className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading FAQs...</p>
        ) : error ? (
          <p className="text-sm text-destructive">
            Failed to load FAQs{error instanceof Error ? `: ${error.message}` : "."}
          </p>
        ) : faqs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No FAQs available yet.</p>
        ) : (
          faqs.map((faq) => (
            <article key={faq.id} className="border rounded-lg p-4 bg-card shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-lg mb-2 break-words">{faq.question}</h2>
                  <p className="text-foreground/90 whitespace-pre-wrap">{faq.answer}</p>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(faq)}
                      data-testid={`button-edit-faq-${faq.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingFaq(faq)}
                      data-testid={`button-delete-faq-${faq.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      <Dialog open={!!editingFaq} onOpenChange={(open) => !open && setEditingFaq(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update the question and answer, then save the changes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
              placeholder="Question"
              data-testid="input-edit-faq-question"
            />
            <Textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              placeholder="Answer"
              className="min-h-28"
              data-testid="textarea-edit-faq-answer"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingFaq(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateFaq}
              disabled={updateFaqMutation.isPending}
              data-testid="button-save-faq"
            >
              {updateFaqMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingFaq} onOpenChange={(open) => !open && setDeletingFaq(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the FAQ from the public list. You can add it again later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                deleteFaqMutation.mutate();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-faq"
            >
              {deleteFaqMutation.isPending ? "Deleting..." : "Delete FAQ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
