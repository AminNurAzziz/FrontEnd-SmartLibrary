import React, { useState } from 'react';
import SidebarAdmin from './SideBarAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component

const DashboardPage = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const [dashboardDatas, setDashboardDatas] = useState(null);
    const generateRandomColor = () => {
        const colors = ["#f6c23e", "#1cc88a", "#20c9a6", "#36b9cc"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };



    useEffect(() => {
        // Check if token exists in local storage
        const token = localStorage.getItem('token');
        if (!token && !localStorage.getItem('role')) {
            // Redirect to login page
            navigate('/login');
        }
        const isFirst = localStorage.getItem('isFirstLogin');
        if (isFirst === 'true') {
            console.log('First login' + isFirst);
            // Jika pengguna baru saja login, maka tampilkan snackbar
            handleLoginSuccess();
            // Set isFirstLogin menjadi false agar snackbar tidak muncul lagi di masa mendatang
            localStorage.setItem('isFirstLogin', 'false');
        }
        fetchDataDashboard();
    }, []);

    const fetchDataDashboard = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/dashboard');
            if (response.ok) {
                const data = await response.json();
                setDashboardDatas(data.data);
            } else {
                console.error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };


    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleLoginSuccess = () => {
        setOpenSnackbar(true);
    };



    const [isMonthlyChartVisible, setIsMonthlyChartVisible] = useState(true);
    const [isPieChartVisible, setIsPieChartVisible] = useState(true);

    return (
        <div id="wrapper">
            <SidebarAdmin />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Navbar setSearchTerm={() => { }} />
                    <div className="container-fluid">
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleSnackbarClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MuiAlert onClose={handleSnackbarClose} severity="success" elevation={6} variant="filled">
                                Successfully logged in!
                            </MuiAlert>
                        </Snackbar>
                        {dashboardDatas && (
                            <div className="row">
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-primary shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Student Borrow</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardDatas.total_student_borrow}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-success shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Borrowing</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardDatas.total_borrowing}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-info shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Book Available</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardDatas.total_book_available}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-warning shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Fine</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardDatas.total_fine}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row">
                            {dashboardDatas && dashboardDatas.monthly_borrowing_trend && (
                                <div className="col-lg-7 mb-4">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Monthly Borrowing Trend</h6>
                                            <button
                                                className="btn btn-link btn-sm"
                                                onClick={() => setIsMonthlyChartVisible(!isMonthlyChartVisible)}
                                            >
                                                {isMonthlyChartVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                            </button>
                                        </div>
                                        {isMonthlyChartVisible && (
                                            <div className="card-body">
                                                <div className="chart-area">
                                                    <ResponsiveContainer width="100%" height={320}>
                                                        <BarChart
                                                            data={dashboardDatas.monthly_borrowing_trend}
                                                            margin={{ top: 20, right: 30, left: 20 }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="month" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Legend />
                                                            <Bar dataKey="borrow_count" fill="#4e73df" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <hr />
                                                The Monthly Borrowing Trend is
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {dashboardDatas && dashboardDatas.four_books_most_borrowed && (
                                <div className="col-lg-5 mb-4">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Most Borrowed Books</h6>
                                            <button
                                                className="btn btn-link btn-sm"
                                                onClick={() => setIsPieChartVisible(!isPieChartVisible)}
                                            >
                                                {isPieChartVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                            </button>
                                        </div>
                                        {isPieChartVisible && (
                                            <div className="card-body">
                                                <div className="chart-pie">
                                                    <ResponsiveContainer width="100%" height={300}>

                                                        <PieChart>
                                                            <Pie
                                                                dataKey="borrow_count"
                                                                isAnimationActive={false}
                                                                data={dashboardDatas.four_books_most_borrowed}
                                                                cx="50%"
                                                                cy="50%"
                                                                outerRadius={80}
                                                                label={({ book_title }) => `${book_title}`}
                                                            >
                                                                {dashboardDatas.four_books_most_borrowed.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={generateRandomColor()} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip formatter={(value) => [value]} />
                                                        </PieChart>

                                                    </ResponsiveContainer>
                                                </div>
                                                <hr />
                                                The Most Borrowed Books are
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
