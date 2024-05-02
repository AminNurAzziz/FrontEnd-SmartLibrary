import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Grid, CardMedia, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './HeaderNavigation';
import illustrationImage from '../assets/logo/receipt.png';
import { useNavigate } from 'react-router-dom';

const BorrowReceiptPage = () => {
    const location = useLocation();
    const receiptData = location.state?.receiptData;
    const [printReceipt, setPrintReceipt] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    if (!receiptData) {
        return <Typography variant="h4">Data peminjaman tidak tersedia.</Typography>;
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePrintReceiptChange = () => {
        setPrintReceipt(!printReceipt);
    };

    const handleSendEmailChange = () => {
        setSendEmail(!sendEmail);
    };

    const handlePrint = () => {
        if (printReceipt) {
            window.print();
        }
        if (sendEmail) {
            // Logika untuk mengirim email
            console.log(`Mengirim struk peminjaman ke ${email} via email.`);
        }
        navigate('/borrow-confirmation', { replace: true, state: { message: 'Peminjaman' } });
    };
    return (
        <main>
            <Header />
            <Container sx={{ mt: 2 }} justifyContent="center">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={4.5}>
                        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>STRUK PEMINJAMAN</Typography>
                                <Typography variant="body2" gutterBottom>Jurusan Teknologi Informasi</Typography>
                                <Typography variant="body2" gutterBottom>Politeknik Negeri Malang</Typography>
                                <hr />
                                <div style={{ textAlign: 'left' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }} gutterBottom>Data Mahasiswa:</Typography>
                                    <Typography variant="body2" gutterBottom>NIM: {receiptData.student.nim}</Typography>
                                    <Typography variant="body2" gutterBottom>Nama Mahasiswa: {receiptData.student.student_name}</Typography>
                                    <Typography variant="body2" gutterBottom>Email: {receiptData.student.email}</Typography>
                                    <Typography variant="body2" gutterBottom>Jurusan: {receiptData.student.major}</Typography>
                                    <Typography variant="body2" gutterBottom>Kelas: {receiptData.student.class}</Typography>
                                    <Typography variant="body2" gutterBottom>Status: {receiptData.student.status}</Typography>
                                </div>
                                <hr />
                                <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'left' }} gutterBottom>Buku yang Dipinjam:</Typography>
                                {receiptData.borrowed_books.map((book, index) => (
                                    <div key={index} style={{ textAlign: 'left' }}>
                                        <Typography variant="body2" gutterBottom>Kode Buku: {book.book_code}</Typography>
                                        <Typography variant="body2" gutterBottom>ISBN: {book.isbn}</Typography>
                                        <Typography variant="body2" gutterBottom>Judul Buku: {book.book_title}</Typography>
                                        <Typography variant="body2" gutterBottom>Penulis: {book.book_author}</Typography>
                                        <hr />
                                    </div>
                                ))}
                                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left' }}>Detail Peminjaman:</Typography>
                                {receiptData.borrowed_data.map((data, index) => (
                                    <div key={index} style={{ textAlign: 'left' }}>
                                        <Typography variant="body2" gutterBottom>Kode Peminjaman: {data.borrowed_code}</Typography>
                                        <Typography variant="body2" gutterBottom>Tanggal Peminjaman: {new Date(data.borrowed_date).toLocaleDateString()}</Typography>
                                        <Typography variant="body2" gutterBottom>Tanggal Pengembalian: {data.return_date}</Typography>
                                        <Typography variant="body2" gutterBottom>Status: {data.status}</Typography>
                                        <hr />
                                    </div>
                                ))}
                                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>QR Code:</Typography>
                                <Grid container spacing={2} alignItems="center">
                                    {receiptData.qr_code.map((qr, index) => (
                                        <Grid item key={index}>
                                            <img src={qr} alt={`QR Code ${index + 1}`} style={{ maxWidth: '100px', marginTop: '10px' }} />
                                            <Typography variant="body2" gutterBottom>QR Code {index + 1}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3.8} sx={{ margin: 10, mr: 0 }} >

                        <CardMedia
                            component="img"
                            image={illustrationImage}
                            alt="Illustration"
                            sx={{ width: '100%', height: 'auto' }}
                        />


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
                </Grid>
            </Container>
        </main>
    );
};

export default BorrowReceiptPage;
