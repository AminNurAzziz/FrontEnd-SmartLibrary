import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SidebarAdmin from './SideBarAdmin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReadStudentPage = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editStudent, setEditStudent] = useState({
        nim: '',
        nama_mhs: '',
        prodi_mhs: '',
        kelas_mhs: '',
        email_mhs: '',
        status_mhs: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [deleteNim, setDeleteNim] = useState('');
    const navigate = useNavigate();
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && !localStorage.getItem('role')) {
            navigate('/login');
        }
        const isFirst = localStorage.getItem('isFirstLogin');
        if (isFirst === 'true') {
            console.log('First login' + isFirst);
            localStorage.setItem('isFirstLogin', 'false');
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://202.10.36.225/api/allstudent');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setStudents(data.data);
        } catch (error) {
            setError('Failed to fetch data');
        }
    };

    const handleEdit = (student) => {
        setEditStudent(student);
        setShowModal(true);
    };

    const handleDelete = async (nim) => {
        try {
            const response = await fetch(`https://202.10.36.225/api/delete-student/${nim}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete student');
            }
            const updatedStudents = students.filter(student => student.nim !== nim);
            setStudents(updatedStudents);
            setConfirmModalOpen(false);
            setSnackbarMessage('Student successfully deleted');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                nim: editStudent.nim,
                name: editStudent.nama_mhs,
                major: editStudent.prodi_mhs,
                class: editStudent.kelas_mhs,
                email: editStudent.email_mhs,
                status: editStudent.status_mhs
            };
            const response = await fetch(`https://202.10.36.225/api/update-student`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update student');
            }
            const updatedStudents = students.map(student =>
                student.nim === editStudent.nim ? { ...student, ...updatedData } : student
            );
            setStudents(updatedStudents);
            fetchData();
            setShowModal(false);
            setSnackbarMessage('Data successfully updated');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleSort = (key) => {
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
                const valueA = a[sortColumn].toLowerCase();
                const valueB = b[sortColumn].toLowerCase();
                if (valueA < valueB) {
                    return sortOrder === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortOrder === 'asc' ? 1 : -1;
                }
                return 0;
            });
            return sorted;
        }
        return data;
    };

    const filteredStudents = students.filter(student => {
        if (filterValue === 'all' || student.status_mhs === filterValue) {
            return student.nama_mhs.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
    });

    const sortedStudents = sortData(filteredStudents);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'students';
        const ws = XLSX.utils.json_to_sheet(students);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName + fileExtension;
        a.click();
    }

    const exportToPdf = () => {
        const unit = 'pt';
        const size = 'A4';
        const orientation = 'landscape';
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);
        const title = 'Students';
        const headers = [['No', 'NIM', 'Name', 'Major', 'Class', 'Email', 'Status']];

        const data = students.map((student, index) => [index + 1, student.nim, student.nama_mhs, student.prodi_mhs, student.kelas_mhs, student.email_mhs, student.status_mhs]);
        let content = {
            startY: 50,
            head: headers,
            body: data
        };
        doc.text(title, 40, 40);
        doc.autoTable(content);
        doc.save('students.pdf');
    }

    return (
        <div id="wrapper">
            <SidebarAdmin />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Navbar setSearchTerm={setSearchTerm} />
                    <div className="container-fluid">
                        <div className="card shadow mb-4">

                            <div className="card-header py-2 d-flex justify-content-between align-items-center" style={{ height: '60px' }}>
                                <h6 className="m-0 font-weight-bold text-primary">Data Mahasiswa</h6>
                                <div>
                                    <Button variant="success" onClick={exportToExcel} style={{ float: 'right' }}>
                                        Download Excel
                                    </Button>
                                    <Button variant="danger" onClick={exportToPdf} style={{ float: 'right', marginRight: '10px' }}>
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('nim')} style={{ cursor: 'pointer' }}>
                                                    NIM
                                                    {sortColumn === 'nim' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('nama_mhs')} style={{ cursor: 'pointer' }}>
                                                    Nama
                                                    {sortColumn === 'nama_mhs' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('prodi_mhs')} style={{ cursor: 'pointer' }}>
                                                    Program Studi
                                                    {sortColumn === 'prodi_mhs' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('kelas_mhs')} style={{ cursor: 'pointer' }}>
                                                    Kelas
                                                    {sortColumn === 'kelas_mhs' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('email_mhs')} style={{ cursor: 'pointer' }}>
                                                    Email
                                                    {sortColumn === 'email_mhs' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('status_mhs')} style={{ cursor: 'pointer' }}>
                                                    Status
                                                    {sortColumn === 'status_mhs' && (
                                                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                                    )}
                                                </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((student, index) => (
                                                <tr key={student.id} style={{ cursor: 'pointer', backgroundColor: student.status_mhs === 'active' ? '#e0f2f1' : '#ffebee' }}>
                                                    <td>{student.nim}</td>
                                                    <td>{student.nama_mhs}</td>
                                                    <td>{student.prodi_mhs}</td>
                                                    <td>{student.kelas_mhs}</td>
                                                    <td>{student.email_mhs}</td>
                                                    <td>{student.status_mhs}</td>
                                                    <td>
                                                        <button onClick={() => handleEdit(student)} className="btn btn-primary">
                                                            <EditIcon />
                                                        </button>
                                                        <button onClick={() => { setDeleteNim(student.nim); setConfirmModalOpen(true); }} className="btn btn-danger ml-2">
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
                                    <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                                    <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            onClick={() => paginate(index + 1)}
                                            active={index + 1 === currentPage}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                    <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNim">
                            <Form.Label>NIM</Form.Label>
                            <Form.Control
                                type="text"
                                value={editStudent.nim}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editStudent.nama_mhs}
                                onChange={(e) => setEditStudent({ ...editStudent, nama_mhs: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formMajor">
                            <Form.Label>Major</Form.Label>
                            <Form.Control
                                type="text"
                                value={editStudent.prodi_mhs}
                                onChange={(e) => setEditStudent({ ...editStudent, prodi_mhs: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formClass">
                            <Form.Label>Class</Form.Label>
                            <Form.Control
                                type="text"
                                value={editStudent.kelas_mhs}
                                onChange={(e) => setEditStudent({ ...editStudent, kelas_mhs: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={editStudent.email_mhs}
                                onChange={(e) => setEditStudent({ ...editStudent, email_mhs: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={editStudent.status_mhs}
                                onChange={(e) => setEditStudent({ ...editStudent, status_mhs: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Control>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={confirmModalOpen} onHide={() => setConfirmModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this student?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(deleteNim)}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default ReadStudentPage;
