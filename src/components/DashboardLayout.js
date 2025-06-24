// src/components/DashboardLayout.js
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardPage from './pages/DashboardPage'; // Assuming these are in 'pages' directory
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { useTransactions } from '../hooks/useTransactions';
import TransactionsPage from './pages/TransactionsPage';

// Accept menuItems as a prop here
const DashboardLayout = ({ currentPage, sidebarOpen, setCurrentPage, setSidebarOpen, handleLogout, currentUser, API_BASE_URL, menuItems }) => { // <--- Add menuItems here
    const categoryHooks = useCategories();
    const productHooks = useProducts();
    const transactionHooks = useTransactions();

    const [tenantName, setTenantName] = useState('Loading...');

    useEffect(() => {
        const storedTenantInfo = localStorage.getItem('tenantInfo');
        if (storedTenantInfo) {
            try {
                const tenant = JSON.parse(storedTenantInfo);
                setTenantName(tenant.name || 'Unknown Tenant');
            } catch (e) {
                console.error("Failed to parse tenant info from localStorage:", e);
                setTenantName('Error loading tenant name');
            }
        } else {
            setTenantName('No Tenant Found');
        }
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage categories={categoryHooks.categories} products={productHooks.products} setCurrentPage={setCurrentPage} />;
            case 'products':
                return <ProductsPage {...productHooks} categories={categoryHooks.categories} />;
            case 'categories':
                return <CategoriesPage {...categoryHooks} products={productHooks.products} />;
            case 'transactions':
                return <TransactionsPage {...transactionHooks} transactions={transactionHooks.transactions} />;
            default:
                return <DashboardPage categories={categoryHooks.categories} products={productHooks.products} setCurrentPage={setCurrentPage} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                currentPage={currentPage}
                sidebarOpen={sidebarOpen}
                setCurrentPage={setCurrentPage}
                setSidebarOpen={setSidebarOpen}
                handleLogout={handleLogout}
                menuItems={menuItems} // <--- IMPORTANT: Pass menuItems to Sidebar
            />

            {/* Main Content */}
            <div className="flex-1 lg:ml-0">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 capitalize">
                            {currentPage.replace('-', ' ')} {tenantName ? `| ${tenantName}` : ''}
                        </h2>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    {renderPage()}
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;