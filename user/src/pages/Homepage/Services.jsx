import {
    CustomerServiceOutlined,
    SafetyOutlined,
    TruckOutlined,
    WalletOutlined,
} from "@ant-design/icons";

const ServiceData = [
    {
        id: 1,
        icon: <TruckOutlined className="text-4xl md:text-5xl text-primary" />,
        title: "Free Shipping",
        description: "Free Shipping On Orders Over $300",
    },
    {
        id: 2,
        icon: <WalletOutlined className="text-4xl md:text-5xl text-primary" />,
        title: "Safe Money",
        description: "30 Days Money Back Guarantee",
    },
    {
        id: 3,
        icon: <SafetyOutlined className="text-4xl md:text-5xl text-primary" />,
        title: "Secure Payment",
        description: "All Payment Are Secured",
    },
    {
        id: 4,
        icon: (
            <CustomerServiceOutlined className="text-4xl md:text-5xl text-primary" />
        ),
        title: "Online Support 24/7",
        description: "Technical Support Available 24/7",
    },
];

const Services = () => {
    return (
        <div className="container my-14 md:my-20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8">
                {ServiceData.map((service) => (
                    <div
                        key={service.id}
                        className="flex flex-col items-start sm:flex-row gap-4"
                    >
                        {service.icon}
                        <div>
                            <h1 className="lg:text-xl font-bold">
                                {service.title}
                            </h1>
                            <h1 className="text-gray-400 text-sm">
                                {service.description}
                            </h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
