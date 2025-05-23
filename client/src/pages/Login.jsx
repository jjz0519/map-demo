import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Divider,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import Toast from '../components/Toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // if the user is already logged in, redirect to the map page
    useEffect(() => {
        if (user) {
            // if there is a original request path, redirect to the path after login
            const from = location.state?.from || '/map';
            navigate(from);
        }
    }, [user, navigate, location]);

    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    const validateForm = () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            return false;
        }

        if (!usernameRegex.test(username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return false;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            return false;
        }

        if (!passwordRegex.test(password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await login(username, password);
            if (result.success) {
                setToast({
                    open: true,
                    message: 'Login successfully',
                    severity: 'success'
                });
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        setError('');
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await authService.register(username, password);
            setToast({
                open: true,
                message: 'Registration successful, logging in...',
                severity: 'success'
            });
            // Automatically log in after successful registration
            const loginResult = await login(username, password);
            if (loginResult.success) {
                setTimeout(() => navigate('/map'), 1000);
            } else {
                setError(loginResult.message);
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToastClose = () => {
        setToast(prev => ({ ...prev, open: false }));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Toast
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={handleToastClose}
            />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            helperText="Username can only contain letters, numbers, and underscores"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            helperText="Password must contain at least one uppercase letter, one lowercase letter, and one number"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                        <Divider sx={{ my: 2 }}>OR</Divider>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 