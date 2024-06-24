// components/ImageSlider.jsx
import React from "react";
import Marquee from "./magicui/marquee";

const images = [
    { id: 2, src: "https://d18jakcjgoan9.cloudfront.net/s/img/home/house-cleaning.jpg!d=D7Luyd" },
    { id: 3, src: "https://d18jakcjgoan9.cloudfront.net/s/img/home/web-design.jpg!d=D7Luyd" },
    { id: 4, src: "https://d18jakcjgoan9.cloudfront.net/s/img/home/gardening.jpg!d=D7Luyd" },
    { id: 5, src: "https://d18jakcjgoan9.cloudfront.net/s/img/home/accounting.jpg!d=D7Luyd" },
    { id: 6, src: "https://d18jakcjgoan9.cloudfront.net/s/img/home/counselling.jpg!d=D7Luyd" },
    { id: 7, src: "https://d18jakcjgoan9.cloudfront.net/s/img/home/personal-training.jpg!d=D7Luyd" },
  ];
  

const Marquee3D = () => {
  return (
    <div className="relative flex h-[450px] w-full flex-col items-center justify-center overflow-hidden my-16">
      <Marquee pauseOnHover className="[--duration:100s] flex">
        {images.map((img) => (
          <div
            key={img.id}
            className={`relative w-[368px] h-[248px] my-6 flex-shrink-0 transition-transform duration-300 transform ${
              img.id % 2 === 1 ? "translate-y-4" : "-translate-y-4"
            } hover:z-10 hover:scale-105`}
          >
            <img
              src={img.src}
              alt={`Image ${img.id}`}
              className="h-full w-full object-cover rounded-xl cursor-pointer"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Marquee3D;
