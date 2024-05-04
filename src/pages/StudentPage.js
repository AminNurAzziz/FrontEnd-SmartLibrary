import React, { useState, useEffect } from 'react';
import SidebarAdmin from './SideBarAdmin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ReadStudentPage = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValue, setFilterValue] = useState('all');

    useEffect(() => {
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

        fetchData();
    }, []);

    const handleEdit = (borrowingCode) => {
        // Logika untuk menangani edit
        console.log("Edit:", borrowingCode);
    };

    const handleDelete = async (nim) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete-student/${nim}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            // Jika penghapusan berhasil, perbarui daftar siswa
            const updatedStudents = students.filter(student => student.nim !== nim);
            setStudents(updatedStudents);
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    // Fungsi untuk memfilter siswa berdasarkan kata kunci pencarian dan nilai filter
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
                        <h1 className="h3 mb-2 text-gray-800">Tables</h1>
                        <p className="mb-4">DataTables is a third party plugin that is used to generate the demo table below.
                            For more information about DataTables, please visit the <a target="_blank"
                                href="https://datatables.net">official DataTables documentation</a>.</p>
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
                                                        <button onClick={() => handleEdit(student.borrowing_code)} className="btn btn-primary">
                                                            <EditIcon />
                                                        </button>
                                                        <button onClick={() => handleDelete(student.nim)} className="btn btn-danger ml-2">
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
        </div>
    );
};

export default ReadStudentPage;
