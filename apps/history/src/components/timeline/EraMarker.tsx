'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface EraMarkerProps {
  era: {
    name: string;
    start: number;
    end: number;
    color: string;
  };
  index: number;
  totalEras: number;
}

export function EraMarker({ era, index, totalEras }: EraMarkerProps) {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (markerRef.current) {
      gsap.fromTo(markerRef.current,
        { 
          opacity: 0, 
          scale: 0,
          x: -50
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          delay: index * 0.2,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [index]);

  return (
    <div 
      ref={markerRef}
      className="absolute left-4 transform -translate-x-1/2"
      style={{ 
        top: `${(index / (totalEras - 1)) * 100}%`,
        transform: 'translateX(-50%)'
      }}
    >
      <div 
        className="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
        style={{ backgroundColor: era.color }}
      >
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
      
      <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/20">
        <div className="text-white font-semibold text-sm">{era.name}</div>
        <div className="text-slate-300 text-xs">{era.start}-{era.end}</div>
      </div>
    </div>
  );
}
