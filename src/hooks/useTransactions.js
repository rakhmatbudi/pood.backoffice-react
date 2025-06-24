// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import { ENDPOINTS, ERROR_MESSAGES } from '../config/api'; // Assuming ENDPOINTS is defined
import { useAuth } from './useAuth'; // For handleLogout on 401s
import apiClient from '../services/apiClient'; // Import the apiClient instance

export const useTransactions = () => {
    const { handleLogout } = useAuth();

    const [transactions, setTransactions] = useState([]); // This will store the mapped transaction data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches grouped payments (sessions and their payments/orders) from the API.
     */
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear any previous errors

        try {
            // New endpoint for payments grouped by sessions with details
            const transactionEndpoint = 'payments/grouped/sessions/details'; // Using direct string as per your request

            console.log('🔍 Fetching transactions using apiClient from:', transactionEndpoint);

            const result = await apiClient.get(transactionEndpoint);

            if (!result.success) {
                if (result.status === 401) {
                    console.error("401 Unauthorized during transactions fetch. Logging out.");
                    handleLogout();
                    return;
                }
                throw new Error(result.error || 'Failed to fetch transactions.');
            }

            let rawSessionsData = [];
            if (result.data && Array.isArray(result.data.data)) {
                rawSessionsData = result.data.data;
            } else if (Array.isArray(result.data)) { // Fallback if data isn't nested under 'data'
                rawSessionsData = result.data;
            } else {
                console.warn('⚠️ Unexpected transactions response structure:', result.data);
                rawSessionsData = [];
            }

            // Flatten the nested structure (cashier_session_id with its payments and order_items)
            // into a single array of payment records.
            const mappedTransactions = rawSessionsData.flatMap(session => {
                const cashierSessionId = session.cashier_session_id;
                const cashierSessionOpenedAt = session.cashier_session_opened_at;
                const payments = session.payments || [];

                return payments.map(payment => ({
                    // Unique ID for the payment record (using payment_id as primary)
                    id: payment.payment_id,
                    // Session context
                    cashierSessionId: cashierSessionId,
                    cashierSessionOpenedAt: cashierSessionOpenedAt, // Keep original timestamp
                    // Payment details
                    paymentId: payment.payment_id,
                    orderId: payment.order_id,
                    orderTableNumber: payment.order_table_number,
                    customerName: payment.customer_name,
                    paymentAmount: payment.payment_amount,
                    paymentMode: payment.payment_mode, // Numerical ID
                    paymentModeName: payment.payment_mode_name, // Human-readable name
                    paymentDate: payment.payment_date, // Keep original timestamp
                    transactionId: payment.transaction_id,
                    // Nested order items (mapped to a consistent format)
                    orderItems: (payment.order_items || []).map(item => ({
                        itemId: item.item_id,
                        menuItemId: item.menu_item_id,
                        menuItemName: item.menu_item_name,
                        variantId: item.variant_id,
                        quantity: item.quantity,
                        unitPrice: item.unit_price,
                        totalPrice: item.total_price,
                        notes: item.notes,
                    }))
                }));
            });

            console.log('✅ Processed transactions (payments):', mappedTransactions);
            console.log('📊 Total payments processed:', mappedTransactions.length);

            setTransactions(mappedTransactions);
        } catch (err) {
            console.error('❌ Error fetching transactions:', err);
            if (err.message !== ERROR_MESSAGES.UNAUTHORIZED) {
                setError(err.message);
            }
            setTransactions([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, [handleLogout]); // Dependencies for useCallback: Only handleLogout as apiClient is stable.

    /**
     * Effect hook to fetch transactions on component mount.
     */
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]); // fetchTransactions is stable due to useCallback

    // You can add other transaction-specific functions here (e.g., getPaymentDetails)
    // based on your application's needs.

    return {
        transactions,
        loading,
        error,
        fetchTransactions, // Expose for manual refresh if needed
    };
};