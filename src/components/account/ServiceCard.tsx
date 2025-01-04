// src/components/account/ServiceCard.tsx
import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  icon?: React.ReactNode;
  className?: string;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  title,
  description,
  ctaText,
  ctaLink,
  icon,
  className
}) => {
  return (
    <div className={cn(
      "bg-white rounded-[32px] p-8 shadow-lg transition-all duration-300 hover:shadow-xl",
      className
    )}>
      {icon && (
        <div className="mb-6">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-2xl text-blue-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-8">{description}</p>
      <Link
        href={ctaLink}
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-900 text-white rounded-full hover:bg-accent transition-all duration-300 transform hover:-translate-y-1"
      >
        {ctaText}
      </Link>
    </div>
  );
};
