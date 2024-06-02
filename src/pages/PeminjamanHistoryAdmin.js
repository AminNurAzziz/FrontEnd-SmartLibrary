import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import SidebarAdmin from './SideBarAdmin';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


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
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState(''); // Define sortColumn state
    const [sortOrder, setSortOrder] = useState('asc'); // Define sortOrder state
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && !localStorage.getItem('role')) {
            navigate('/login');
        }
        const isFirst = localStorage.getItem('isFirstLogin');
        if (isFirst === 'true') {
            localStorage.setItem('isFirstLogin', 'false');
        }
        fetchHistoryPeminjaman();
    }, []);

    const fetchHistoryPeminjaman = async () => {
        try {
            const response = await fetch('https://202.10.36.225/api/allhistory-peminjaman');
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
            const response = await fetch(`https://202.10.36.225/api/history-peminjaman/${deleteBorrowingCode}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete borrowing record');
            }

            const updatedHistoryPeminjaman = historyPeminjaman.filter(row => row.borrowing_code !== deleteBorrowingCode);
            setHistoryPeminjaman(updatedHistoryPeminjaman);

            setConfirmModalOpen(false);

            setSnackbarMessage('Borrowing record successfully deleted');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting borrowing record:', error);
        }
    };

    const handleEdit = (borrowingCode) => {
        console.log("Edit:", borrowingCode);
    };

    const handleDelete = (borrowingCode) => {
        console.log("Delete:", borrowingCode);
        setDeleteBorrowingCode(borrowingCode);
        setConfirmModalOpen(true);
    };

    const handleSort = (key) => {
        // If the same key is clicked again, reverse the sorting order
        if (key === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(key);
            setSortOrder('asc');
        }
    };

    const sortData = (data) => {
        if (sortColumn) {
            const sorted = data.sort((a, b) => {
                if (a[sortColumn] < b[sortColumn]) {
                    return sortOrder === 'asc' ? -1 : 1;
                }
                if (a[sortColumn] > b[sortColumn]) {
                    return sortOrder === 'asc' ? 1 : -1;
                }
                return 0;
            });
            return sorted;
        }
        return data;
    };

    const filteredHistoryPeminjaman = historyPeminjaman.filter((row) => {
        if (filterValue === 'all' || row.status === filterValue) {
            return row.borrowing_code.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
    });

    const sortedData = sortData(filteredHistoryPeminjaman);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(historyPeminjaman);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "HistoryPeminjaman");
        XLSX.writeFile(workbook, "HistoryPeminjaman.xlsx");
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const title = "Laporan Data Peminjaman";
        const date = new Date().toLocaleDateString();

        // Add title
        doc.setFontSize(18);
        doc.text(title, pageWidth / 2, 20, { align: 'center' });

        // Add date
        doc.setFontSize(12);
        doc.text(`Tanggal: ${date}`, pageWidth - 20, 30, { align: 'right' });

        // Add a line break
        doc.setLineWidth(0.5);
        doc.line(10, 35, pageWidth - 10, 35);

        // Add table
        const tableData = historyPeminjaman.map(row => [
            row.nim,
            row.book_title,
            row.borrowing_code,
            row.borrowing_date,
            row.return_date,
            row.status
        ]);

        doc.autoTable({
            head: [['NIM', 'Judul Buku', 'Kode Peminjaman', 'Tanggal Peminjaman', 'Tanggal Pengembalian', 'Status']],
            body: tableData,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 3 }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }

        doc.save('HistoryPeminjaman.pdf');
    };


    return (
        <div id="wrapper">
            <SidebarAdmin />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Navbar setSearchTerm={setSearchTerm} />
                    <div className="container-fluid">
                        <div className="card shadow mb-4">
                            <div className="card-header py-2 d-flex justify-content-between align-items-center" style={{ height: '60px' }}>
                                <h6 className="m-0 font-weight-bold text-primary">Data Peminjaman</h6>
                                <div>
                                    <Button variant="success" onClick={downloadExcel} style={{ float: 'right' }}>
                                        Download Excel
                                    </Button>
                                    <Button variant="danger" onClick={downloadPDF} style={{ float: 'right', marginRight: '10px' }}>
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">

                                    <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('nim')}>
                                                    NIM
                                                    {sortColumn === 'nim' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('book_title')}>
                                                    Judul Buku
                                                    {sortColumn === 'book_title' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('borrowing_code')}>
                                                    Kode Peminjaman
                                                    {sortColumn === 'borrowing_code' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('borrowing_date')}>
                                                    Tanggal Peminjaman
                                                    {sortColumn === 'borrowing_date' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('return_date')}>
                                                    Tanggal Pengembalian
                                                    {sortColumn === 'return_date' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('status')}>
                                                    Status
                                                    {sortColumn === 'status' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
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
                                    {Array.from({ length: Math.min(5, Math.ceil(sortedData.length / itemsPerPage)) }).map((_, index) => {
                                        const page = index + 1;
                                        let displayPage;
                                        if (currentPage <= 3) {
                                            displayPage = page;
                                        } else if (currentPage >= Math.ceil(sortedData.length / itemsPerPage) - 2) {
                                            displayPage = Math.ceil(sortedData.length / itemsPerPage) - 4 + page;
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
                                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)} />
                                    <Pagination.Last onClick={() => paginate(Math.ceil(sortedData.length / itemsPerPage))} />
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