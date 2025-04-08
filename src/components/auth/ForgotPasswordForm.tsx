import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Button,
    TextField,
    Box,
    Typography,
    Container,
    Paper,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Notification from '../../hooks/ui/Notification';
import { getAuthErrorMessage } from '../../utils/errorMessages';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'error'>('success');

    const { forgotPassword } = useAuth();
 
    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;

        if (showNotification) {
            timerId = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [showNotification]);

    const validateEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            setEmailError(validationError);
            setNotificationMessage(validationError);
            setNotificationSeverity('error');
            setShowNotification(true);
            return;
        }

        try {
            setError('');
            setEmailError('');
            setLoading(true);

            await forgotPassword(email);

            setSuccess(true);
            setNotificationMessage('Password reset email sent! Check your inbox.');
            setNotificationSeverity('success');
            
            setShowNotification(true);
        } catch (err: any) {
            console.error("Password reset error:", err);
            const errorMessage = getAuthErrorMessage(err?.code);
            setError(errorMessage);
            setNotificationMessage(errorMessage);
            setNotificationSeverity('error');
            setShowNotification(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Reset Password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Typography>
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
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) {
                                setEmailError('');
                                setError('');
                            }
                        }}
                        error={!!emailError}
                        helperText={emailError}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link href="/login" passHref>
                            <Typography variant="body2" component="span" sx={{ cursor: 'pointer' }}>
                                Back to Sign In
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>

            {showNotification && (
                <Notification
                    message={notificationMessage}
                    severity={notificationSeverity}
                    open={showNotification}
                    onClose={() => setShowNotification(false)}
                />
            )}
        </Container>
    );
};

export default ForgotPasswordForm;