// src/components/pages/TransactionsPage.js (Example)
import React from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const TransactionsPage = () => {
    const { transactions, loading, error, fetchTransactions } = useTransactions();

    if (loading) {
        return <LoadingSpinner message="Loading transactions..." />;
    }

    if (error) {
        return (
            <ErrorMessage
                title="Error Loading Transactions"
                message={error}
                onRetry={fetchTransactions}
            />
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>
            <p>Total Orders: {transactions.length}</p>
            {/* Render your transactions data in a table or list */}
            <div className="mt-4">
                {transactions.map(order => (
                    <div key={order.id} className="border p-3 mb-2 rounded-md shadow-sm">
                        <p className="font-semibold">Order ID: {order.id} (Session: {order.cashierSessionId})</p>
                        <p>Table: {order.tableNumber}</p>
                        <p>Amount: ${order.finalAmount}</p>
                        <p>Status: {order.isOpen ? 'Open' : 'Closed'}</p>
                        <p>Created: {order.createdAt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionsPage;