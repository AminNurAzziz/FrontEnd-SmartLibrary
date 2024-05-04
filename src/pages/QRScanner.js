import React, { useRef, useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Typography, Snackbar, } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from './HeaderScanner';

// Set WORKER_PATH to the relative path of qr-scanner-worker.min.js
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js'; // Add a leading slash to the path

const QRScanner = () => {
    const videoRef = useRef(null);
    const [scanResult, setScanResult] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [regulationData, setRegulationData] = useState(null);
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [showResetButton, setShowResetButton] = useState(false);
    const [showBorder, setShowBorder] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for loading page
    const [notFound, setNotFound] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isScanning) {
            setShowResetButton(true); // Show the reset button when scanning starts
            setShowBorder(true); // Show the border when scanning starts

            const scanner = new QrScanner(videoRef.current, async (result) => {
                setIsLoading(true); // Set loading state to true when fetching data
                setScanResult(result);
                try {
                    const headers = new Headers();
                    headers.append('NIM', result);
                    let responsePeminjaman = null;
                    let response = null;
                    let responseRegulation = null;
                    let responseReservasi = null;

                    if (result.startsWith('KD-P')) {
                        responsePeminjaman = await fetch('http://127.0.0.1:8000/api/pengembalian-buku/KD-P1183614683p3v', {
                            method: 'GET',
                        });

                        if (responsePeminjaman.ok) {
                            const data = await responsePeminjaman.json();

                            setTimeout(() => {
                                setIsLoading(false);
                                navigate('/get-loan', { state: { dataPeminjaman: data } });
                            }, 1000); // Set the duration of loading here (in milliseconds)

                        } else {
                            setMessage('Data borrowed books not found');
                            setNotFound(true);
                            setIsLoading(false);
                            setOpenSnackbar(true);
                            console.error('Error fetching borrowed books:', responsePeminjaman.statusText);
                        }

                    } else if (!isNaN(result)) {
                        response = await fetch('http://127.0.0.1:8000/api/student', {
                            method: 'GET',
                            headers: headers
                        });

                        responseRegulation = await fetch('http://127.0.0.1:8000/api/regulation', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });


                        if (response.ok && responseRegulation.ok) {
                            const data = await response.json();
                            const regulation = await responseRegulation.json();
                            setStudentData(data.student);
                            setBorrowedBooks(data.borrowed_data);
                            setRegulationData(regulation);


                            setTimeout(() => {
                                setIsLoading(false);
                                navigate('/student', { state: { studentData: data.student, borrowedBooks: data.borrowed_data, login: true, regulationData: regulation } });
                            }, 1000); // Set the duration of loading here (in milliseconds)

                        } else {
                            setMessage('Data student not found');
                            setNotFound(true);
                            setIsLoading(false);
                            setOpenSnackbar(true);
                        }
                    } else if (result.startsWith('KD-R')) {
                        responseReservasi = await fetch('http://127.0.0.1:8000/api/reservasi-buku/KD-R1183614683xXj', {
                            method: 'GET',
                        });

                        if (responseReservasi.ok) {
                            const data = await responseReservasi.json();
                            setBorrowedBooks(data);

                            setTimeout(() => {
                                setIsLoading(false);
                                navigate('/get-reserve', { state: { dataReservasi: data } });
                            }, 1000); // Set the duration of loading here (in milliseconds)


                        } else {
                            setMessage('Data reserved books not found');
                            setNotFound(true);
                            setIsLoading(false);
                            setOpenSnackbar(true);
                            console.error('Error fetching student info:', responseReservasi.statusText);
                        }

                    } else {
                        setMessage('Data not found');
                        setNotFound(true);
                        setIsLoading(false);
                        setOpenSnackbar(true);
                        console.error('Error fetching student info:', response.statusText);

                    }
                } catch (error) {
                    console.error('Error fetching student info:', error);
                }
                scanner.stop();
                setIsScanning(false); // Set scanning state to false after stopping
            });

            scanner.start();

            // Cleanup function
            return () => {
                scanner.stop();
            };
        } else {
            setShowResetButton(false); // Hide the reset button when scanning stops
        }
    }, [isScanning, navigate]);

    const handleScan = () => {
        setIsScanning(true); // Set scanning state to true when starting scan
        setNotFound(false); // Reset notFound state to false when starting scan
    };

    const handleReset = () => {
        setIsScanning(false); // Set scanning state to false when resetting
        setScanResult(''); // Clear scan result when resetting
        setShowBorder(false); // Hide the border when resetting
    };


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <main>
            <Header />
            <div className="qr-scanner-container" style={{ marginTop: '50px', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ textTransform: 'capitalize', color: 'black', fontWeight: '550', marginBottom: '1rem' }}>
                    Please scan your KTM!
                </Typography>
                <Typography mt={3} mb={3} variant="body2" sx={{ color: 'GrayText' }}>
                    Scan to start borrowing available books
                </Typography>

                {isLoading && ( // Render CircularProgress if loading

                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: 9999 }}>
                        <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} color="inherit" />
                    </div>

                )}

                {!notFound && !isLoading && (
                    <div className="video-container" style={{ display: showBorder ? 'block' : 'none' }}>
                        <video ref={videoRef} className="video" autoPlay playsInline muted style={{
                            width: '100%', maxWidth: '420px', height: '320px', border: showBorder ? '10px solid #1A5662' : 'none',
                            borderRadius: '10px',
                        }}></video>
                    </div>
                )}


                <Button
                    onClick={showResetButton ? handleReset : handleScan}
                    variant="contained"
                    color={showResetButton ? 'error' : 'primary'}
                    style={{
                        backgroundColor: '#0f1f40',
                        color: '#fff',
                        textTransform: 'none', // Disable capitalization
                        fontWeight: 'bold',
                        marginTop: '-0.5rem',
                        border: '1px solid #fff',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        zIndex: 1,
                    }}
                >
                    {showResetButton ? 'Reset' : 'Get Started'}
                </Button>

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

            </div>
        </main >
    );
};

export default QRScanner;
