// Routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QRScanner from '../pages/QRScanner';
import StudentInfo from '../pages/StudentInfo';
import BorrowConfirmationPage from '../pages/BorrowConfirmationPage';
import BorrowReceiptPage from '../pages/BorrowReceiptPage';
import ReturnBookPage from '../pages/ReturnBookPage';
import ExtendReceiptPage from '../pages/ExtendReceiptPage';
import ReserveReceiptPage from '../pages/ReserveReceiptPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import SidebarAdmin from '../pages/SideBarAdmin';
import StudentPage from '../pages/StudentPage';
import PeminjamanHistoryAdmin from '../pages/PeminjamanHistoryAdmin';
import RegulationPage from '../pages/RegulationPage';

const RoutesConfig = () => {
    return (
        <Routes>
            <Route path="/" element={<QRScanner />} />
            <Route path="/student" element={<StudentInfo />} />
            <Route path="/borrow-confirmation" element={<BorrowConfirmationPage />} />
            <Route path="/borrow-receipt" element={<BorrowReceiptPage />} />
            <Route path="/get-loan" element={<ReturnBookPage />} />
            <Route path="/get-reserve" element={<ReserveReceiptPage />} />
            <Route path="/extend-receipt" element={<ExtendReceiptPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<SidebarAdmin />} />
            <Route path="/manage-student" element={<StudentPage />} />
            <Route path="/manage-borrowing" element={<PeminjamanHistoryAdmin />} />
            <Route path="/regulation" element={<RegulationPage />} />

        </Routes>
    );
};

export default RoutesConfig;
