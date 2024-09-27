import React from 'react';
import { isLoggedIn } from './isLoggedIn'; // Adjust the path as necessary
import FileUploadForm from './FileUploadForm'; // Import the upload form

const Home = () => {
    const loggedIn = isLoggedIn();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h2 className="text-xl">{loggedIn ? 'Upload Your Files' : 'Please log in to continue'}</h2>
            {!loggedIn ? (
                <p className="mt-4">You need to be logged in to access the upload feature.</p>
            ) : (
                <FileUploadForm /> // Show the upload form if logged in
            )}
        </div>
    );
};

export default Home;
