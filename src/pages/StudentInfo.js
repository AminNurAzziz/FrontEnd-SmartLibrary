import React, { useState, useEffect, } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button, CardMedia, CircularProgress, } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Header from './HeaderNavigation';
import illustrationImage from '../assets/logo/library.png';
import { useNavigate } from 'react-router-dom';

import SearchBookModal from './SearchBookModal';
import BookDetailModal from './DetailBookModal';
import QRScannerModal from './QRScannerModal';
import { extend } from 'jquery';

const StudentInfo = () => {
    const location = useLocation();
    const { studentData, borrowedBooks, login, regulationData } = location?.state || {};
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDetailBookModalOpen, setIsDetailBookModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const handleExtendBookThePass = (bookId) => {
        // Lakukan logika perpanjangan buku di sini
        console.log("Perpanjang buku dengan ID:", bookId);
        // Kemudian arahkan pengguna kembali ke halaman utama
        navigate('/');
    };

    const handleSearch = (searchTerm) => {
        setSelectedBook(searchTerm);
        setIsDetailBookModalOpen(true);
        setIsSearchModalOpen(false);
    };

    const handleSelectBook = (bookData) => {
        console.log('Regulation data:', regulationData.max_loan_books);
        if (borrowedBooks.length >= regulationData.max_loan_books) {
            handleNotFound();
            setSnackbarMessage('You have reached the maximum limit of borrowed books');
        } else {
            {
                // Gunakan concat atau operator spread untuk menggabungkan hasil pencarian baru dengan yang sudah ada
                setSearchResults((prevSearchResults) => prevSearchResults.concat(bookData));
                setIsDetailBookModalOpen(false);
            }
        }
    };

    const handleNotFound = () => {
        setNotFound(!notFound);
        setSnackbarMessage('Book not found. Please try again.');
    };
    const handleRemoveBook = (bookId) => {
        setSearchResults((prevSearchResults) => prevSearchResults.filter((book) => book.id !== bookId));
    };

    const handleModalQR = () => {
        setIsQRModalOpen(true);
    };

    const handleModalClose = () => {
        setIsQRModalOpen(false);
    };


    // const handleBorrowBooks = () => {
    //     setLoading(true);
    //     // Lakukan permintaan POST ke URL API
    //     fetch('https://202.10.36.225/api/peminjaman-buku', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'nim': '2141762034' // Tambahkan header nim
    //         },
    //         body: JSON.stringify({
    //             buku_pinjam: searchResults.map((book) => ({ kode_buku: book.book_code })) // Ambil kode buku dari searchResults
    //         })
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data && data.message) {
    //                 navigate('/borrow-receipt', { replace: true, state: { receiptData: data } });
    //             } else {
    //                 console.error('Invalid data format:', data);
    //             }

    //         })
    //         .catch((error) => {
    //             console.error('Error:', error);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // };





    const handleBorrowBooks = () => {
        setLoading(true);

        const reserveBooks = searchResults.filter(book => book.action === 'Reserve');
        const borrowBooks = searchResults.filter(book => book.action === 'Borrow');
        console.log('Cek reserveBooks:', searchResults);
        const requests = [];

        if (reserveBooks.length > 0) {
            const reservationData = reserveBooks.map((book) => ({ book_code: book.book_code, max_reserve_days: regulationData.max_reserve_days }));
            requests.push(
                fetch('https://202.10.36.225/api/reservasi-buku', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'nim': studentData.nim // Tambahkan header nim
                    },
                    body: JSON.stringify({
                        book_reservation: reservationData
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to reserve books');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Reservation Response:', data); // Log respons
                        return data; // Mengembalikan respons JSON
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        return { error: "Failed to reserve books" }; // Mengembalikan respons error
                    })
            );
        }


        if (borrowBooks.length > 0) {
            requests.push(
                fetch('https://202.10.36.225/api/peminjaman-buku', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'nim': studentData.nim // Tambahkan header nim
                    },
                    body: JSON.stringify({
                        buku_pinjam: borrowBooks.map((book) => ({ kode_buku: book.book_code, extended: book.extended || false, max_loan_days: regulationData.max_loan_days })) // Ambil kode buku dari searchResults
                    })
                }).then(response => response.json())
                    .catch(error => {
                        console.error('Error:', error);
                        return { message: "Borrowing error" }; // Mengembalikan respons kesalahan untuk peminjaman
                    })
            );
        }

        Promise.all(requests)
            .then(responses => {
                console.log('Responses:', responses);

                const combinedData = {
                    message: "Peminjaman berhasil",
                    student: {},
                    borrowed_data: [],
                    borrowed_books: [],
                    qr_code: []
                };

                responses.forEach(response => {
                    console.log('Responseeeee:', response.student);
                    combinedData.student = response.student;
                    if (response.message === "Peminjaman berhasil") {
                        combinedData.borrowed_data.push(...response.borrowed_data);
                        combinedData.borrowed_books.push(...response.borrowed_books);
                        combinedData.qr_code.push(...response.qr_code);
                    } else if (response.message === "Reservation successful") {
                        response.reservation_data.forEach(data => {
                            combinedData.borrowed_data.push({
                                student: data.student,
                                borrowed_code: data.reserved_books,
                                borrowed_date: data.reservation_date,
                                return_date: data.reservation_pickup_date,
                                status: data.reservation_status
                            });
                        });
                        response.reserved_books.forEach(book => {
                            combinedData.borrowed_books.push({
                                book_code: book.book_code,
                                isbn: book.isbn,
                                book_title: book.book_title,
                                book_author: book.book_publisher // Assuming publisher as author for consistency
                            });
                        });
                        combinedData.qr_code.push(...response.qr_code);
                    }
                });
                console.log('Combined data:', combinedData.student);
                navigate('/borrow-receipt', { replace: true, state: { receiptData: combinedData } });
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }


    const handleExtendBook = (bookId) => {
        setSearchResults((prevSearchResults) =>
            prevSearchResults.map((book) => {
                if (book.id === bookId && !book.extended) { // Periksa apakah buku belum pernah diperpanjang
                    // Hitung tanggal pengembalian yang diperpanjang
                    const extendedReturnDate = new Date(new Date(book.return_date).getTime() + book.max_loan_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    // Perbarui tanggal pengembalian buku dan tandai buku sebagai sudah diperpanjang
                    return { ...book, return_date: extendedReturnDate, extended: true };
                }
                return book;
            })
        );
    };



    useEffect(() => {
        if (!login || !location.state) {
            navigate('/');
        }
    }, [login, navigate]);

    useEffect(() => {
        // console.log('Selected book:', selectedBook);
        // console.log('Search results:', searchResults);
    }, [selectedBook]);

    return (
        <main>
            <Header />
            <Container sx={{ mt: 4 }}>
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

                                                disabled: true
                                            }}
                                            onClick={() => { handleModalQR() }}
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
                                            onClick={() => setIsSearchModalOpen(true)}
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
                                        <Typography variant="h6"><b>{studentData.nim}</b></Typography>
                                        <Typography variant="h6"><b>NIM</b></Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Second Vertical Card */}
                            <Grid item>
                                <Card>
                                    <CardContent sx={{ backgroundColor: '#faf5e6' }}>
                                        <Typography variant="h6">{studentData.major}</Typography>
                                        <Typography variant="h6"><b>Major</b></Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Third Vertical Card */}
                            <Grid item>
                                <Card>
                                    <CardContent sx={{ backgroundColor: '#e6f8fa' }}>
                                        <Typography variant="h6">{studentData.class}</Typography>
                                        <Typography variant="h6"><b>Class</b></Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {borrowedBooks && borrowedBooks.length >= 0 && (
                    <TableContainer sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom align="center" sx={{ color: '#0f1f40', mb: 2 }}>Borrowed Books</Typography>
                        <Table sx={{ backgroundColor: '#ffffff', border: '2px solid #e6f2ff', borderRadius: '40px' }}>
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
                                {borrowedBooks.map((book, index) => renderBorrowedBook(book, index, regulationData, handleExtendBookThePass))}

                            </TableBody>
                            <TableBody>
                                {searchResults.map((bookDatas, index) => renderSearchBook(bookDatas, index, handleRemoveBook, handleExtendBook))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
            <SearchBookModal open={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} onSearch={handleSearch} notFound={handleNotFound} />
            <BookDetailModal open={isDetailBookModalOpen} onClose={() => setIsDetailBookModalOpen(false)} bookData={selectedBook && selectedBook[0]} onSelect={handleSelectBook} />
            <QRScannerModal open={isQRModalOpen} onSearch={handleSearch} notFound={handleNotFound} onClose={handleModalClose} />

            <Button
                variant="contained"
                sx={{ mb: 4, mt: 1 }}
                onClick={handleBorrowBooks}
                disabled={searchResults.length === 0}
            >
                Pinjam Buku
            </Button>
            {loading && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: 9999 }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <CircularProgress color="inherit" />
                        <Typography variant="body1" style={{ marginTop: '16px', color: '#333' }}>Sedang memproses peminjaman buku...</Typography>
                    </div>
                </div>
            )}
            <Snackbar
                open={notFound}
                autoHideDuration={6000}
                onClose={() => setNotFound(false)} // Ubah notFound menjadi false saat snackbar ditutup
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert elevation={6} variant="filled" onClose={() => setNotFound(false)} severity="error">
                    {snackbarMessage} {/* Gunakan snackbarMessage sebagai isi snackbar */}
                </MuiAlert>
            </Snackbar>
        </main >
    );
};

