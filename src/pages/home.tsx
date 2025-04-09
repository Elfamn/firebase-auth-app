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
import { styled } from '@mui/material/styles';
import { List as ListIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AuthGuard from '../components/layout/AuthGuard';

const GridContainer = styled('div')(({ theme }) => ({
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateColumns: 'repeat(2, 1fr)',
    '@media (max-width: 600px)': {
        gridTemplateColumns: '1fr',
    },
}));

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
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
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
                                <strong>Email:</strong> {currentUser?.email || 'Not available'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>User ID:</strong> {currentUser?.uid || 'Not available'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Email Verified:</strong> {
                                    currentUser?.emailVerified !== undefined 
                                        ? (currentUser.emailVerified ? 'Yes' : 'No')
                                        : 'Not available'
                                }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Account Created:</strong> {currentUser?.metadata.creationTime || 'Not available'}
                            </Typography>
                        </CardContent>
                    </Card>

                    <GridContainer>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<ListIcon />}
                            onClick={() => router.push('/tasks')}
                            size="large"
                        >
                            Manage Tasks
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={handleLogout}
                            size="large"
                        >
                            Log Out
                        </Button>
                    </GridContainer>
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