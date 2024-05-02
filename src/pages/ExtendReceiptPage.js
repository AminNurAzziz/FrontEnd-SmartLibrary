import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Card, CardContent, styled, Checkbox, FormControlLabel, TextField, Button } from '@mui/material';
import HeaderNavigation from './HeaderNavigation';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/logo/background.jpg'; // Import the background image
import { useLocation } from 'react-router-dom';

const MainContainer = styled('div')({
    backgroundImage: `url(${backgroundImage})`, // Use the imported image in the background
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: '1', // Adjust the opacity value as needed
    minHeight: '100vh',
});

const ReceiptExtensionPage = () => {
    const location = useLocation();
    const responseData = location.state?.dataResponse;

    // State for printing receipt and sending email
    const [printReceipt, setPrintReceipt] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Handlers for checkbox and email input changes
    const handlePrintReceiptChange = (event) => {
        setPrintReceipt(event.target.checked);
    };

    const handleSendEmailChange = (event) => {
        setSendEmail(event.target.checked);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    // Handler for completing the process
    const handlePrint = () => {
        if (printReceipt) {
            window.print();
        }
        if (sendEmail) {
            // Logic to send email
            console.log(`Sending loan receipt to ${email} via email.`);
        }
        navigate('/borrow-confirmation', { replace: true, state: { message: 'Perpanjangan' } });
    };



    useEffect(() => {
        if (!location.state) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    // Render table rows for extension data
    const renderExtensionDataRows = () => {
        return Object.entries(responseData.extension_data).map(([key, value]) => (
            <TableRow key={key}>
                <TableCell><strong>{key.replace(/_/g, ' ').toUpperCase()}</strong></TableCell>
                <TableCell>{value}</TableCell>
            </TableRow>
        ));
    };

    // Render table rows for student information
    const renderStudentInfoRows = () => {
        return Object.entries(responseData.student).map(([key, value]) => (
            <TableRow key={key}>
                <TableCell><strong>{key.replace(/_/g, ' ').toUpperCase()}</strong></TableCell>
                <TableCell>{value}</TableCell>
            </TableRow>
        ));
    };

    return (
        <MainContainer>
            <HeaderNavigation title="Receipt Extension" />

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', transform: 'scale(0.8) translateY(-75px)' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Receipt Extension
                    </Typography>
                    {responseData && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" align="center" gutterBottom><strong>Extension Data</strong></Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell><strong>BOOK TITLE</strong></TableCell>
                                                        <TableCell>{responseData.title_book}</TableCell>
                                                    </TableRow>
                                                    {renderExtensionDataRows()}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" align="center" gutterBottom><strong>Student Information</strong></Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {renderStudentInfoRows()}
                                                    <TableRow>
                                                        <TableCell><strong>QR CODE</strong></TableCell>
                                                        <TableCell><img src={responseData.qr_code} alt="QR Code" style={{ maxWidth: '100px', marginTop: '10px' }} /></TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>Opsional</Typography>
                                </Grid>
                                <FormControlLabel
                                    control={<Checkbox checked={printReceipt} onChange={handlePrintReceiptChange} />}
                                    label="Cetak Struk"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={sendEmail} onChange={handleSendEmailChange} />}
                                    label="Kirim Struk via Email"
                                />
                                {sendEmail && (
                                    <TextField
                                        id="email"
                                        label="Alternative Email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        variant="outlined"
                                        fullWidth // Membuat input email memenuhi lebar container
                                        style={{ marginTop: '10px', marginBottom: '20px' }} // Menambahkan jarak antara input dan tombol
                                        InputProps={{
                                            // Menambahkan gaya untuk input
                                            style: { backgroundColor: 'whitesmoke' } // Misalnya, warna latar belakang putih asap
                                        }}
                                    />
                                )}

                            </Grid>
                            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                                <Button variant="contained" color="primary" onClick={() => handlePrint()}>Selesai</Button>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Container>
        </MainContainer>
    );
};

export default ReceiptExtensionPage;
