'use client'
import HeroSection from "@/components/hero-section";
import Marquee3D from "@/components/carsual";
import { BentoDemo } from "@/components/aminatedbeam";
const HomePage = () => {
  return (
    <> 
    <div className="">

    <HeroSection/>
    <Marquee3D/>
      <h1 className="flex text-4xl font-semibold items-center justify-center"> Services</h1>
    <div className="flex justify-center container items-center">
      

    <BentoDemo/>

    
    </div>
    </div>
   
    </>
  );
}

export default HomePage;
 