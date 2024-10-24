import Heading from "../../shared/Heading";

import Img1 from "../../assets/fakeAssets/blogs/blog-1.jpg";
import Img2 from "../../assets/fakeAssets/blogs/blog-2.jpg";
import Img3 from "../../assets/fakeAssets/blogs/blog-3.jpg";

const BlogData = [
    {
        id: 1,
        title: "How to choose the perfect smartwatch",
        subtitle:
            "A smartwatch is a wearable computer in the form of a wristwatch; modern smartwatches provide a local touchscreen interface for daily use, while an associated smartphone app provides for management and telemetry (such as long-term biomonitoring).",
        publisher: "by John Fortnite",
        image: Img1,
    },
    {
        id: 2,
        title: "Guide on picking your next smartphone",
        subtitle:
            "Smartphones combine mobile telephone and computing functions into one unit. They are distinguished from feature phones by their stronger hardware capabilities and extensive mobile operating systems, which facilitate wider software, internet (including web browsing over mobile broadband), and multimedia functionality (including music, video, cameras, and gaming), alongside core phone functions such as voice calls and text messaging.",
        publisher: "by Ben Dover",
        image: Img2,
    },
    {
        id: 3,
        title: "Which VR headset suits you best?",
        subtitle:
            "It's a head-mounted device that provides virtual reality for the wearer. Virtual reality (VR) headsets are widely used with video games but they are also used in other applications, including simulators and trainers. They comprise a stereoscopic head-mounted display (providing separate images for each eye), stereo sound, and head motion tracking sensors (which may include gyroscopes, accelerometers, structured light systems, etc.).",
        publisher: "by Hugh Janus",
        image: Img3,
    },
];

const Blogs = () => {
    return (
        <div className="my-12">
            <div className="container">
                {/* Heading section */}
                <Heading title="Recent News" subtitle="" />

                {/* Blog Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8 sm:gap-4 md:gap-7">
                    {/* Blog cards */}
                    {BlogData.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-900" >
                            {/* Image section */}
                            <div className="overflow-hidden rounded-2xl mb-2">
                                <img src={item.image} alt="" className="w-full h-[220px] object-cover rounded-2xl hover:scale-[1.1] ease-linear transition-transform duration-150" />
                            </div>
                            {/* Content section */}
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500">{item.publisher}</p>
                                <p className="font-bold line-clamp-1">{item.title}</p>
                                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{item.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blogs;
