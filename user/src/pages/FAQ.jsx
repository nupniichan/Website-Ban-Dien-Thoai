import { useState } from 'react';

const FaQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "What is your return policy?",
            answer: "You can return any item within 30 days of purchase for a full refund, provided it is in its original condition."
        },
        {
            question: "How long does shipping take?",
            answer: "Shipping usually takes 5-7 business days, depending on your location."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship internationally. Shipping costs will vary based on the destination."
        },
        {
            question: "How can I contact customer support?",
            answer: "You can reach our customer support team at support@example.com or call us at (123) 456-7890."
        },
        {
            question: "Do you have a loyalty program?",
            answer: "Yes, we have a loyalty program that rewards customers for every purchase. Sign up on our website to learn more."
        },
    ];

    const toggleFAQ = index => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <main className="main">
            {/* Hero Section */}
            <section className="hero-section h-96 flex items-center justify-center text-center text-white"  // Adjust height to cover full viewport minus header height
                style={{
                    background: "linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.8)), url('/path-to-your-background-image.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <div className="bg-black bg-opacity-70 p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
                    <p className="mt-4 text-xl">Find answers to common queries.</p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section mt-10 max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item bg-white rounded-lg shadow-md my-2">
                        <div className="faq-question p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleFAQ(index)}>
                            <h3 className="text-xl font-semibold">{faq.question}</h3>
                            <span className="text-2xl">{activeIndex === index ? '-' : '+'}</span>
                        </div>
                        {activeIndex === index && (
                            <div className="faq-answer p-4 border-t">
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
};

export default FaQ;
