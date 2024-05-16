import React, { useEffect } from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BookDetailModal = ({ open, onClose, bookData, onSelect }) => {
    const handleClose = () => {
        onClose();
    };

    const handleBorrow = () => {
        // Jika bookData adalah objek tunggal, kita langsung tambahkan ke dalam array baru
        const existingBooks = bookData ? [bookData] : [];
        // Perbarui state dengan buku-buku yang sudah ada ditambah dengan buku baru
        onSelect(existingBooks);
        if (bookData && bookData.bookData) {
            // console.log("Pinjam button clicked for book:", bookData.bookData.book_title);
        }
        // Lakukan sesuatu dengan buku yang dipinjam, misalnya tambahkan ke daftar buku yang dipinjam oleh pengguna
        onClose(); // Menutup modal setelah buku dipinjam
    };


    const handleReservation = () => {
        // Jika bookData adalah objek tunggal, kita langsung tambahkan ke dalam array baru
        const existingBooks = bookData ? [bookData] : [];
        // Perbarui state dengan buku-buku yang sudah ada ditambah dengan buku baru
        onSelect(existingBooks);
        if (bookData && bookData.bookData) {
        }
        // Lakukan sesuatu dengan buku yang dipesan, misalnya tambahkan ke daftar buku yang dipesan oleh pengguna
        onClose(); // Menutup modal setelah buku dipesan
    };

    useEffect(() => {
        // console.log("Book data chanssssssssged:", bookData);
    }, [bookData]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="book-detail-modal-title"
            aria-describedby="book-detail-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%', // Membuat modal lebih lebar
                    maxWidth: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 4
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                        Book Detail
                    </Typography>
                    <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                {bookData ? (
                    <>
                        <Typography variant="body1" gutterBottom>
                            <b>Title:</b> {bookData ? bookData.book_title : 'No title'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <b>Publisher:</b> {bookData ? bookData.publisher : 'No publisher'}
                        </Typography>
                        {/* Tambahkan tombol Pinjam dan Reservasi */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleReservation}
                                disabled={bookData.stock > 0}
                                sx={{ mr: 2 }}
                            >
                                Reservasi
                            </Button>
                            <Button variant="contained" onClick={handleBorrow}

                                disabled={bookData.stock === 0}
                            >
                                Pinjam
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1" gutterBottom>
                        No book data available.
                    </Typography>
                )}
            </Box>
        </Modal >
    );
};

export default BookDetailModal;
