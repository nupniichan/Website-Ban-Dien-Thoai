import React, { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic (e.g., API call)
        setSubmitted(true);
    };

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
                    <h1 className="text-5xl font-bold">Contact Us</h1>
                    <p className="mt-4 text-xl">We'd love to hear from you!</p>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="contact-section mt-10 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center">Get in Touch</h2>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            rows="4"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                        Send Message
                    </button>
                </form>
                {submitted && <p className="mt-4 text-green-600 text-center">Thank you for your message!</p>}
            </section>

            {/* Contact Information Section */}
            <section className="info-section mt-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold">Contact Information</h2>
                <p className="mt-4">Email: <a href="mailto:pinkcat@example.com" className="text-blue-600">pinkcat@gmail.com</a></p>
                <p className="mt-2">Phone: <a href="tel:+1234567890" className="text-blue-600">(+84) 947500422</a></p>
                <p className="mt-2">Address: Sư Vạn Hạnh, TP. Hồ Chí Minh</p>
            </section>
        </main>
    );
};

export default ContactUs;
