import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, User } from 'firebase/auth'; import { apiRequest } from '@/lib/queryClient';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    user: any;
    isAdmin: boolean;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                // Check if user has REP_CASE_MANAGEMENT_ADMIN permission
                const hasRepPermission = (decoded as any).role?.permissions?.some(
                    (p: any) => p.permission_name === 'REP_CASE_MANAGEMENT_ADMIN'
                );
                setIsAdmin(!!hasRepPermission);
            } catch (error) {
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
        // Handle redirect result
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    const loginType = localStorage.getItem('pendingLoginType') || 'student';
                    localStorage.removeItem('pendingLoginType');

                    result.user.getIdToken()
                        .then((idToken) => {
                            const endpoint = loginType === 'admin' ? '/api/v1/admin/auth/login' : '/api/v1/auth/login';

                            return apiRequest('POST', endpoint, { idToken });
                        })
                        .then((response) => {
                            const token = response.data;
                            localStorage.setItem('authToken', token);
                            const decoded = jwtDecode(token);
                            setUser(decoded);
                            // Check if user has REP_CASE_MANAGEMENT_ADMIN permission
                            const hasRepPermission = (decoded as any).role?.permissions?.some(
                                (p: any) => p.permission_name === 'REP_CASE_MANAGEMENT_ADMIN'
                            );
                            setIsAdmin(!!hasRepPermission);
                        })
                        .catch((error) => {
                            console.error('Login flow error:', error);
                        });
                } else {
                    console.log('No redirect result found');
                }
            })
            .catch((error) => {
                console.error('getRedirectResult error:', error);
            });
    }, []);

    const login = async () => {
        try {
            // Get Firebase token ONCE
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // Try admin login first
            try {
                const response = await apiRequest('POST', '/api/v1/admin/auth/login', { idToken });
                const token = response.data;
                localStorage.setItem('authToken', token);
                const decoded = jwtDecode(token);
                setUser(decoded);
                // Check if user has REP_CASE_MANAGEMENT_ADMIN permission
                const hasRepPermission = (decoded as any).role?.permissions?.some(
                    (p: any) => p.permission_name === 'REP_CASE_MANAGEMENT_ADMIN'
                );
                setIsAdmin(!!hasRepPermission);
                return;
            } catch (adminError) {
                console.log('User is not an admin, logging in as student');
            }

            // Fallback to student login with same token
            const response = await apiRequest('POST', '/api/v1/auth/login', { idToken });
            const token = response.data;
            localStorage.setItem('authToken', token);
            const decoded = jwtDecode(token);
            setUser(decoded);
            setIsAdmin(false);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        await firebaseSignOut(auth);
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}