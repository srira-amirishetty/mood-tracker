import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserMoodList = ({ userId , mood }) => {
    const [moodData, setMoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) {
            setError('User ID is missing.');
            setLoading(false);
            return;
        }

        const fetchMoodData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/getUserMoods/${userId}`);
                setMoodData(response.data);
                setError('');
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Failed to fetch mood data. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMoodData();
    }, [userId, mood]);

    if (loading) {
        return <div>Loading mood data...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="mood-list">
            <h2>User Mood Entries</h2>
            {moodData.length === 0 ? (
                <p>No mood data found for this user.</p>
            ) : (
                <ul>
                    {moodData.map((entry) => (
                        <li key={entry._id} className="mood-entry">
                            <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()} <br />
                            <strong>Mood Rating:</strong> {entry.mood} <br />
                            <strong>Description:</strong> {entry.description} <br />
                            <strong>AI Insight:</strong> {entry.insight}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserMoodList;
