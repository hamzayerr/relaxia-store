'use client'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import React from 'react'

const PRODUCT_CONFIG: Record<string, { bg: string; border: string; textColor: string }> = {
  coloflora: { bg: '#E8F5EE', border: '#C8E6D4', textColor: '#0B4D2E' },
  pylorex:   { bg: '#E8EEF5', border: '#C8D4E6', textColor: '#1B2E4D' },
  flexima:   { bg: '#F5EDE8', border: '#E6D4C8', textColor: '#4D2E0B' },
}

interface ProductImageProps {
  src: string
  alt: string
  productId: string
  productNameAr: string
  productNameFr: string
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export default function ProductImage({
  src, alt, productId, productNameAr, productNameFr,
  fill = false, className, priority = false, sizes,
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const cfg = PRODUCT_CONFIG[productId] || PRODUCT_CONFIG['coloflora']

  if (error || !src || src.includes('placeholder')) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4 select-none relative',
          fill ? 'absolute inset-0' : 'w-full h-full',
          className
        )}
        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
      >
        {/* Bottle silhouette SVG */}
        <svg viewBox="0 0 80 120" fill="none" className="w-20 h-28 opacity-30" style={{ color: cfg.textColor }}>
          <rect x="30" y="2" width="20" height="10" rx="4" fill="currentColor"/>
          <path d="M20 18 Q15 25 15 35 L15 100 Q15 110 25 110 L55 110 Q65 110 65 100 L65 35 Q65 25 60 18 Z" fill="currentColor"/>
          <rect x="22" y="45" width="36" height="2" rx="1" fill="white" opacity="0.6"/>
          <rect x="25" y="52" width="30" height="1.5" rx="1" fill="white" opacity="0.5"/>
          <rect x="25" y="57" width="30" height="1.5" rx="1" fill="white" opacity="0.4"/>
          <rect x="25" y="62" width="22" height="1.5" rx="1" fill="white" opacity="0.3"/>
        </svg>

        <div className="text-center px-3">
          <p className="font-cairo font-bold text-sm leading-tight" style={{ color: cfg.textColor }}>
            {productNameAr}
          </p>
          <p className="font-inter text-xs mt-0.5 tracking-widest uppercase opacity-50" style={{ color: cfg.textColor }}>
            {productNameFr}
          </p>
        </div>

        <div className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-cairo font-bold tracking-wider opacity-40"
          style={{ backgroundColor: cfg.border, color: cfg.textColor }}>
          RELAXIA
        </div>
      </div>
    )
  }

  // SVG: use native img tag (next/image doesn't handle SVG well)
  if (src.endsWith('.svg')) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'object-contain w-full h-full',
          fill ? 'absolute inset-0' : '',
          className
        )}
        onError={() => setError(true)}
      />
    )
  }

  if (fill) {
    return (
      <Image
        src={src} alt={alt} fill priority={priority}
        className={cn('object-cover', className)}
        sizes={sizes || '(max-width: 768px) 50vw, 25vw'}
        quality={70}
        loading={priority ? 'eager' : 'lazy'}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <Image
      src={src} alt={alt} width={600} height={600} priority={priority}
      className={cn('object-contain w-full h-full', className)}
      quality={70}
      sizes="(max-width: 768px) 50vw, 25vw"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setError(true)}
    />
  )
}
