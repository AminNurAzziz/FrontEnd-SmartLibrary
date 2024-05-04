import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, styled, Snackbar } from '@mui/material';
import backgroundImage from '../assets/logo/background.jpg';
import MuiAlert from '@mui/material/Alert';
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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logika autentikasi di sini (contoh sederhana hanya untuk demonstrasi)
        if (username === 'admin' && password === 'admin123') {
            // Autentikasi berhasil
            console.log('Login Success');
            // Redirect ke halaman admin
        } else {
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
                        Username or password is incorrect
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
                            id="username"
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
            </Container >
        </MainContainer>
    );
};

export default AdminLoginPage;
