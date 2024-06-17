import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JSX, SVGProps } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function HeroSection() {
  const [autoplay, setAutoplay] = useState(true);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 7000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 0,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center space-x-4">
          <img src="https://d18jakcjgoan9.cloudfront.net/s/img/images/barklogo-dark.png!d=KY4fXZ" alt="Bark Logo" className="h-10" />
          <nav className="flex items-center space-x-4">
            <a href="#" className="text-lg font-medium text-gray-800">
              Explore
            </a>
            <ChevronDownIcon className="h-5 w-5 text-gray-800" />
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/login" className="text-lg font-medium text-gray-800">
            Login
          </a>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">Join as a Professional</Button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center py-16 px-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">Find the perfect professional for you</h1>
        <p className="mt-4 text-lg text-gray-600 text-center">Get free quotes within minutes</p>
        <div className="flex items-center mt-8 w-full max-w-2xl">
          <Input className="flex-1 border rounded-l-md" placeholder="What service are you looking for?" />
          <Input className="w-32 border-l-0 border-r-0" placeholder="Postcode" />
          <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-r-md">Search</Button>
        </div>
        <p className="mt-4 text-sm text-gray-600">Popular: House Cleaning, Web Design, Personal Trainers</p>
      </main>
      <section className="p-8 w-full mx-auto" >
        <Slider {...sliderSettings}>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/house-cleaning.jpg!d=D7Luyd" alt="Service 1" className="h-32 w-auto mx-2" />
          </div>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/web-design.jpg!d=D7Luyd" alt="Service 2" className="h-32 w-auto mx-2" />
          </div>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/gardening.jpg!d=D7Luyd" alt="Service 3" className="h-32 w-auto mx-2" />
          </div>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/accounting.jpg!d=D7Luyd" alt="Service 4" className="h-32 w-auto mx-2" />
          </div>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/personal-training.jpg!d=D7Luyd" alt="Service 5" className="h-32 w-auto mx-2" />
          </div>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/counselling.jpg!d=D7Luyd" alt="Service 6" className="h-32 w-auto mx-2" />
          </div>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/gardening.jpg!d=D7Luyd" alt="Service 7" className="h-32 w-auto mx-2" />
          </div>
          <div className="slide-item">
            <img src="https://d18jakcjgoan9.cloudfront.net/s/img/home/accounting.jpg!d=D7Luyd" alt="Service 8" className="h-32 w-auto mx-2" />
          </div>
        </Slider>
      </section>
    </div>
  );
}

function ChevronDownIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
