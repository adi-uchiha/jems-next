
import { useEffect, useRef } from "react";

const partners = [
  { name: "Google", logo: "https://cdn-icons-png.flaticon.com/512/300/300221.png" },
  { name: "Microsoft", logo: "https://cdn-icons-png.flaticon.com/512/732/732221.png" },
  { name: "Amazon", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968217.png" },
  { name: "Stanford", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png" },
  { name: "MIT", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png" },
  { name: "Harvard", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Harvard_shield_wreath.svg/1200px-Harvard_shield_wreath.svg.png" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1200px-Meta_Platforms_Inc._logo.svg.png" },
  { name: "Netflix", logo: "https://cdn-icons-png.flaticon.com/512/5977/5977590.png" },
  { name: "Apple", logo: "https://cdn-icons-png.flaticon.com/512/0/747.png" },
  { name: "Tesla", logo: "https://cdn-icons-png.flaticon.com/512/5969/5969405.png" }
];

const Partners = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cloneMarqueeContent = () => {
      if (marqueeRef.current) {
        const content = marqueeRef.current.querySelector('.marquee-content');
        if (content) {
          const clone = content.cloneNode(true);
          marqueeRef.current.appendChild(clone);
        }
      }
    };

    cloneMarqueeContent();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12">
          Used by Engineers from
        </h2>
        
        <div ref={marqueeRef} className="marquee overflow-hidden">
          <div className="marquee-content inline-flex">
            {partners.map((partner, index) => (
              <div key={index} className="marquee-item">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="h-8 md:h-10 w-auto object-contain mr-3 filter grayscale hover:grayscale-0 transition-all duration-300"
                />
                <span className="text-sm font-medium">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
