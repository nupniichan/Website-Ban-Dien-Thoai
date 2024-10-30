import React from 'react';

const Vacancies = () => {
    return (
        <main className="main">
            {/* Hero Section */}
            <section className="hero-section h-96 flex items-center justify-center text-center text-white" style={{ background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold">Join Our Team</h1>
                    <p className="mt-4 text-xl">Explore our job openings and become a part of our journey.</p>
                </div>
            </section>

            {/* Vacancies Section */}
            <section className="py-20 px-4 bg-gray-100">
                <h2 className="text-3xl text-center font-bold mb-10">Current Openings</h2>
                <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Example Vacancy Card */}
                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Front-End Developer</h3>
                        <p className="mt-2 text-gray-600">Location: Remote</p>
                        <p className="mt-2">We are looking for a skilled Front-End Developer to build user-facing web applications. Must have experience with React, JavaScript, and CSS.</p>
                        <p className="mt-2">Send your resume to <a href="mailto:pinkcat@gmail.com" className="text-blue-600">pinkcat@gmail.com</a> or apply via <a href="https://linkedin.com/company/yourcompany" className="text-blue-600">LinkedIn</a>.</p>
                    </div>
                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Back-End Developer</h3>
                        <p className="mt-2 text-gray-600">Location: On-Site</p>
                        <p className="mt-2">Join us as a Back-End Developer to help build robust server-side logic. Experience with Node.js, Express, and databases is a must.</p>
                        <p className="mt-2">Send your resume to <a href="mailto:pinkcat@gmail.com" className="text-blue-600">pinkcat@gmail.com</a>.</p>
                    </div>
                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">UI/UX Designer</h3>
                        <p className="mt-2 text-gray-600">Location: Hybrid</p>
                        <p className="mt-2">We seek a creative UI/UX Designer to enhance our user experience. Proficiency in design tools like Figma and Adobe XD is required.</p>
                        <p className="mt-2">Send your portfolio and resume to <a href="mailto:pinkcat@gmail.com" className="text-blue-600">pinkcat@gmail.com</a>.</p>
                    </div>
                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Project Manager</h3>
                        <p className="mt-2 text-gray-600">Location: Remote</p>
                        <p className="mt-2">Manage software development projects, coordinate teams, and ensure timely delivery. Experience in Agile methodologies is a plus.</p>
                        <p className="mt-2">To apply, send your resume to <a href="mailto:pinkcat@gmail.com" className="text-blue-600">pinkcat@gmail.com</a>.</p>
                    </div>
                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Data Scientist</h3>
                        <p className="mt-2 text-gray-600">Location: On-Site</p>
                        <p className="mt-2">We are looking for a Data Scientist to analyze and interpret complex data. Must have experience with Python, R, and machine learning techniques.</p>
                        <p className="mt-2">Apply by emailing your resume to <a href="mailto:pinkcat@gmail.com" className="text-blue-600">pinkcat@gmail.com</a>.</p>
                    </div>
                    <div className="vacancy-card bg-white rounded-lg shadow-md p-5">
                        <h3 className="text-xl font-semibold">Marketing Specialist</h3>
                        <p className="mt-2 text-gray-600">Location: Remote</p>
                        <p className="mt-2">Help us grow by joining our team as a Marketing Specialist. Experience with digital marketing, SEO, and content creation is preferred.</p>
                        <p className="mt-2">Send your resume to <a href="mailto:pinkcat@gmail.com" className="text-blue-600">pinkcat@gmail.com</a>.</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Vacancies;

