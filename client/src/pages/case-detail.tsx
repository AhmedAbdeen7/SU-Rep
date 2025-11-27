import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";
import { CategoryBadge } from "@/components/category-badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient, uploadFile } from "@/lib/queryClient";
import type { Case, CaseUpdate, CaseStatus } from "@/types/schema";
import { CASE_STATUSES } from "@/types/schema";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User, Mail, Phone, Loader2, Save } from "lucide-react";
import { Upload, FileText, Download } from "lucide-react";

export default function CaseDetail() {
  const { caseId } = useParams();
  const { toast } = useToast();
  const [newStatus, setNewStatus] = useState<CaseStatus | "">("");
  const [assignee, setAssignee] = useState("");
  const [note, setNote] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);

  const uploadAttachmentMutation = useMutation({
    mutationFn: async (file: File) => {
      return await uploadFile(`/api/v1/cases/${caseId}/attachments`, file, {
        uploaded_by_name: "Admin User",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases", caseId, "attachments"] });
      toast({
        title: "File uploaded successfully",
        description: "The attachment has been added to the case.",
      });
      setUploadingFile(false);
    },
    onError: () => {
      toast({
        title: "Error uploading file",
        description: "There was an error uploading the file. Please try again.",
        variant: "destructive",
      });
      setUploadingFile(false);
    },
  });

  const { data: caseData, isLoading: caseLoading } = useQuery<Case>({
    queryKey: ["/api/v1/cases", caseId],
  });

  const { data: updates, isLoading: updatesLoading } = useQuery<CaseUpdate[]>({
    queryKey: ["/api/v1/cases", caseId, "updates"],
  });

  const { data: attachments, isLoading: attachmentsLoading } = useQuery<any[]>({
    queryKey: ["/api/v1/cases", caseId, "attachments"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { status?: CaseStatus; assignee_name?: string; assignee_google_id?: string | null; note?: string; actor: string }) => {
      return await apiRequest("PATCH", `/api/v1/cases/${caseId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases", caseId, "updates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases"] });
      toast({
        title: "Case updated successfully",
        description: "The case has been updated with your changes.",
      });
      setNewStatus("");
      setAssignee("");
      setNote("");
    },
    onError: () => {
      toast({
        title: "Error updating case",
        description: "There was an error updating the case. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = () => {
    if (!newStatus && !assignee && !note) {
      toast({
        title: "No changes",
        description: "Please make at least one change before updating.",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      status: newStatus || undefined,
      assignee_name: assignee || undefined,
      assignee_google_id: assignee ? null : undefined,
      note: note || undefined,
      actor: "Admin User",
    });
  };

  if (caseLoading || updatesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Case not found</h2>
          <p className="text-muted-foreground mt-2">The case you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button className="mt-4" data-testid="button-back-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-case-title">
                  Case {caseData.caseId}
                </h1>
                <div className="flex items-center gap-2 mt-3">
                  <CategoryBadge category={caseData.category} />
                  <StatusBadge status={caseData.status} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap" data-testid="text-description">
                    {caseData.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Case Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  {updates && updates.length > 0 ? (
                    <div className="space-y-4">
                      {updates.map((update) => (
                        <div
                          key={update.id}
                          className="border-l-2 border-primary pl-4 pb-4"
                          data-testid={`update-${update.id}`}
                        >
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">{update.actor}</span>
                            <span>•</span>
                            <span>{update.action}</span>
                            <span>•</span>
                            <span>{format(new Date(update.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
                          </div>
                          {update.newStatus && (
                            <div className="mt-2">
                              <StatusBadge status={update.newStatus} />
                            </div>
                          )}
                          {update.note && (
                            <p className="text-sm text-foreground mt-2">{update.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No updates yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <input
                      id="attachment-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadingFile(true);
                          uploadAttachmentMutation.mutate(e.target.files[0]);
                          e.target.value = ""; // Reset input
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="attachment-upload">
                      <Button variant="outline" size="sm" asChild disabled={uploadingFile}>
                        <span className="cursor-pointer">
                          {uploadingFile ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload File
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>

                  {attachments && attachments.length > 0 ? (
                    <div className="space-y-2">
                      {attachments.map((attachment: any) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between border rounded p-3"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{attachment.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(attachment.file_size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No attachments yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Case Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{format(new Date(caseData.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  {!caseData.isAnonymous && caseData.studentName && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Student:</span>
                        <span className="font-medium">{caseData.studentName}</span>
                      </div>
                      {caseData.studentEmail && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{caseData.studentEmail}</span>
                        </div>
                      )}
                      {caseData.studentPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">{caseData.studentPhone}</span>
                        </div>
                      )}
                    </>
                  )}
                  {caseData.assignee && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="font-medium">{caseData.assignee}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Update Case</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Change Status</Label>
                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as CaseStatus)}>
                      <SelectTrigger id="status" data-testid="select-status">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {CASE_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assign To</Label>
                    <Input
                      id="assignee"
                      placeholder="Admin name or email"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      data-testid="input-assignee"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Add Note</Label>
                    <Textarea
                      id="note"
                      placeholder="Add a note or comment..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      data-testid="textarea-note"
                    />
                  </div>

                  <Button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                    className="w-full"
                    data-testid="button-update-case"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Case
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
