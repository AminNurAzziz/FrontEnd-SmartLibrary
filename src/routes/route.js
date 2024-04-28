// Routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QRScanner from '../pages/QRScanner';
import StudentInfo from '../pages/StudentInfo';

const RoutesConfig = () => {
    return (
        <Routes>
            <Route path="/" element={<QRScanner />} />
            <Route path="/student" element={<StudentInfo />} />
        </Routes>
    );
};

export default RoutesConfig;
