import React from "react";

const courses = [
    {
        title: "SAP FICO",
        shortTitle: "SAP FICO",
        description:
            "If you're an aspiring VLSI engineer, master RTL design, and advanced verification techniques.",
        image: "https://gtracademy.org/wp-content/uploads/2025/02/Frame-42.webp",
        price: "29,500",
        oldPrice: "60,000",
        discount: "50% OFF",
        rating: "4.6",
        instructor: "Suresh Reddy",
        duration: "35 hours",
        students: "990",
        modules: "10 modules",
        level: "Advanced",
        link: "https://gtracademy.org/sap-fico-training-online-with-certificate/",

    },
    {
        title: "SAP SD",
        shortTitle: "SAP SD",
        description:
            "Learn how Generative AI creates images, music, text, and videos using powerful AI models.",
        image: "https://gtracademy.org/wp-content/uploads/2025/02/Frame-46.webp",
        price: "29,500",
        oldPrice: "60,000",
        discount: "50% OFF",
        rating: "4.6",
        instructor: "Suresh Reddy",
        duration: "30 hours",
        students: "989",
        modules: "5 modules",
        level: "Advanced",
        link: "https://gtracademy.org/sap-s4-hana-sd-training-sales-and-distribution/",
    },
    {
        title: "SAP MM",
        shortTitle: "SAP MM",
        description:
            "Master Python, machine learning, statistical analysis, and data visualization.",
        image: "https://gtracademy.org/wp-content/uploads/2025/02/Frame-43.webp",
        price: "29,500",
        oldPrice: "60,000",
        discount: "50% OFF",
        rating: "4.6",
        instructor: "Suresh Reddy",
        duration: "40 hours",
        students: "950",
        modules: "10 modules",
        level: "Advanced",
        link: "https://gtracademy.org/sap-mm-s-4-hana-training-online-with-certificate/",
    },
];

const Gtrcourse = () => {
    return (
        <section className="px-6 md:px-12 py-14 bg-gradient-to-b from-gray-50 to-white">

            {/* Heading */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Our Trending Courses
                </h2>
                <p className="text-gray-500 mt-2">
                    Upgrade your skills with industry-ready programs
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden"
                    >
                        {/* Image */}
                        <div className="relative">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full sm:h-fit object-cover"
                            />

                            {/* Discount */}
                            <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                {course.discount}
                            </span>

                            {/* Title Tag */}
                            {/* <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                {course.shortTitle}
              </div> */}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">
                                {course.level}
                            </span>

                            <h3 className="text-lg font-bold mt-3">{course.title}</h3>

                            <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                                {course.description}
                            </p>

                            {/* Rating */}
                            {/* <div className="flex items-center gap-2 mt-3 text-yellow-500 text-sm">
                ⭐ {course.rating}
              </div> */}

                            {/* Instructor */}
                            {/* <p className="text-sm text-gray-600 mt-1">
                Instructor:{" "}
                <span className="font-semibold">{course.instructor}</span>
              </p> */}

                            {/* Meta */}
                            {/* <div className="flex gap-4 text-xs text-gray-500 mt-3">
                <span>⏱ {course.duration}</span>
                <span>👨‍🎓 {course.students}</span>
                <span>📚 {course.modules}</span>
              </div> */}

                            {/* Price */}
                            <div className="mt-4">
                                <span className="text-xl font-bold text-black">
                                    ₹{course.price}
                                </span>
                                <span className="text-sm line-through text-gray-400 ml-2">
                                    ₹{course.oldPrice}
                                </span>
                            </div>

                            {/* Button */}
                            <a
                                href={course.link} target="_blank"
                                className="block text-center mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                            >
                                View Details
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Gtrcourse;