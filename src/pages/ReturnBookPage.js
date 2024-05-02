import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Button, Card, CardContent, styled, IconButton, CircularProgress } from '@mui/material';
import HeaderNavigation from './HeaderNavigation';
import backgroundImage from '../assets/logo/background.jpg'; // Import the background image
import { useLocation } from 'react-router-dom';
import { Warning } from '@mui/icons-material';
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
    // const borrowingData = location.state.dataPeminjaman.data_peminjaman.borrow_data;
    const borrowingData = location.state?.dataPeminjaman?.data_peminjaman?.borrow_data;
    const bookData = borrowingData?.books;
    const studentData = borrowingData?.borrower;
    const borrowData = borrowingData?.borrow_data;
    const [lateDays, setLateDays] = useState(0);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!location.state || !location.state.dataPeminjaman) {
            navigate('/', { replace: true });
            return;
        }
        // Update late days state with the value from borrowData.late_days
        setLateDays(borrowData?.late_days || 0);
    }, [location.state, navigate]);

    const handleReturnButtonClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://127.0.0.1:8000/api/pengembalian-buku/${borrowData.borrow_code}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                setIsLoading(false);
                navigate('/borrow-confirmation', { replace: true, state: { message: 'Pengembalian' } });
            } else {
                // Handle unsuccessful return
                console.error('Failed to return the book');
            }
        } catch (error) {
            console.error('Error returning the book:', error);
        }
    };

    const handleExtendButtonClick = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://127.0.0.1:8000/api/perpanjangan-buku/${borrowData.borrow_code}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoading(false);
                navigate('/extend-receipt', { replace: true, state: { dataResponse: data } });
            } else {
                // Handle unsuccessful extension
                console.error('Failed to extend the book');
            }
        } catch (error) {
            console.error('Error extending the book:', error);
        }
    };



    return (
        <MainContainer>
            <HeaderNavigation title="Return Confirmation" />

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {borrowData && (
                    <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', transform: 'scale(0.8) translateY(-50px)' }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Return Confirmation
                        </Typography>
                        <Typography variant="body2" align="center" gutterBottom>
                            Please confirm the student information and the book that will be returned.
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
                                                        <TableCell>azziz@example.com</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Major:</strong></TableCell>
                                                        <TableCell>Teknologi Informasi</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Status:</strong></TableCell>
                                                        <TableCell>Active</TableCell>
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
                                                        <TableCell>{borrowData.borrow_code}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Borrow Date:</strong></TableCell>
                                                        <TableCell>{borrowData.borrow_date}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Return Date:</strong></TableCell>
                                                        <TableCell>{borrowData.return_date}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Status:</strong></TableCell>
                                                        <TableCell>{borrowData.status}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Fine:</strong></TableCell>
                                                        <TableCell>Rp {borrowData.fine}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell><strong>Late Days:</strong></TableCell>
                                                        <TableCell>{borrowData.late_days} days</TableCell>
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
                                        <Button variant="contained" color="primary" onClick={handleReturnButtonClick}>Return</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="secondary" disabled={lateDays > 0} onClick={handleExtendButtonClick}>Extend</Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                        {lateDays > 0 && (
                            <Typography variant="body1" color="error" align="center" sx={{ mt: 2 }}>

                                You cannot extend the book because it is overdue by {lateDays} days.
                            </Typography>
                        )}
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
        </MainContainer>
    );
};

export default ReturnPage;
