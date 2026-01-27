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
import MyCases from "@/pages/my-cases";
import NotFound from "@/pages/not-found";
import { LayoutDashboard, FilePlus, Users } from "lucide-react";
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/login';  
import { useAuth } from '@/contexts/AuthContext';
import suLogo from '@/assets/SU-LOGOwhite-small.png';
import { Footer } from '@/components/footer';


function Navigation() {
  const [location] = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 font-semibold text-lg hover:opacity-80 px-3 py-2 rounded-md transition-opacity"
              data-testid="link-home"
            >
              <img src={suLogo} alt="Student Union" className="h-14 w-auto" />
              <span className="hidden sm:inline">REP Committee</span>
              <span className="sm:hidden">REP</span>
            </Link>
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {isAdmin && (
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-primary-foreground hover:bg-white/20 ${isActive("/dashboard") ? "bg-white/20" : ""}`}
                      data-testid="nav-dashboard"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user && !isAdmin && (
                  <Link href="/my-cases">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-primary-foreground hover:bg-white/20 ${isActive("/my-cases") ? "bg-white/20" : ""}`}
                      data-testid="nav-my-cases"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      My Cases
                    </Button>
                  </Link>
                )}
                <Link href="/submit">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-primary-foreground hover:bg-white/20 ${isActive("/submit") ? "bg-white/20" : ""}`}
                    data-testid="nav-submit"
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Submit Case
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin/submit">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-primary-foreground hover:bg-white/20 ${isActive("/admin/submit") ? "bg-white/20" : ""}`}
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
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20" onClick={logout}>
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

      <Route path="/my-cases">
        <ProtectedRoute>
          <MyCases />
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
            <div className="min-h-screen bg-background flex flex-col">
              <Navigation />
              <main className="flex-1 flex flex-col">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
