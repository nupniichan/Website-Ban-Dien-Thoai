import React from 'react';

const Stories = () => {
    return (
        <main className="main">
            {/* Hero Section */}
            <section className="hero-section h-96 flex items-center justify-center text-center text-white" style={{ background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold">Our Stories</h1>
                    <p className="mt-4 text-xl">Discover the journeys of our team and clients.</p>
                </div>
            </section>

            {/* Stories Section */}
            <section className="py-20 px-4 bg-gray-100">
                <h2 className="text-3xl text-center font-bold mb-10">Inspiring Journeys</h2>
                <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Example Story Card */}
                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Story Title 1</h3>
                        <p className="mt-2 text-gray-600">Brief description of the story goes here. Highlight the key points and insights.</p>
                    </div>
                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Story Title 2</h3>
                        <p className="mt-2 text-gray-600">Brief description of the story goes here. Highlight the key points and insights.</p>
                    </div>
                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Story Title 3</h3>
                        <p className="mt-2 text-gray-600">Brief description of the story goes here. Highlight the key points and insights.</p>
                    </div>
                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Story Title 4</h3>
                        <p className="mt-2 text-gray-600">Brief description of the story goes here. Highlight the key points and insights.</p>
                    </div>
                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Story Title 5</h3>
                        <p className="mt-2 text-gray-600">Brief description of the story goes here. Highlight the key points and insights.</p>
                    </div>
                    <div className="story-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Story Title 6</h3>
                        <p className="mt-2 text-gray-600">Brief description of the story goes here. Highlight the key points and insights.</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Stories;
