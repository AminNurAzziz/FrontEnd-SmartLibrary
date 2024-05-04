import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';


const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mock API call (contoh sederhana untuk demonstrasi)
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/dashboard'); // Ganti API_ENDPOINT dengan URL endpoint sesuai kebutuhan
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setDashboardData(data.data);
            } catch (error) {
                setError('Failed to fetch data');
            }
        };

        fetchData();
    }, []);

    return (
        <>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Dashboard
                    </Typography>
                    {error && (
                        <Typography variant="body1" color="error" align="center">
                            {error}
                        </Typography>
                    )}
                    {dashboardData && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Total Student Borrow
                                    </Typography>
                                    <Typography variant="h4" align="center" color="primary">
                                        {dashboardData.total_student_borrow}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Total Book Back
                                    </Typography>
                                    <Typography variant="h4" align="center" color="primary">
                                        {dashboardData.total_book_back}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Total Borrowing
                                    </Typography>
                                    <Typography variant="h4" align="center" color="primary">
                                        {dashboardData.total_borrowing}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Total Book Available
                                    </Typography>
                                    <Typography variant="h4" align="center" color="primary">
                                        {dashboardData.total_book_available}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Total Fine
                                    </Typography>
                                    <Typography variant="h4" align="center" color="primary">
                                        {dashboardData.total_fine}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Container>
        </>
    );
};

export default DashboardPage;
