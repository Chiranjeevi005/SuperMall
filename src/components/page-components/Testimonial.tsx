"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Testimonial = () => {
    const testimonials = [
        {
            name: "Vaishav Menta",
            quote:
                "Super Mall has transformed my business. The platform is user-friendly and the support team is always there to help.",
            image:
                "https://res.cloudinary.com/ds2qnwvrk/image/upload/v1755536551/Gemini_Generated_Image_ef217eef217eef21_dw71js.png",
            avatar: "V",
        },
        {
            name: "Rao Mahesh Kumar",
            quote:
                "I love selling on Super Mall! The community is great and I've seen a significant increase in sales.",
            image:
                "https://res.cloudinary.com/ds2qnwvrk/image/upload/v1755536551/Gemini_Generated_Image_ef217eef217eef21_dw71js.png",
            avatar: "R",
        },
        {
            name: "Harsad Patel",
            quote:
                "The tools provided by Super Mall have made managing my store so much easier. Highly recommend!",
            image:
                "https://res.cloudinary.com/ds2qnwvrk/image/upload/v1755536551/Gemini_Generated_Image_ef217eef217eef21_dw71js.png",
            avatar: "H",
        },
        {
            name: "Danish Shetty",
            quote:
                "Fantastic platform! The features are top-notch and the customer service is excellent.",
            image:
                "https://res.cloudinary.com/ds2qnwvrk/image/upload/v1755536551/Gemini_Generated_Image_ef217eef217eef21_dw71js.png",
            avatar: "D",
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-2">What our Vendors Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Hear from our vendors about their experiences and success stories
                        with Super Mall.
                    </p>
                </div>

                <Swiper
                    modules={[Pagination, Autoplay, Navigation]}
                    slidesPerView={1}
                    spaceBetween={24}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    navigation
                    className="pb-12"
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <Card className="h-full p-6 shadow-md">
                                <CardContent>
                                    <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i key={star} className="fas fa-star"></i>
                                        ))}
                                    </div>

                                    <p className='text-gray-500 mb-6 italic'>
                                        &quot;{testimonial.quote}&quot;
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                {testimonial.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                    </div>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Testimonial;
