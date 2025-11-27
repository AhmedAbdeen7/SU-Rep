import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText, Users, Shield, CheckCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAdmin } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Student Union
              <span className="block text-primary mt-2">Representation Committee</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get support for academic, welfare, and campus-related concerns.
              Our committee is here to represent and advocate for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/submit">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-submit-case">
                  Submit a Case
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-admin-dashboard">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-elevate">
            <CardContent className="p-6">
              <FileText className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Submission</h3>
              <p className="text-sm text-muted-foreground">
                Submit cases quickly and easily with our streamlined form
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confidential</h3>
              <p className="text-sm text-muted-foreground">
                All cases are treated with strict confidentiality and care
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated REP team ready to advocate on your behalf
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6">
              <CheckCircle className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your case status and receive timely updates
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Submit Your Case</h3>
              <p className="text-muted-foreground">
                Fill out our simple form with details about your concern
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Review & Assignment</h3>
              <p className="text-muted-foreground">
                A REP admin reviews and assigns your case to the right team member
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Resolution</h3>
              <p className="text-muted-foreground">
                We work with you to resolve your case and provide support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
