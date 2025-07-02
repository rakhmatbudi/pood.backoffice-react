// src/components/pages/TransactionsPage.js
import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const TransactionsPage = () => {
    const { transactions, loading, error, fetchTransactions } = useTransactions();
    const [collapsedSessions, setCollapsedSessions] = useState({});

    // Group and sort transactions
    const sortedSessionEntries = useMemo(() => {
        if (!transactions) return []; // Return an empty array if no transactions

        // 1. Group transactions by cashierSessionId
        const grouped = transactions.reduce((acc, transaction) => {
            const sessionId = transaction.cashierSessionId;
            if (!acc[sessionId]) {
                acc[sessionId] = [];
            }
            acc[sessionId].push(transaction);
            return acc;
        }, {});

        // 2. Convert the grouped object into an array of [sessionId, transactions[]] pairs.
        //    While doing this, sort the orders within each session.
        let sessionsArray = Object.entries(grouped).map(([sessionId, sessionTransactions]) => {
            // Sort orders within this session by order.id descending
            // Assuming order.id is numeric or can be reliably converted to numeric for sorting
            const sortedSessionOrders = [...sessionTransactions].sort((a, b) => {
                return Number(b.id) - Number(a.id); // Descending order
            });
            return [sessionId, sortedSessionOrders];
        });

        // 3. Sort the sessionsArray by sessionId descending
        // Assuming sessionId is numeric or can be reliably converted to numeric for sorting
        sessionsArray.sort((a, b) => {
            const sessionIdA = a[0];
            const sessionIdB = b[0];
            return Number(sessionIdB) - Number(sessionIdA); // Descending order
        });

        return sessionsArray; // Return the fully sorted array of [sessionId, sortedTransactions]
    }, [transactions]);

    const toggleSessionCollapse = (sessionId) => {
        setCollapsedSessions(prevState => ({
            ...prevState,
            [sessionId]: !prevState[sessionId]
        }));
    };

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

    const totalOrders = transactions ? transactions.length : 0;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>
            <p className="mb-6">Total Orders: {totalOrders}</p>

            <div className="mt-4">
                {sortedSessionEntries.length > 0 ? (
                    // Now, map directly over the sorted array of session entries
                    sortedSessionEntries.map(([sessionId, sessionTransactions]) => (
                        <div key={sessionId} className="border p-3 mb-6 rounded-md shadow-sm bg-gray-50">
                            {/* Session Header (Collapsible) */}
                            <div
                                className="flex justify-between items-center cursor-pointer font-semibold bg-gray-100 hover:bg-gray-200 p-3 rounded-md transition-colors duration-200"
                                onClick={() => toggleSessionCollapse(sessionId)}
                            >
                                <h2 className="text-lg">
                                    Session ID: <span className="text-blue-700">{sessionId}</span> ({sessionTransactions.length} orders)
                                </h2>
                                <span>
                                    {collapsedSessions[sessionId] ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    )}
                                </span>
                            </div>

                            {/* Collapsible Orders Table */}
                            {!collapsedSessions[sessionId] && (
                                <div className="mt-4 overflow-x-auto bg-white rounded-md border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Order ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Table
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created At
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {/* sessionTransactions is already sorted here */}
                                            {sessionTransactions.map(order => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {order.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {order.tableNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ${(order.finalAmount || 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.isOpen ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                            {order.isOpen ? 'Open' : 'Closed'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(order.createdAt).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {sessionTransactions.length === 0 && (
                                        <p className="px-6 py-4 text-center text-gray-500">No orders in this session.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No transactions available.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;