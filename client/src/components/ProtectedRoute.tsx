import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, isAdmin, loading } = useAuth();
    const [, setLocation] = useLocation();

    // Redirects must not happen during render; do them in an effect
    React.useEffect(() => {
        if (!loading) {
            if (!user) {
                setLocation('/login');
            } else if (requireAdmin && !isAdmin) {
                setLocation('/');
            }
        }
    }, [loading, user, isAdmin, requireAdmin, setLocation]);

    if (loading || !user || (requireAdmin && !isAdmin)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}