import React, { useEffect, useState } from 'react';
import SidebarAdmin from './SideBarAdmin';

function HistoryPeminjamanList() {
    const [historyPeminjaman, setHistoryPeminjaman] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('all');

    useEffect(() => {
        fetchHistoryPeminjaman();
    }, []);

    const fetchHistoryPeminjaman = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/allhistory-peminjaman');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setHistoryPeminjaman(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data');
        }
    };

    const handleEdit = (borrowingCode) => {
        // Logika untuk menangani edit
        console.log("Edit:", borrowingCode);
    };

    const handleDelete = (borrowingCode) => {
        // Logika untuk menangani delete
        console.log("Delete:", borrowingCode);
    };

    // Fungsi untuk memfilter riwayat peminjaman berdasarkan kata kunci pencarian dan nilai filter
    const filteredHistoryPeminjaman = historyPeminjaman.filter((row) => {
        if (filterValue === 'all' || row.status === filterValue) {
            return row.nim.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
    });

    return (
        <div id="wrapper">
            <SidebarAdmin />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <form className="form-inline">
                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"></i>
                            </button>
                        </form>
                        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input
                                    className="form-control bg-light border-0 small"
                                    placeholder="Search for..."
                                    aria-label="Search"
                                    aria-describedby="basic-addon2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
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
                        <h1 className="h3 mb-2 text-gray-800">Tables</h1>
                        <p className="mb-4">DataTables is a third party plugin that is used to generate the demo table below.
                            For more information about DataTables, please visit the <a target="_blank"
                                href="https://datatables.net">official DataTables documentation</a>.</p>
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Data Peminjaman</h6>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th>NIM</th>
                                                <th>Judul Buku</th>
                                                <th>Kode Peminjaman</th>
                                                <th>Tanggal Peminjaman</th>
                                                <th>Tanggal Pengembalian</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredHistoryPeminjaman.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.nim}</td>
                                                    <td>{row.book_title}</td>
                                                    <td>{row.borrowing_code}</td>
                                                    <td>{row.borrowing_date}</td>
                                                    <td>{row.return_date}</td>
                                                    <td>{row.status}</td>
                                                    <td>
                                                        <button onClick={() => handleEdit(row.borrowing_code)} className="btn btn-primary">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(row.borrowing_code)} className="btn btn-danger ml-2">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryPeminjamanList;
