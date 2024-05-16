import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SidebarAdmin from './SideBarAdmin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Tambahkan state untuk Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Tambahkan state untuk pesan Snackbar
    const [confirmModalOpen, setConfirmModalOpen] = useState(false); // State untuk modal konfirmasi
    const [deleteNim, setDeleteNim] = useState(''); // State untuk menyimpan NIM yang akan dihapus


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/allstudent');
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
            const response = await fetch(`http://127.0.0.1:8000/api/delete-student/${nim}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            const updatedStudents = students.filter(student => student.nim !== nim);
            setStudents(updatedStudents);
            setConfirmModalOpen(false);
            setSnackbarMessage('Student successfully deleted'); // Set pesan Snackbar
            setSnackbarOpen(true); // Buka Snackbar
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

            const response = await fetch(`http://127.0.0.1:8000/api/update-student`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update student');
            }

            // Perbarui daftar mahasiswa setelah berhasil memperbarui data
            const updatedStudents = students.map(student =>
                student.nim === editStudent.nim ? { ...student, ...updatedData } : student
            );
            setStudents(updatedStudents);
            fetchData();
            setShowModal(false);
            setSnackbarMessage('Data successfully updated'); // Set pesan Snackbar
            setSnackbarOpen(true); // Buka Snackbar
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const filteredStudents = students.filter(student => {
        if (filterValue === 'all' || student.status_mhs === filterValue) {
            return student.nama_mhs.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
    });

    return (
        <div id="wrapper">
            <SidebarAdmin />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                            <i className="fa fa-bars"></i>
                        </button>
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
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Data Mahasiswa</h6>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th>NIM</th>
                                                <th>Nama</th>
                                                <th>Program Studi</th>
                                                <th>Kelas</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((student, index) => (
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
                        <Form.Group controlId="formNama">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                value={editStudent.nama_mhs}
                                onChange={(e) => setEditStudent({ ...editStudent, nama_mhs: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formProdi">
                            <Form.Label>Program Studi</Form.Label>
                            <Form.Control
                                type="text"
                                value={editStudent.prodi_mhs}
                                onChange={(e) => setEditStudent({ ...editStudent, prodi_mhs: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formKelas">
                            <Form.Label>Kelas</Form.Label>
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
            // key={'top' + 'right'}
            >
                <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default ReadStudentPage;
