import React, { useState } from 'react';
import SidebarAdmin from './SideBarAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';

const DashboardPage = () => {
    // Data dashboard
    const dashboardData = {
        total_student_borrow: 200,
        total_borrowing: 300,
        total_book_available: 500,
        total_fine: 50,
        monthly_borrowing_trend: [
            { month: 'Jan', borrow_count: 50 },
            { month: 'Feb', borrow_count: 70 },
            { month: 'Mar', borrow_count: 90 },
            { month: 'Apr', borrow_count: 80 },
            { month: 'May', borrow_count: 120 },
            { month: 'Jun', borrow_count: 100 },
            { month: 'Jul', borrow_count: 110 },
            { month: 'Aug', borrow_count: 130 },
            { month: 'Sep', borrow_count: 150 },
            { month: 'Oct', borrow_count: 160 },
            { month: 'Nov', borrow_count: 170 },
            { month: 'Dec', borrow_count: 200 }
        ]
    };

    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];
    const [isMonthlyChartVisible, setIsMonthlyChartVisible] = useState(true);
    const [isPieChartVisible, setIsPieChartVisible] = useState(true);

    return (
        <div id="wrapper">
            <SidebarAdmin />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <h1 className="h4 mb-0 text-gray-800">Dashboard</h1>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown no-arrow">
                                <button className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">Admin</span>
                                    <img className="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60" alt="profile" />
                                </button>
                                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                    aria-labelledby="userDropdown">
                                    <button className="dropdown-item" href="#">
                                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Profile
                                    </button>
                                    <button className="dropdown-item" href="#">
                                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Settings
                                    </button>
                                    <button className="dropdown-item" href="#">
                                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Activity Log
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Logout
                                    </button>
                                </div>
                            </li>
                        </ul>

                    </nav>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Student Borrow</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.total_student_borrow}</div>
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
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.total_borrowing}</div>
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
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.total_book_available}</div>
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
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.total_fine}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
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
                                                        data={dashboardData.monthly_borrowing_trend}
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
                            <div className="col-lg-5 mb-4">
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Pie Chart Example</h6>
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
                                                            dataKey="value"
                                                            isAnimationActive={false}
                                                            data={data}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            label
                                                        />
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <hr />
                                            Styling for the Pie Chart can be adjusted in a similar way to match the SB Admin template.
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
