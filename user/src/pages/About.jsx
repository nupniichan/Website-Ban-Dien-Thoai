import React from 'react';

const About = () => {
    return (
        <main className="about-page">
           <section className="hero-section h-96 flex items-center justify-center text-center text-white" style={{ background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold">About Us</h1>
        <p className="mt-4 text-xl">Your trusted partner in technology.</p>
    </div>
</section>

            {/* Company Overview */}
            <section className="company-overview py-16 px-8 text-center bg-white">
                <h2 className="text-4xl font-bold mb-4">Our Story</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Since our founding in 2020, we have dedicated ourselves to providing innovative solutions and exceptional service to our customers worldwide. We believe in quality, integrity, and commitment.
                </p>
            </section>

            {/* Values Section */}
            <section className="values-section bg-gray-100 py-16 px-8 text-center">
                <h2 className="text-4xl font-bold mb-8">Our Core Values</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="value-item p-6 bg-white rounded shadow-md">
                        <h3 className="text-2xl font-semibold">Innovation</h3>
                        <p className="text-gray-600 mt-4">We strive to be at the forefront of technology, continually improving and evolving.</p>
                    </div>
                    <div className="value-item p-6 bg-white rounded shadow-md">
                        <h3 className="text-2xl font-semibold">Customer Focus</h3>
                        <p className="text-gray-600 mt-4">Our customers are our priority. We listen to their needs and adapt accordingly.</p>
                    </div>
                    <div className="value-item p-6 bg-white rounded shadow-md">
                        <h3 className="text-2xl font-semibold">Integrity</h3>
                        <p className="text-gray-600 mt-4">We conduct our business with honesty and transparency.</p>
                    </div>
                </div>
            </section>

            {/* Team Members Section */}
            <section className="team-section py-16 px-8 text-center">
                <h2 className="text-4xl font-bold mb-8">Meet Our Team</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="team-member">
                        <img src="/path-to-your-team-member1-image.jpg"  className="rounded-full w-32 h-32 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">N.Phát</h3>
                        <p className="text-gray-600">Dev</p>
                    </div>
                    <div className="team-member">
                        <img src="/path-to-your-team-member2-image.jpg"  className="rounded-full w-32 h-32 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">H.Phát</h3>
                        <p className="text-gray-600">Team Lead</p>
                    </div>
                    <div className="team-member">
                        <img src="/path-to-your-team-member3-image.jpg"  className="rounded-full w-32 h-32 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">Q.Bảo</h3>
                        <p className="text-gray-600">Dev</p>
                    </div>
                    <div className="team-member">
                        <img src="/path-to-your-team-member4-image.jpg"  className="rounded-full w-32 h-32 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">M.Quân</h3>
                        <p className="text-gray-600">Dev</p>
                    </div>
                    <div className="team-member">
                        <img src="/path-to-your-team-member5-image.jpg"  className="rounded-full w-32 h-32 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">H.Tha</h3>
                        <p className="text-gray-600">Dev</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section py-16 px-8 bg-primary text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to connect with us?</h2>
                <p className="text-lg mb-8">Join us in our journey to revolutionize the industry.</p>
                <a href="/contactus" className="px-8 py-3 bg-white text-primary rounded-full hover:bg-gray-200">
                    Contact Us
                </a>
            </section>
        </main>
    );
};

export default About;
