import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, } from '@mui/material';

const SearchBookModal = ({ open, onClose, onSearch, notFound }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    const handleSearch = async () => {
        try {
            setLoading(true); // Set loading state to true when starting the search

            // Memanggil API untuk mencari buku
            const bookResponse = await fetch(`http://127.0.0.1:8000/api/buku?kode=${searchTerm}`);
            if (!bookResponse.ok) {
                throw new Error('Network response for book search was not ok');
            }
            const bookData = await bookResponse.json();

            // Memanggil API untuk mengambil aturan peminjaman
            const regulationResponse = await fetch('http://127.0.0.1:8000/api/regulation');
            if (!regulationResponse.ok) {
                throw new Error('Network response for regulation fetch was not ok');
            }
            const regulationData = await regulationResponse.json();
            const foundBooks = [{ bookData, regulationData }];
            const formattedBooks = foundBooks.map((book) => ({
                id: book.bookData.id,
                isbn: book.bookData.isbn,
                book_code: book.bookData.book_code,
                book_title: book.bookData.book_title,
                publisher: book.bookData.publisher,
                borrow_date: new Date().toISOString().split('T')[0],
                return_date: new Date(Date.now() + book.regulationData.max_loan_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                max_loan_days: book.regulationData.max_loan_days
            }));

            console.log('Found books:', formattedBooks);
            onSearch(formattedBooks);
            handleClose();
        } catch (error) {
            notFound();
            console.error('Error searching book:', error);
        } finally {
            setLoading(false); // Reset loading state to false after the search is completed (success or error)
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="search-book-modal-title"
            aria-describedby="search-book-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    border: '2px solid #0f1f40',
                    boxShadow: 24,
                    p: 4,
                    minWidth: 300,
                    maxWidth: 500,
                    borderRadius: 2
                }}
            >
                <Typography id="search-book-modal-title" variant="h6" component="h2" align="center" sx={{ color: '#0f1f40' }} gutterBottom>
                    Search Book
                </Typography>
                <TextField
                    label="Book Code or Title"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        mb: 2,
                        '& label': { color: '#0f1f40' },
                        '& .MuiInputLabel-outlined': { color: '#0f1f40' },
                        '& .MuiInputLabel-outlined.Mui-focused': { color: '#0f1f40' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#0f1f40'
                            },
                            '&:hover fieldset': {
                                borderColor: '#0f1f40'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0f1f40'
                            }
                        }
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ mr: 1, backgroundColor: '#0f1f40', color: '#ffffff', '&:hover': { backgroundColor: '#899dc4' } }}
                    disabled={loading} // Disable the button while loading
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Find'} {/* Show loading indicator or button text */}
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{ color: '#0f1f40', borderColor: '#0f1f40', '&:hover': { backgroundColor: '#899dc4', borderColor: '#899dc4' } }}
                >
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
};

export default SearchBookModal;
