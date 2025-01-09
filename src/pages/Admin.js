import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import Dashboard from '../components/Admin/Dashboard';
import UserManagement from '../components/Admin/UserManagement';
import hamburger from '../assets/hamburger.svg';
import ServicesPrice from '../components/Admin/ServicesPrice';

const adminRoutes = [
    { path: 'dashboard', Component: Dashboard },
    { path: 'user-management', Component: UserManagement },
    { path: 'service-prices', Component: ServicesPrice },
];

const Admin = () => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        // console.log(isSidebarOpen);
      };
    return (
        <div className="flex h-screen bg-custom-background">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Static Sidebar on the left */}
            <div className="flex flex-col lg:w-[calc(100%-250px)] w-full">
                <div className="bg-custom-background text-white p-4 border-b border-custom-border flex justify-between items-center">
                    <button className="lg:hidden flex items-center focus:outline-none" onClick={() => {toggleSidebar()}}>
                        <img src={hamburger} alt="Hamburger" className="w-[60px] h-[60px]" />
                    </button>
                    <h1 className="text-2xl font-semibold">Admin Panel</h1>
                </div>
                <div className="flex-1 overflow-auto">
                    <Routes>
                        {adminRoutes.map(route => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.Component />}
                            />
                        ))}
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Admin;