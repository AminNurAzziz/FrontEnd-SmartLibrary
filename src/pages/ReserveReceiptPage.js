import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Button, Card, CardContent, styled, IconButton, CircularProgress } from '@mui/material';
import HeaderNavigation from './HeaderNavigation';
import backgroundImage from '../assets/logo/background.jpg'; // Import the background image
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Define the styled component for the main container with background image
const MainContainer = styled('div')({
    backgroundImage: `url(${backgroundImage})`, // Use the imported image in the background
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: '1', // Adjust the opacity value as needed
    minHeight: '100vh',
});


const ReturnPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dataState = location.state?.dataReservasi
    const reserveData = dataState.reservation_data;
    const bookData = dataState.title_book;
    const studentData = dataState.student_data;
    const [isLoading, setIsLoading] = useState(false);
    console.log(reserveData);
    useEffect(() => {
        if (!location.state || !location.state.dataReservasi) {
            navigate('/', { replace: true });
            return;
        }
    }, [location.state, navigate]);


    const handleConfirmButtonClick = async () => {
        console.log('Confirming the reservation: ' + reserveData.reservation_code);
        try {
            setIsLoading(true);

            const response = await fetch(`http://127.0.0.1:8000/api/konfirmasi-reservasi/${reserveData.reservation_code}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Failed to confirm the reservation: ' + response.statusText, errorData);
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Reservation confirmed:', data);

            navigate('/borrow-confirmation', { replace: true, state: { message: 'Reserve Confirmation' } });
        } catch (error) {
            console.error('Error confirming the reservation:', error);
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <MainContainer>
            <HeaderNavigation title="Reserve Confirmation" />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {reserveData && (
                    <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', transform: 'scale(0.8) translateY(-50px)' }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            <strong>Reserve Confirmation</strong>
                        </Typography>
                        <Typography variant="body2" align="center" gutterBottom>
                            Please confirm the student information and the book that will be confirmed
                        </Typography>
                        <br />
                        <Grid container spacing={4}>
                            {/* Student Information */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" align="center" gutterBottom><strong>Student Information</strong></Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell><strong>Student ID:</strong></TableCell>
                                                        <TableCell>{studentData.student_id}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Name:</strong></TableCell>
                                                        <TableCell>{studentData.name}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Email:</strong></TableCell>
                                                        <TableCell>{studentData.email}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Major:</strong></TableCell>
                                                        <TableCell>{studentData.faculty}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Class :</strong></TableCell>
                                                        <TableCell>{studentData.class}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Status:</strong></TableCell>
                                                        <TableCell>{studentData.status}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Borrowed Book Information */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" align="center" gutterBottom><strong>Borrowed Book Information</strong></Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell><strong>Book Code:</strong></TableCell>
                                                        <TableCell>{bookData.book_code}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>ISBN:</strong></TableCell>
                                                        <TableCell>{bookData.isbn}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Book Title:</strong></TableCell>
                                                        <TableCell>{bookData.book_title}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Stock:</strong></TableCell>
                                                        <TableCell>{bookData.stock}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Quantity Borrowed:</strong></TableCell>
                                                        <TableCell>{bookData.qty_borrowed}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Borrow Information */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" align="center" gutterBottom><strong>Borrow Information</strong></Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell><strong>Borrow Code:</strong></TableCell>
                                                        <TableCell>{reserveData.reservation_code}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Reservation Date:</strong></TableCell>
                                                        <TableCell>{reserveData.reservation_date}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Pick Up Date:</strong></TableCell>
                                                        <TableCell>{reserveData.pickup_date}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Status:</strong></TableCell>
                                                        <TableCell>{reserveData.status}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Buttons */}
                            <Grid item xs={12}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={handleConfirmButtonClick} disabled={reserveData.status === 'menunggu'}>
                                            Confirm
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>

                    </Paper>
                )}
            </Container>
            {isLoading && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: 9999 }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <CircularProgress color="inherit" />
                        <Typography variant="body1" style={{ marginTop: '16px', color: '#333' }}>Sedang memproses...</Typography>
                    </div>
                </div>
            )}
        </MainContainer >
    );
};

export default ReturnPage;
