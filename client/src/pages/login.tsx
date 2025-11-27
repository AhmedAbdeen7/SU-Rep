import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">REP Case Management</CardTitle>
                    <CardDescription>Sign in with your AUC Google account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        Use your @aucegypt.edu account
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}