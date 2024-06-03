import React, { useRef, useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Typography, Snackbar, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Header from './HeaderScanner';

QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';

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
    const [isLoading, setIsLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');
    const [nimInput, setNimInput] = useState('');
    const [inputMethod, setInputMethod] = useState('scan'); // State for selecting input method

    useEffect(() => {
        if (isScanning) {
            setShowResetButton(true);
            setShowBorder(true);

            const scanner = new QrScanner(videoRef.current, async (result) => {
                setScanResult(result);
                handleFetchData(result);
                scanner.stop();
                setIsScanning(false);
            });

            scanner.start();

            return () => {
                scanner.stop();
            };
        } else {
            setShowResetButton(false);
        }
    }, [isScanning, navigate]);

    const handleScan = () => {
        setIsScanning(true);
        setNotFound(false);
    };

    const handleReset = () => {
        setIsScanning(false);
        setScanResult('');
        setNimInput('');
        setShowBorder(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInputChange = (event) => {
        setNimInput(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleFetchData(nimInput);
    };

    const handleFetchData = async (nim) => {
        setIsLoading(true);

        try {
            const headers = new Headers();
            headers.append('NIM', nim);
            let responsePeminjaman = null;
            let response = null;
            let responseRegulation = null;
            let responseReservasi = null;

            if (nim.startsWith('KD-P')) {
                const isAdmin = localStorage.getItem('role') === 'admin';

                if (isAdmin) {
                    responsePeminjaman = await fetch('https://202.10.36.225/api/pengembalian-buku/' + nim, {
                        method: 'GET',
                    });

                    if (responsePeminjaman.ok) {
                        const data = await responsePeminjaman.json();

                        setTimeout(() => {
                            setIsLoading(false);
                            navigate('/get-loan', { state: { dataPeminjaman: data } });
                        }, 1000);

                    } else {
                        setMessage('Data borrowed books not found');
                        setNotFound(true);
                        setIsLoading(false);
                        setOpenSnackbar(true);
                        console.error('Error fetching borrowed books:', responsePeminjaman.statusText);
                    }
                } else {
                    setMessage('You are not allowed to access this feature');
                    setNotFound(true);
                    setIsLoading(false);
                    setOpenSnackbar(true);
                }

            } else if (!isNaN(nim)) {
                response = await fetch('https://202.10.36.225/api/student', {
                    method: 'GET',
                    headers: headers
                });

                responseRegulation = await fetch('https://202.10.36.225/api/regulation', {
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
                    }, 1000);

                } else {
                    setMessage('Data student not found');
                    setNotFound(true);
                    setIsLoading(false);
                    setOpenSnackbar(true);
                }
            } else if (nim.startsWith('KD-R')) {
                responseReservasi = await fetch('https://202.10.36.225/api/reservasi-buku/' + nim, {
                    method: 'GET',
                });

                if (responseReservasi.ok) {
                    const data = await responseReservasi.json();
                    setBorrowedBooks(data);

                    setTimeout(() => {
                        setIsLoading(false);
                        navigate('/get-reserve', { state: { dataReservasi: data } });
                    }, 1000);

                } else {
                    setMessage('Data reserved books not found');
                    setNotFound(true);
                    setIsLoading(false);
                    setOpenSnackbar(true);
                    console.error('Error fetching reserved books info:', responseReservasi.statusText);
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
    };

    const handleInputMethodChange = (event, newMethod) => {
        if (newMethod !== null) {
            setInputMethod(newMethod);
            handleReset(); // Reset any active scanning or input when switching methods
        }
    };

    return (
        <main>
            <Header />
            <div className="qr-scanner-container" style={{ marginTop: '50px', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ textTransform: 'capitalize', color: 'black', fontWeight: '550', marginBottom: '1rem' }}>
                    Please scan your QR Code!
                </Typography>
                <Typography mt={3} mb={3} variant="body2" sx={{ color: 'GrayText' }}>
                    Scan or enter NIM to start borrowing available books
                </Typography>

                {isLoading && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: 9999 }}>
                        <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} color="inherit" />
                    </div>
                )}

                <ToggleButtonGroup
                    value={inputMethod}
                    exclusive
                    onChange={handleInputMethodChange}
                    aria-label="input method"
                    sx={{ marginBottom: '1rem' }}
                >
                    <ToggleButton value="scan" aria-label="scan">
                        Scan QR Code
                    </ToggleButton>
                    <ToggleButton value="manual" aria-label="manual">
                        Enter Manually
                    </ToggleButton>
                </ToggleButtonGroup>

                {inputMethod === 'scan' && (
                    !notFound && !isLoading && (
                        <div className="video-container" style={{ display: showBorder ? 'block' : 'none' }}>
                            <video ref={videoRef} className="video" autoPlay playsInline muted style={{
                                width: '100%', maxWidth: '420px', height: '320px', border: showBorder ? '10px solid #1A5662' : 'none',
                                borderRadius: '10px',
                            }}></video>
                        </div>
                    )
                )}

                {inputMethod === 'manual' && (
                    <form onSubmit={handleFormSubmit} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TextField
                            label="Enter Code"
                            variant="outlined"
                            value={nimInput}
                            onChange={handleInputChange}
                            fullWidth
                            sx={{ maxWidth: '320px', marginBottom: '1rem' }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{
                                width: '100%',
                                maxWidth: '320px',
                                backgroundColor: '#0f1f40',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                boxShadow: '0px 4px 10px rgba(15, 31, 64, 0.2)',
                                transition: 'background-color 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#0d3755', // Darken the color on hover
                                },
                            }}
                        >
                            Submit
                        </Button>
                    </form>
                )}
                {inputMethod === 'scan' && (
                    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        <Button
                            onClick={showResetButton ? handleReset : handleScan}
                            variant="contained"
                            color={showResetButton ? 'error' : 'primary'}
                            style={{
                                backgroundColor: '#0f1f40',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                border: '1px solid #fff',
                                borderRadius: '10px',
                                padding: '10px 20px',
                                zIndex: 1,
                            }}
                        >
                            {showResetButton ? 'Reset' : 'Get Started'}
                        </Button>
                    </div>
                )}


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
        </main>
    );
};

export default QRScanner;