const renderBorrowedBook = (book, index, regulationData, handleExtendBookThePass) => {
    const borrowDate = new Date(book.borrow_date);
    const returnDate = new Date(book.return_date);
    const max_loan_days = regulationData.max_loan_days;

    // Calculate the range in milliseconds
    const rangeInMilliseconds = returnDate.getTime() - borrowDate.getTime();

    // Convert milliseconds to days
    const rangeInDays = Math.ceil(rangeInMilliseconds / (1000 * 60 * 60 * 24));

    // console.log('Range in days:', rangeInDays);
    // console.log('Max loan days:', max_loan_days);

    // Check if the book can be extended
    const isExtendDisabled = rangeInDays > max_loan_days;

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
                    onClick={() => handleExtendBookThePass(book.borrow_id)}
                >
                    Extend
                </Button>
            </TableCell>
        </TableRow>
    );
};

const renderSearchBook = (bookDatas, index, handleRemoveBook, handleExtendBook) => {
    console.log('Book data:', bookDatas);
    return (
        <TableRow key={index}>
            <TableCell>{bookDatas.book_title}</TableCell>
            <TableCell>{bookDatas.borrow_date}</TableCell>
            <TableCell>{bookDatas.return_date}</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveBook(bookDatas.id)}
                    sx={{ mr: 2 }}
                >
                    Remove
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleExtendBook(bookDatas.id)}
                    disabled={bookDatas.action === 'Reserve'}
                >
                    Extend
                </Button>
            </TableCell>
        </TableRow >
    );
};




export default StudentInfo;
