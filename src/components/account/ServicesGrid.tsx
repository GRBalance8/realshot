// src/components/account/ServicesGrid.tsx
import { FC } from 'react';
import { ServiceCard } from './ServiceCard';

const services = [
  {
    title: "Style Make Over",
    description: "Transform your look with personalized AI-powered style recommendations tailored just for you.",
    ctaText: "Learn More",
    ctaLink: "/services/style-makeover",
    icon: (
      <svg className="w-12 h-12 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
      </svg>
    )
  },
  {
    title: "Full Social Media Make Over",
    description: "Elevate your online presence across all platforms with our comprehensive AI enhancement package.",
    ctaText: "Learn More",
    ctaLink: "/services/social-media-makeover",
    icon: (
      <svg className="w-12 h-12 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/>
      </svg>
    )
  },
  {
    title: "Request More Photos",
    description: "Need additional AI-enhanced photos? Request more shots from your existing or new sessions.",
    ctaText: "Request Photos",
    ctaLink: "/services/request-photos",
    icon: (
      <svg className="w-12 h-12 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )
  },
  {
    title: "Custom Request",
    description: "Have a specific vision in mind? Let's discuss your custom AI photo enhancement needs.",
    ctaText: "Contact Us",
    ctaLink: "/services/custom-request",
    icon: (
      <svg className="w-12 h-12 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    )
  }
];

export const ServicesGrid: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          {...service}
          className={index % 2 === 0 ? "md:transform md:hover:translate-y-2" : "md:transform md:hover:-translate-y-2"}
        />
      ))}
    </div>
  );
};
