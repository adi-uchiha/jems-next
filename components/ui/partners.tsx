'use client'

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const partners = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/768px-Microsoft_logo_%282012%29.svg.png" },
  { name: "Amazon", logo: "https://static.vecteezy.com/system/resources/previews/019/766/240/non_2x/amazon-logo-amazon-icon-transparent-free-png.png" },
  { name: "Stanford", logo: "https://assets.stickpng.com/images/61487e50d329bb0004dbd337.png" },
  { name: "MIT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/2560px-MIT_logo.svg.png" },
  { name: "Harvard", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/2560px-Harvard_University_logo.svg.png" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/1024px-Meta-Logo.png" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png" },
  { name: "Apple", logo: "https://www.freepnglogos.com/uploads/apple-logo-png/apple-logo-png-dallas-shootings-don-add-are-speech-zones-used-4.png" },
  { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/1200px-Tesla_logo.png" }
];

const Partners = () => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-small-white/[0.015] dark:bg-grid-small-white/[0.025]" />
      
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          Used by Engineers from
        </h2>
        
        <div 
          ref={containerRef}
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={cn(
            "flex space-x-8 animate-scroll",
            isHovered ? "animation-play-state-paused" : ""
          )}>
            {/* First set of logos */}
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-40 h-20 group"
              >
                <div className="relative w-32 h-12">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                  
                    className={cn(
                      "object-contain transition-all duration-300",
                      "filter grayscale hover:grayscale-0",
                      "opacity-60 hover:opacity-100"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
