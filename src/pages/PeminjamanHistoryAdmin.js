import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap'; // Import Pagination component
import SidebarAdmin from './SideBarAdmin';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

function HistoryPeminjamanList() {
    const [historyPeminjaman, setHistoryPeminjaman] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [deleteBorrowingCode, setDeleteBorrowingCode] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page

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

    const handleDeleteConfirmed = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/history-peminjaman/${deleteBorrowingCode}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete borrowing record');
            }

            // Remove the row with the corresponding borrowing code from the state
            const updatedHistoryPeminjaman = historyPeminjaman.filter(row => row.borrowing_code !== deleteBorrowingCode);
            setHistoryPeminjaman(updatedHistoryPeminjaman);

            // Close the confirmation modal
            setConfirmModalOpen(false);

            // Set Snackbar state
            setSnackbarMessage('Borrowing record successfully deleted');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting borrowing record:', error);
        }
    };

    const handleEdit = (borrowingCode) => {
        // Logic to handle edit
        console.log("Edit:", borrowingCode);
    };

    const handleDelete = (borrowingCode) => {
        console.log("Delete:", borrowingCode);
        setDeleteBorrowingCode(borrowingCode);
        setConfirmModalOpen(true);
    };

    // Function to filter borrowing history based on search term and filter value
    const filteredHistoryPeminjaman = historyPeminjaman.filter((row) => {
        if (filterValue === 'all' || row.status === filterValue) {
            return row.nim.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
    });

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHistoryPeminjaman.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
                        {/* <h1 className="h3 mb-2 text-gray-800">Tables</h1> */}
                        {/* <p className="mb-4">Borrowing Datas </p> */}
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
                                            {currentItems.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.nim}</td>
                                                    <td>{row.book_title}</td>
                                                    <td>{row.borrowing_code}</td>
                                                    <td>{row.borrowing_date}</td>
                                                    <td>{row.return_date}</td>
                                                    <td>{row.status}</td>
                                                    <td>
                                                        {/* <button onClick={() => handleEdit(row.borrowing_code)} className="btn btn-primary">
                    Edit
                </button> */}
                                                        <button onClick={() => handleDelete(row.borrowing_code)} className="btn btn-danger ml-2">
                                                            <DeleteIcon />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                                <Pagination>
                                    <Pagination.First onClick={() => paginate(1)} />
                                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                    {/* Render a subset of page numbers */}
                                    {Array.from({ length: Math.min(5, Math.ceil(filteredHistoryPeminjaman.length / itemsPerPage)) }).map((_, index) => {
                                        const page = index + 1;
                                        // Adjust current page number to display based on the position of the current page
                                        let displayPage;
                                        if (currentPage <= 3) {
                                            displayPage = page;
                                        } else if (currentPage >= Math.ceil(filteredHistoryPeminjaman.length / itemsPerPage) - 2) {
                                            displayPage = Math.ceil(filteredHistoryPeminjaman.length / itemsPerPage) - 4 + page;
                                        } else {
                                            displayPage = currentPage - 2 + page;
                                        }
                                        return (
                                            <Pagination.Item
                                                key={displayPage}
                                                onClick={() => paginate(displayPage)}
                                                active={displayPage === currentPage}
                                            >
                                                {displayPage}
                                            </Pagination.Item>
                                        );
                                    })}
                                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredHistoryPeminjaman.length / itemsPerPage)} />
                                    <Pagination.Last onClick={() => paginate(Math.ceil(filteredHistoryPeminjaman.length / itemsPerPage))} />
                                </Pagination>
                            </div>

                        </div>
                    </div>
                    <Modal show={confirmModalOpen} onHide={() => setConfirmModalOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this borrowing record?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteConfirmed()}>
                                Yes, Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="success">
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>

                </div>
            </div>
        </div>
    );
}

export default HistoryPeminjamanList;
