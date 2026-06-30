"use client";
import { motion } from "framer-motion";

const LOGOS = [
  { name: "Teleperformance", src: "https://framerusercontent.com/images/6MqbXWXucqBYjTm6hzP0YJ0JLo.png?width=300&height=54" },
  { name: "Bajaj Allianz",   src: "https://framerusercontent.com/images/RdDC2YtfhCyahB7DK6vUOY6Sr0.png?width=368&height=128" },
  { name: "Flipkart",        src: "https://cdn.worldvectorlogo.com/logos/flipkart.svg" },
  { name: "bigbasket",       src: "https://framerusercontent.com/images/BP0vuq7mtsXsInJhngcYqwUFk4.png?width=1030&height=309" },
// { name: "HDFC Bank",    src: "https://logo.clearbit.com/hdfcbank.com" },
  { name: "Swiggy",          src: "https://cdn.worldvectorlogo.com/logos/swiggy-1.svg" },
  { name: "Uber",            src: "https://cdn.worldvectorlogo.com/logos/uber-2.svg" },
  { name: "Urban Company",   src: "https://framerusercontent.com/images/zIskNwdwEZJloMkOYtEQfhGA7fY.png?width=1202&height=339" },
  { name: "Zomato",          src: "https://cdn.worldvectorlogo.com/logos/zomato-2.svg" },
  { name: "Fresh Dunya",     src: "https://framerusercontent.com/images/YALf4vlwSXrvH9eskRLGLLihnUM.png?width=292&height=128" },
//  { name: "Aditya Birla", src: "https://logo.clearbit.com/adityabirlacapital.com" },
  // { name: "Jio",          src: "https://logo.clearbit.com/jio.com" },
  { name: "Shoppers Stop",   src: "https://framerusercontent.com/images/KCRiFij6lCCsfiAwvBcnLZGZN4.png?width=544&height=128" },
// { name: "Tech Mahindra",src: "https://logo.clearbit.com/techmahindra.com" },
];

export function LogoWall() {
  return (
    <section className="relative py-0 md:py-1" data-testid="logo-wall">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <p className="text-center text-xs tracking-[0.22em] uppercase text-zinc-500 font-semibold mb-10">
          Just Justify PAN India Industrial
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <motion.div
            className="flex gap-14 pr-14 w-max items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="flex items-center justify-center h-11 flex-shrink-0">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-8 w-auto max-w-[150px] object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}