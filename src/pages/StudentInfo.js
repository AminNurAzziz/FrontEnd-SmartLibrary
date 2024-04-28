import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, CardMedia } from '@mui/material';
import Header from './HeaderNavigation';
import illustrationImage from '../assets/logo/library.png';

const StudentInfo = () => {
    const location = useLocation();
    const { studentData, borrowedBooks } = location.state || {};

    return (
        <main>
            <Header />
            <Container sx={{ mt: 4, height: '100vh', overflow: 'auto' }}>
                <Grid container spacing={3}>
                    {/* Left Section */}
                    <Grid item xs={12} sm={6} md={8}>
                        <Card sx={{ bgcolor: '#e6f2ff', color: 'white', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <CardContent sx={{ padding: "50px", color: "#0f1f40" }} >
                                <Typography variant="h5" align="left" >
                                    {studentData && `Welcome, ${studentData.student_name}!`}
                                </Typography>
                                <Typography variant="body2" align="left" sx={{ mt: 2 }}>
                                    Scan to start borrowing available books
                                </Typography>
                                <Grid container spacing={2} justifyContent="flex-start" sx={{ mt: 2 }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#0f1f40',
                                                color: '#FFFFFF',
                                                '&:hover': {
                                                    backgroundColor: '#899dc4',
                                                },
                                            }}
                                            onClick={() => console.log("Scan QR Code clicked")}
                                        >
                                            Scan Book
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'transparent',
                                                color: '#0f1f40',
                                                border: '1px solid #0f1f40',
                                                '&:hover': {
                                                    backgroundColor: '#899dc4',
                                                },
                                            }}
                                            onClick={() => console.log("Search Book clicked")}
                                        >
                                            <b>Search Book</b>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardMedia
                                component="img"
                                image={illustrationImage}
                                alt="Illustration"
                                sx={{ width: '35%', height: 'auto', marginLeft: 'auto', marginRight: 'auto' }}
                            />
                        </Card>
                    </Grid>
                    {/* Right Section */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Grid container spacing={3} direction="column">
                            {/* First Vertical Card */}
                            <Grid item>
                                <Card>
                                    <CardContent sx={{ backgroundColor: '#ffdac1' }}>
                                        {/* <Typography variant="h6"> {studentData.class}</Typography> */}
                                        <Typography variant="h6">2141762034</Typography>
                                        <Typography variant="h6"><b>NIM</b></Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Second Vertical Card */}
                            <Grid item>
                                <Card>
                                    <CardContent sx={{ backgroundColor: '#faf5e6' }}>
                                        <Typography variant="h6">Teknologi Informasi</Typography>
                                        <Typography variant="h6"><b>Major</b></Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Third Vertical Card */}
                            <Grid item>
                                <Card>
                                    <CardContent sx={{ backgroundColor: '#e6f8fa' }}>
                                        <Typography variant="h6">SIB-3B</Typography>
                                        <Typography variant="h6"><b>Class</b></Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {borrowedBooks && borrowedBooks.length > 0 && (
                    <TableContainer sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom align="center" sx={{ color: '#0f1f40', mb: 2 }}>Borrowed Books</Typography>
                        <Table sx={{ backgroundColor: '#ffffff', border: '2px solid #e6f2ff', borderRadius: '40px' }}> {/* Add borderRadius styling here */}
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e6f2ff', color: 'white' }}>
                                    <TableCell sx={{ color: '#0f1f40', fontWeight: 'bold' }}>Title</TableCell>
                                    <TableCell sx={{ color: '#0f1f40', fontWeight: 'bold' }}>Borrow Date</TableCell>
                                    <TableCell sx={{ color: '#0f1f40', fontWeight: 'bold' }}>Return Date</TableCell>
                                    <TableCell sx={{ color: '#0f1f40', fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ color: '#0f1f40', fontWeight: 'bold' }}>Action</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {borrowedBooks.map(renderBorrowedBook)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </main >
    );
};

const renderStudentDetails = (studentData) => {
    return (
        <>
            <ListItem sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <ListItemText primary={`ID: ${studentData.id}`} />
            </ListItem>
            <ListItem sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <ListItemText primary={`NIM: ${studentData.nim}`} />
            </ListItem>
            <ListItem sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <ListItemText primary={`Name: ${studentData.student_name}`} />
            </ListItem>
            <ListItem sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <ListItemText primary={`Major: ${studentData.major}`} />
            </ListItem>
            <ListItem sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <ListItemText primary={`Email: ${studentData.email}`} />
            </ListItem>
            <ListItem>
                <ListItemText primary={`Status: ${studentData.status}`} />
            </ListItem>
        </>
    );
};

const renderBorrowedBook = (book, index) => {
    const borrowDate = new Date(book.borrow_date);
    const returnDate = new Date(book.return_date);
    const twoDaysLater = new Date();
    twoDaysLater.setDate(borrowDate.getDate() + 10);

    const isExtendDisabled = returnDate <= twoDaysLater;
    return (
        <TableRow key={index}>

            <TableCell>{book.book_title}</TableCell>
            <TableCell>{book.borrow_date}</TableCell>
            <TableCell>{book.return_date}</TableCell>
            <TableCell>{book.status}</TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isExtendDisabled}
                    onClick={() => console.log("Extend button clicked for book:", book.book_title)}
                >
                    Extend
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default StudentInfo;
