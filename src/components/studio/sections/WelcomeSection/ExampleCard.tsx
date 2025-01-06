// src/components/studio/sections/WelcomeSection/ExampleCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/studio/components/Card';
import type { ExampleType } from './types';

interface ExampleCardProps {
  example: ExampleType;
  type: 'good' | 'bad';
}

export function ExampleCard({ example, type }: ExampleCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Card>
      <div className="aspect-w-4 aspect-h-5 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-t-2xl" />
        )}
        
        <div className="relative w-full h-full">
          <Image
            src="/api/placeholder/400/500"
            alt={example.title}
            width={400}
            height={500}
            className="rounded-t-2xl object-cover transition-opacity duration-300"
            style={{ opacity: isLoading ? 0 : 1 }}
            onLoadingComplete={() => setIsLoading(false)}
            priority={false}
            quality={75}
            unoptimized
          />
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="font-serif text-2xl text-blue-900 mb-3">{example.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{example.description}</p>
        <ul className="space-y-3">
          {example.tips.map((tip, index) => (
            <li 
              key={index} 
              className="flex items-start text-gray-500"
            >
              <span 
                className={`mr-2 ${type === 'good' ? 'text-accent' : 'text-red-500'}`}
                aria-hidden="true"
              >
                •
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
