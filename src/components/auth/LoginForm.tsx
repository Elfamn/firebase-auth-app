import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    Button,
    TextField,
    Box,
    Typography,
    Container,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getAuthErrorMessage } from '../../utils/errorMessages';
import Notification from '../../hooks/ui/Notification';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);
    const [showAccess, setShowAccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMsg('Please enter both email and password');
            setShowError(true);
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            setShowAccess(true);
            setTimeout(() => {
                router.push('/home?success=true');
            }, 0);
        } catch (err: any) {
            console.log("Caught error:", err);
            const errorCode = err.code || 'auth/unknown';
            setErrorMsg(getAuthErrorMessage(errorCode));
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Sign In
                </Typography>

                {showAccess && (
                    <Alert
                        severity="success"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Access granted! Redirecting to dashboard...
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            height: 48,
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2
                    }}>
                        <Link href="/forgot-password" passHref>
                            <Typography
                                variant="body2"
                                sx={{
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Forgot password?
                            </Typography>
                        </Link>
                        <Link href="/register" passHref>
                            <Typography
                                variant="body2"
                                sx={{
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {"Don't have an account? Sign Up"}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>

            <Notification
                open={showError}
                message={errorMsg}
                severity="error"
                onClose={() => setShowError(false)}
            />
        </Container>
    );
};

export default LoginForm;