import React from "react";

const Terms = () => {
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
                    <h1 className="text-5xl font-bold">Terms and Conditions</h1>
                    <p className="mt-4 text-xl">Understand your rights and responsibilities.</p>
                </div>
            </section>

            {/* Terms Content Section */}
            <section className="terms-section max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2">1. Introduction</h2>
                <p className="mt-4 text-gray-600">
                    Welcome to our website. By using our site, you agree to comply with the following terms and conditions. Please read them carefully.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">2. Acceptance of Terms</h2>
                <p className="mt-4 text-gray-600">
                    Your access to and use of the website is conditioned on your acceptance of and compliance with these terms. If you disagree with any part, you must not access the site.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">3. Changes to Terms</h2>
                <p className="mt-4 text-gray-600">
                    We reserve the right to modify these terms at any time. Your continued use of the website constitutes your acceptance of any revised terms.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">4. User Responsibilities</h2>
                <p className="mt-4 text-gray-600">
                    Users are responsible for ensuring their use of the site complies with applicable laws and regulations.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">5. Limitation of Liability</h2>
                <p className="mt-4 text-gray-600">
                    We will not be liable for any indirect or consequential loss or damage arising out of or in connection with the use of our site.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">6. Governing Law</h2>
                <p className="mt-4 text-gray-600">
                    These terms shall be governed by and construed in accordance with the laws of your jurisdiction.
                </p>

                <h2 className="text-4xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mt-6">7. Contact Us</h2>
                <p className="mt-4 text-gray-600">
                    If you have any questions about these Terms, please contact us at <a href="mailto:support@example.com" className="text-blue-600 underline">pinkcat@gmail.com</a>.
                </p>
            </section>
        </main>
    );
};

export default Terms;
