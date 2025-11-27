import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import CaseDetail from "@/pages/case-detail";
import StudentSubmit from "@/pages/student-submit";
import AdminSubmit from "@/pages/admin-submit";
import NotFound from "@/pages/not-found";
import { LayoutDashboard, FilePlus, Users } from "lucide-react";
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/login';
import { useAuth } from '@/contexts/AuthContext';


function Navigation() {
  const [location] = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg hover-elevate px-3 py-2 rounded-md transition-colors"
              data-testid="link-home"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">Student Union REP</span>
              <span className="sm:hidden">REP</span>
            </Link>
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {isAdmin && (
                  <Link href="/dashboard">
                    <Button
                      variant={isActive("/dashboard") ? "secondary" : "ghost"}
                      size="sm"
                      data-testid="nav-dashboard"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/submit">
                  <Button
                    variant={isActive("/submit") ? "secondary" : "ghost"}
                    size="sm"
                    data-testid="nav-submit"
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Submit Case
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin/submit">
                    <Button
                      variant={isActive("/admin/submit") ? "secondary" : "ghost"}
                      size="sm"
                      data-testid="nav-admin-submit"
                    >
                      <FilePlus className="h-4 w-4 mr-2" />
                      Admin Submit
                    </Button>
                  </Link>
                )}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />

      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>

      <Route path="/submit">
        <ProtectedRoute>
          <StudentSubmit />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard">
        <ProtectedRoute requireAdmin>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/submit">
        <ProtectedRoute requireAdmin>
          <AdminSubmit />
        </ProtectedRoute>
      </Route>

      <Route path="/case/:caseId">
        <ProtectedRoute requireAdmin>
          <CaseDetail />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="rep-theme">
        <TooltipProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Router />
            </div>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
