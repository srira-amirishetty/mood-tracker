import React, {useState} from 'react';
import axios from 'axios';
import UserMoodList from './GetUserMoods';

const GetMood = () => {
    const [userId, setUserId] = useState('');
    const [mood, setMood] = useState('');
    const [description, setDescription] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        setResponse(null);

        if (!userId || !mood || !description) {
            setError('All fields are required.');
            return;
        }

        if (mood < 1 || mood > 5) {
            setError('Mood rating must be between 1 and 5.');
            return;
        }

        try{
            
            const res = await axios.post('https://mood-tracker-0e3g.onrender.com/api/submitmood', {userId, mood, description});
            setResponse(res.data);
            console.log('submitted')
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        }
    };

    const handleClear = () => {
        setUserId('');
        setMood('');
        setDescription('');
        setResponse(null);
        setError('');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Mood Tracker</h1>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>Name:</strong>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter your name"
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>Mood Rating (1-5):</strong>
                    <input
                        type="number"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="Enter your mood rating"
                        style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>Description:</strong>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your mood"
                        style={{
                            marginLeft: '10px',
                            padding: '5px',
                            width: '300px',
                            height: '100px',
                            resize: 'none',
                        }}
                    />
                </label>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={handleSubmit}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Submit
                </button>
                <button
                    onClick={handleClear}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                    }}
                >
                    Clear
                </button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {response && (
                <div>
                    <h2>AI Insights</h2>
                    <p>
                        <strong>Message:</strong> {response.message}
                    </p>
                    <p>
                        <strong>Insight:</strong> {response.insight}
                    </p>
                </div>
            )}
            <UserMoodList userId={userId} mood={mood} />
        </div>
    );
}

export default GetMood;