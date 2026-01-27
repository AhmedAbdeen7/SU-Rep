import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import suLogoBlack from '@/assets/SU-LOGOwhite-small.png';

export default function Login() {
    const { login, user, loading: authLoading } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            setLocation('/');
        }
    }, [user, authLoading, setLocation]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login();
            toast({
                title: 'Login successful',
                description: 'Welcome to the Case Management System',
            });
        } catch (error) {
            toast({
                title: 'Login failed',
                description: 'Please try again with your @aucegypt.edu account',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header bar with logo */}
            <div className="bg-primary text-primary-foreground py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <img src={suLogoBlack} alt="Student Union" className="h-12 w-auto" />
                    <span className="font-semibold text-lg">AUC Student Union</span>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full shadow-lg border-2">
                    <CardHeader className="text-center space-y-4">
                        <CardTitle className="text-2xl font-bold text-primary">REP Committee</CardTitle>
                        <CardDescription className="text-base">Case Management System</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            Sign in with Google
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                            Use your <span className="font-medium">@aucegypt.edu</span> account
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <div className="bg-primary text-primary-foreground py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="text-sm opacity-80 text-center sm:text-left">
                        <div>© {new Date().getFullYear()} AUC Student Union</div>
                        <div>Developed by Ahmed Abdeen & Islam Abdeen</div>
                    </div>
                    <img src={suLogoBlack} alt="Student Union" className="h-8 w-auto" />
                </div>
            </div>
        </div>
    );
}