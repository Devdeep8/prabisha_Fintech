// components/HeroSection.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "./navbar";
import { MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <Header />
      <div className="bg-white md:h-[26rem] flex flex-col items-center justify-center py-16">
        <div className="w-[50rem] flex flex-col items-start md:mt-4">
          <h1 className="text-5xl font-semibold text-gray-900">
            Find the perfect <span className="block">professional for you</span>
          </h1>
          <p className="mt-4 text-2xl text-gray-400 text-center">
            Get free quotes within minutes
          </p>
          <div className="flex items-center mt-8 w-full text-black max-w-2xl">
            <Input
              type="text"
              className="flex-1 md:w-[352px] md:h-[52px] border-2 px-4 py-3 font-medium text-lg border-gray-400 rounded-tl-[4px] rounded-bl-[4px] focus:outline-none placeholder:text-gray-500 focus:border-b-blue-500"
              placeholder="What service are you looking for?"
            />
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="w-5 h-5 text-blue-500" />
              </span>
              <Input
                type="text"
                className=" w-44 h-[52px] border-2 border-gray-400  rounded-tr-[4px] rounded-br-[4px] pl-10 pr-4 py-3 text-lg border-l-0  focus:outline-none placeholder:text-gray-500"
                placeholder="Postcode "
              />
            </div>
            <Button className="bg-blue-500 h-[52px] ml-5 text-lg text-white hover:bg-blue-700 rounded-[4px] px-3 py-2 min-w-[7.75rem]">
              Search
            </Button>
          </div>
          <p className="mt-4 text-md font-medium text-gray-400">
            Popular: House Cleaning, Web Design, Personal Trainers
          </p>
        </div>
      </div>
    </>
  );
}
