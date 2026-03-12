"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-[16px] overflow-hidden transition-all duration-300 border",
        isOpen ? "border-black shadow-sm" : "border-gray-100 hover:border-gray-200"
      )}
    >
      <button
        onClick={onClick}
        className="w-full px-6 py-6 md:px-8 flex items-center justify-between text-left group"
      >
        <span className="text-[16px] md:text-[18px] font-bold text-gray-900 group-hover:text-black transition-colors">
          {question}
        </span>
        <div 
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full bg-black flex items-center justify-center transition-all duration-500",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <div className="relative w-4 h-4">
            {/* Horizontal line (Minus) */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2" />
            {/* Vertical line (Plus component) */}
            <div 
              className={cn(
                "absolute top-0 left-1/2 w-[2px] h-full bg-white -translate-x-1/2 transition-all duration-500",
                isOpen ? "rotate-90 scale-y-0 opacity-0" : "rotate-0 scale-y-100 opacity-100"
              )} 
            />
          </div>
        </div>
      </button>
      
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-8 md:px-8 md:pb-8 text-[#6B7280] text-[14px] md:text-[15px] leading-relaxed max-w-3xl">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What types of stays can I book on The starfruit?",
      answer: "We offer a wide range of stays including hotels, villas, resorts, apartments, cottages, glamping sites, and boutique stays. Choose the stay style that fits your travel mood and explore verified options near your location."
    },
    {
      question: "What payment options are available?",
      answer: "We support multiple secure payment methods including credit/debit cards, UPI, net banking, and digital wallets. You can also opt for partial payments for long-term bookings in selected properties."
    },
    {
      question: "Do you offer free cancellation?",
      answer: "Cancellation policies vary by property. Many of our stays offer free cancellation up to 48-72 hours before check-in. Please review the specific cancellation terms on the property page before booking."
    },
    {
      question: "Are the stays verified?",
      answer: "Yes, every property listed on The starfruit undergoes a comprehensive verification process. We personally audit the quality, safety, and amenities to ensure they match our premium standards."
    },
    {
      question: "Do you have long-stay options?",
      answer: "Absolutely! We have a curated selection of properties ideal for digital nomads and long vacations, offering special monthly rates, high-speed Wi-Fi, and comfortable workspaces."
    },
    {
      question: "Is support available if I need help?",
      answer: "Our dedicated support team is available 24/7 to assist you with bookings, property queries, or any issues during your stay. You can reach us via chat, email, or our helpline."
    }
  ];

  return (
    <section className="bg-[#F3F4F6] py-24 px-6 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-[32px] md:text-[45px] font-serif text-center text-gray-900 mb-16 tracking-tight">
          Have questions? We’re here to help
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
