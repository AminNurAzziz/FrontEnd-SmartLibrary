import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo/logo_library.png';

const SidebarAdmin = () => {
    const handleOnClicked = (endpoint) => {
        window.location.href = endpoint;
    };

    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <NavLink className="sidebar-brand d-flex align-items-center justify-content-center my-3" to="/">
                <img src={Logo} alt="Logo Polinema" style={{ width: '120px', height: 'auto' }} />
            </NavLink>
            <hr className="sidebar-divider my-0" />
            <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                    <i className="fas fa-fw fa-chart-area"></i>
                    <span>Dashboard</span>
                </NavLink>
            </li>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Transactions</div>
            <li className="nav-item">
                <button className="nav-link" onClick={() => handleOnClicked('/student')} >
                    <i className="fas fa-fw fa-reply"></i>
                    <span>Returns</span>
                </button>
            </li>
            <li className="nav-item">
                <button className="nav-link" onClick={() => handleOnClicked('/student')}>
                    <i className="fas fa-fw fa-book"></i>
                    <span>Borrowing</span>
                </button>
            </li>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Student & Borrowing</div>
            <li className="nav-item">
                <NavLink className="nav-link" to="/manage-borrowing">
                    <i className="fas fa-fw fa-cogs"></i>
                    <span>Manage Borrowing</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/manage-student">
                    <i className="fas fa-fw fa-user"></i>
                    <span>Manage Student</span>
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                    <i className="fas fa-fw fa-sign-out-alt"></i>
                    <span>Logout</span>
                </NavLink>
            </li>
            <hr className="sidebar-divider d-none d-md-block" />
        </ul>
    );
};

export default SidebarAdmin;
