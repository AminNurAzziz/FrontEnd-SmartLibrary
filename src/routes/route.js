// Routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QRScanner from '../pages/QRScanner';
import StudentInfo from '../pages/StudentInfo';
import BorrowConfirmationPage from '../pages/BorrowConfirmationPage';
import BorrowReceiptPage from '../pages/BorrowReceiptPage';
import ReturnBookPage from '../pages/ReturnBookPage';
import ExtendReceiptPage from '../pages/ExtendReceiptPage';

const RoutesConfig = () => {
    return (
        <Routes>
            <Route path="/" element={<QRScanner />} />
            <Route path="/student" element={<StudentInfo />} />
            <Route path="/borrow-confirmation" element={<BorrowConfirmationPage />} />
            <Route path="/borrow-receipt" element={<BorrowReceiptPage />} />
            <Route path="/get-loan" element={<ReturnBookPage />} />
            <Route path="/extend-receipt" element={<ExtendReceiptPage />} />
        </Routes>
    );
};

export default RoutesConfig;
