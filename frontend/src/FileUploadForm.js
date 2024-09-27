import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = () => {
    const [file, setFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });

            setUploadedUrl(response.data.url); // Assuming your API returns the URL in response.data.url
        } catch (err) {
            console.error(err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-teal-600">Upload Your ZIP File</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
                {uploadedUrl && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-700">Your Site is Live!</h2>
                        <a
                            href={uploadedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:underline"
                        >
                            {uploadedUrl}
                        </a>
                    </div>
                )}
                {error && (
                    <div className="mt-4 text-red-500">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadForm;
