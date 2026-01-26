import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, uploadFile } from "@/lib/queryClient";
import { insertCaseSchema, CASE_CATEGORIES } from "@/types/schema";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { Upload, X, File } from "lucide-react";

const studentCaseSchema = insertCaseSchema.extend({
  studentName: z.string().optional(),
  studentEmail: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  studentPhone: z.string().min(1, "Phone number is required"),
});

type StudentCaseFormData = z.infer<typeof studentCaseSchema>;

export default function StudentSubmit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<StudentCaseFormData>({
    resolver: zodResolver(studentCaseSchema),
    defaultValues: {
      category: undefined,
      description: "",
      studentName: "",
      studentEmail: "",
      studentPhone: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: StudentCaseFormData) => {
      return await apiRequest("POST", "/api/v1/cases", data);
    },
    onSuccess: (response: any) => {
      setSubmittedCaseId(response.case_id);
      toast({
        title: "Case submitted successfully",
        description: "Your case has been submitted and is now in review.",
      });
    },
    onError: () => {
      toast({
        title: "Error submitting case",
        description: "There was an error submitting your case. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadFilesMutation = useMutation({
    mutationFn: async ({ caseId, files }: { caseId: string; files: File[] }) => {
      const uploadPromises = files.map((file) =>
        uploadFile(`/api/v1/cases/${caseId}/attachments`, file, {
          uploaded_by_name: form.getValues("studentName") || "Student",
        })
      );
      return await Promise.all(uploadPromises);
    },
  });

  const onSubmit = async (data: StudentCaseFormData) => {
    console.log("🔵 Starting submission...");
    console.log("🔵 Selected files:", selectedFiles);

    const response = await submitMutation.mutateAsync(data);
    console.log("🔵 Response:", response);
    console.log("🔵 Case ID:", response.caseId);

    // Upload files if any
    if (selectedFiles.length > 0 && response.caseId) {
      console.log("🔵 Starting file upload for case:", response.caseId);
      await uploadFilesMutation.mutateAsync({
        caseId: response.caseId,
        files: selectedFiles,
      });
      console.log("🔵 Files uploaded successfully!");
    } else {
      console.log("🔵 No files to upload or no caseId");
      console.log("🔵 selectedFiles.length:", selectedFiles.length);
      console.log("🔵 response.caseId:", response.caseId);
    }

    setSubmittedCaseId(response.caseId);
  };
  if (submittedCaseId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Case Submitted Successfully</CardTitle>
            <CardDescription>
              Your case has been received and is now under review by the Representation Committee.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Your Case ID</p>
              <p className="text-3xl font-bold font-mono text-primary" data-testid="text-submitted-case-id">
                {submittedCaseId}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Please save this ID for future reference. You can use it to track your case status.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Your case will be reviewed by a REP Admin</li>
                <li>You may be contacted for additional information</li>
                <li>Updates will be logged as your case progresses</li>
                <li>You'll be notified when your case is resolved</li>
              </ul>
            </div>
            <Button
              onClick={() => {
                setSubmittedCaseId(null);
                form.reset();
              }}
              className="w-full"
              data-testid="button-submit-another"
            >
              Submit Another Case
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Submit a Case</h1>
          <p className="text-muted-foreground mt-2">
            Get support from the Student Union Representation Committee
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Submission Form</CardTitle>
            <CardDescription>
              Please provide details about your case. All information is treated confidentially.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Your phone number"
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CASE_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide detailed information about your case..."
                          className="min-h-32"
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Include all relevant details to help us understand your situation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-4">
                    <input
                      id="attachments"
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedFiles(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                      data-testid="input-file"
                    />
                    <label
                      htmlFor="attachments"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload files
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB each)
                      </span>
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-secondary p-2 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFiles(files =>
                                files.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full"
                  size="lg"
                  data-testid="button-submit-case"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Case
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
