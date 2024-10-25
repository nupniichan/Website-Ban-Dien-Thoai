import React from 'react';

const ContactUs = () => {
    return (
        <main className="main">
            {/* Hero Section */}
            <section className="hero-section h-96 flex items-center justify-center text-center text-white"
                style={{
                    background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold">Reach Out to Us</h1>
                    <p className="mt-4 text-xl">We are here to answer your questions and provide assistance!</p>
                </div>
            </section>

            {/* Contact Information Section */}
            <section className="info-section mt-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold">Contact Information</h2>
                <p className="mt-4">Feel free to reach out via email or phone, and we'll get back to you as soon as possible.</p>

                <div className="mt-6">
                    <p className="text-xl">Email: <a href="mailto:pinkcat@gmail.com" className="text-blue-600">pinkcat@gmail.com</a></p>
                    <p className="mt-4 text-xl">Phone: <a href="tel:+84947500422" className="text-blue-600">(+84) 947500422</a></p>
                    <p className="mt-4 text-xl">Address: Sư Vạn Hạnh, TP. Hồ Chí Minh</p>
                </div>
            </section>

            {/* Interactive Section */}
            <section className="interactive-section py-20 bg-gray-100">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">We'd Love to Hear From You!</h2>
                    <p className="text-lg">Whether you have a question or need support, feel free to drop us a line. Your feedback and inquiries are important to us.</p>
                </div>
            </section>
        </main>
    );
};

export default ContactUs;
