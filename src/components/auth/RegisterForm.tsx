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
import Notification from '../../hooks/ui/Notification';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [showAccess, setShowAccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const validatePassword = () => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }

        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordError = validatePassword();
        if (passwordError) {
            setError(passwordError);
            setShowError(true);
            return;
        }

        try {
            setError('');
            setLoading(true);
            await register(email, password);

            // Show both success states
            setShowAccess(true);
            setShowSuccess(true);

            // Delay redirect
            setTimeout(() => {
                router.push('/login?success=true');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create an account');
            setShowError(true);
            setShowSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Sign Up
                </Typography>

                {showAccess && (
                    <Alert
                        severity="success"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Account created! Redirecting to login...
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText="Password must be at least 6 characters"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link href="/login" passHref>
                            <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                                {"Already have an account? Sign In"}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>

            <Notification
                open={showError}
                message={error}
                severity="error"
                onClose={() => setShowError(false)}
            />

            <Notification
                open={showSuccess}
                message="Account created successfully!"
                severity="success"
                onClose={() => setShowSuccess(false)}
            />
        </Container>
    );
};

export default RegisterForm;