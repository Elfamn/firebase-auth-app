import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Notification from '../hooks/ui/Notification';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthGuard from '../components/layout/AuthGuard';

export default function Home() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const cleanup = () => {
            setShowSuccess(false);
            setError("");
        };

        if (router.query.success) {
            setShowSuccess(true);
            router.replace('/home', undefined, { shallow: true });
        }

        return cleanup;
    }, [router.query]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error: any) {
            console.error('Failed to log out', error);
            setError(error?.message || "Failed to logout");
        }
    };

    return (
        <AuthGuard>
            <Head>
                <title>Home | Firebase Auth App</title>
            </Head>
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to Your Dashboard
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        User Information
                    </Typography>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="body1" gutterBottom>
                                <strong>Email:</strong> {currentUser?.email}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>User ID:</strong> {currentUser?.uid}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Email Verified:</strong> {currentUser?.emailVerified ? 'Yes' : 'No'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Account Created:</strong> {currentUser?.metadata.creationTime}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleLogout}
                            size="large"
                        >
                            Log Out
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <Notification
                open={showSuccess}
                message="Successfully logged in!"
                severity="success"
                onClose={() => setShowSuccess(false)}
            />
            {error && (
                <Notification
                    open={!!error}
                    message={error}
                    severity="error"
                    onClose={() => setError("")}
                />
            )}
        </AuthGuard>
    );
}