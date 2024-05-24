import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, styled, Snackbar } from '@mui/material';
import backgroundImage from '../assets/logo/background.jpg';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainContainer = styled('div')({
    backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.5)), url(${backgroundImage})`, // Use the imported image in the background
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: '1',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const AdminLoginPage = () => {
    const [email, setEmail] = useState(''); // Change username to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
                email, // Change username to email
                password
            });
            const { access_token, user_role } = response.data;


            localStorage.setItem('role', user_role);
            localStorage.setItem('isFirstLogin', true);

            if (user_role === 'admin' || user_role === 'superAdmin') {
                // Save token to local storage or context
                localStorage.setItem('token', access_token);
                // Redirect to admin page
                navigate('/dashboard');
            } else {
                setError('Unauthorized role');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError('Email or password is incorrect');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <MainContainer>
            <Container maxWidth="xs" align="center">
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="error">
                        Email or password is incorrect
                    </MuiAlert>
                </Snackbar>
                <Paper elevation={3} sx={{ padding: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography variant="h6" align="center" gutterBottom>
                        <strong>JTI POLINEMA LIBRARY</strong>
                    </Typography>
                    <Typography variant="body2" align="center" gutterBottom>
                        Login to access admin dashboard
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="email" // Change id to email
                            label="Email" // Change label to Email
                            variant="outlined"
                            value={email} // Change value to email
                            onChange={(e) => setEmail(e.target.value)} // Change setUsername to setEmail
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography variant="body2" color="error" gutterBottom>
                                {error}
                            </Typography>
                        )}
                        <Grid container justifyContent="center" sx={{ mt: 2 }}>
                            <Grid item>
                                <Button type="submit" variant="contained" color="primary">
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </MainContainer>
    );
};

export default AdminLoginPage;
