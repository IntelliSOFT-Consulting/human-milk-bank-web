import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Index from './pages/Index'
import ResetPassword from './pages/ResetPassword'
import SetNewPassword from './pages/SetNewPassword'
import Account from './pages/Account'
import Users from './pages/Users'
import PatientDetails from './pages/PatientDetails'
import PatientList from './pages/PatientList'
import DataImport from './pages/DataImport'
import DataExport from './pages/DataExport'
import Reports from './pages/Reports'




function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/account" element={<Account />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/new-password" element={<SetNewPassword />} />
                    <Route path="/" element={<Index />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/patients" element={<PatientList />} />
                    <Route path="/patients/:id" element={<PatientDetails />} />
                    <Route path="/settings" element={<PatientDetails />} />
                    <Route path="/import" element={<DataImport />} />
                    <Route path="/export" element={<DataExport />} />
                    <Route path="/reports" element={<Reports />} />

                </Routes>
            </Router>
        </div>
    );
}

export default App;