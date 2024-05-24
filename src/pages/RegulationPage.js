import React, { useState, useEffect } from 'react';
import SidebarAdmin from './SideBarAdmin';
import { Modal, Form, Button } from 'react-bootstrap';
import Navbar from './Navbar';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const RegulationPage = () => {
    const [regulationData, setRegulationData] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editedData, setEditedData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchRegulationData();
    }, []);

    const fetchRegulationData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/regulation');
            if (!response.ok) {
                throw new Error('Failed to fetch regulation data');
            }
            const data = await response.json();
            setRegulationData(data);
            setEditedData(data);
        } catch (error) {
            setError('Failed to fetch regulation data');
        }
    };

    const handleEditClick = (data) => {
        setEditedData(data);
        setShowModal(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedData({
            ...editedData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/regulation', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedData)
            });
            if (!response.ok) {
                throw new Error('Failed to edit regulation data');
            }
            setShowModal(false);
            fetchRegulationData();
            setSnackbarOpen(true);
            setSnackbarMessage('Regulation data edited successfully');
        } catch (error) {
            console.error('Error editing regulation data:', error);
            setSnackbarOpen(true);
            setSnackbarMessage('Failed to edit regulation data');
        }
    };

    return (
        <div id="wrapper">
            <SidebarAdmin />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Navbar setSearchTerm={setSearchTerm} />
                    <div className="container-fluid">
                        {error && <p className="text-danger">{error}</p>}
                        {regulationData && (
                            <div className="card shadow mb-4">
                                <div className="card-header py-2 d-flex justify-content-between align-items-center" style={{ height: '50px' }}>
                                    <h6 className="m-0 font-weight-bold text-primary">Regulation</h6>
                                    <IconButton onClick={() => handleEditClick(regulationData)}>
                                        <EditIcon />
                                    </IconButton>
                                </div>

                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Max Loan Days</th>
                                                    <td>{regulationData.max_loan_days}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Max Loan Books</th>
                                                    <td>{regulationData.max_loan_books}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Max Reserve Books</th>
                                                    <td>{regulationData.max_reserve_books}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Max Reserve Days</th>
                                                    <td>{regulationData.max_reserve_days}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Fine Per Day</th>
                                                    <td>{regulationData.fine_per_day}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Regulation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="max_loan_days">
                            <Form.Label>Max Loan Days</Form.Label>
                            <Form.Control type="number" name="max_loan_days" placeholder="Max Loan Days" value={editedData.max_loan_days || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="max_loan_books">
                            <Form.Label>Max Loan Books</Form.Label>
                            <Form.Control type="number" name="max_loan_books" placeholder="Max Loan Books" value={editedData.max_loan_books || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="max_reserve_books">
                            <Form.Label>Max Reserve Books</Form.Label>
                            <Form.Control type="number" name="max_reserve_books" placeholder="Max Reserve Books" value={editedData.max_reserve_books || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="max_reserve_days">
                            <Form.Label>Max Reserve Days</Form.Label>
                            <Form.Control type="number" name="max_reserve_days" placeholder="Max Reserve Days" value={editedData.max_reserve_days || ''} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="fine_per_day">
                            <Form.Label>Fine Per Day</Form.Label>
                            <Form.Control type="number" name="fine_per_day" placeholder="Fine Per Day" value={editedData.fine_per_day || ''} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
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

export default RegulationPage;
