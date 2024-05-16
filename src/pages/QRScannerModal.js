import React, { useRef, useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { CircularProgress, Snackbar, Modal, Backdrop, Fade } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';

const QRScannerModal = ({ open, onClose, onSearch, notFound }) => {
    const videoRef = useRef(null);
    const [scanResult, setScanResult] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [showBorder, setShowBorder] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setScanResult('');
        onClose();
    };

    useEffect(() => {
        let scanner;

        const startScanner = () => {
            if (videoRef.current) {
                scanner = new QrScanner(videoRef.current, async (result) => {
                    setIsLoading(true);
                    setScanResult(result);
                    try {
                        const bookResponse = await fetch(`http://127.0.0.1:8000/api/buku?kode=${result}`);
                        // const bookResponse = await fetch(`http://127.0.0.1:8000/api/buku?kode=1183614683`);
                        if (!bookResponse.ok) {
                            throw new Error('Network response for book search was not ok');
                        }
                        const bookData = await bookResponse.json();
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
                            stock: book.bookData.stock,
                            publisher: book.bookData.publisher,
                            borrow_date: new Date().toISOString().split('T')[0],
                            return_date: new Date(Date.now() + book.regulationData.max_loan_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            max_loan_days: book.regulationData.max_loan_days,
                            action: book.bookData.stock > 0 ? 'Borrow' : 'Reserve'
                        }));
                        onSearch(formattedBooks);
                        handleClose();
                    }
                    catch (error) {
                        notFound();
                        handleClose();
                    }
                    finally {
                        setIsLoading(false);
                    }
                });

                scanner.start().catch(err => console.error('Scanner start error:', err));
            } else {
                console.error('Video element not found');
            }
        };

        if (open) {
            setIsScanning(true);
            setShowBorder(true);
            setTimeout(startScanner, 100); // Delay to ensure video element is mounted
        }

        return () => {
            if (scanner) {
                scanner.stop();
            }
        };
    }, [open]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div>
                        <div className="qr-scanner-container" style={{ marginTop: '200px', textAlign: 'center' }}>
                            {isLoading && (
                                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: 9999 }}>
                                    <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} color="inherit" />
                                </div>
                            )}

                            <div className="video-container" style={{ display: showBorder ? 'block' : 'none' }}>
                                <video ref={videoRef} className="video" autoPlay playsInline muted style={{
                                    width: '100%', maxWidth: '420px', height: '320px', border: showBorder ? '10px solid #1A5662' : 'none',
                                    borderRadius: '10px',
                                }}></video>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="error">
                    {message}. Please try again.
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default QRScannerModal;
