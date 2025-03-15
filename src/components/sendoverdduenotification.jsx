import React, { useState } from 'react';
import API from '../axiosConfig';

const SendOverdueNotification = ({ borrowingId, customerId, bookTitle }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const sendNotification = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        console.log("Sending overdue notification...");
        console.log("Borrowing ID:", borrowingId);
        console.log("Customer ID:", customerId);
        console.log("Book Title:", bookTitle);

        try {
            const response = await API.post('/api/notifications/send-overdue', {
                borrowing_id: borrowingId,
                customer_id: customerId
            });

            console.log("Notification response:", response.data);
            setSuccess(true);
        } catch (error) {
            console.error("Error sending overdue notification:", error);
            setError("Failed to send notification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={sendNotification} disabled={loading}>
                {loading ? "Notifying..." : "Notify Overdue"}
            </button>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Notification Sent!</p>}
        </div>
    );
};

export default SendOverdueNotification;
