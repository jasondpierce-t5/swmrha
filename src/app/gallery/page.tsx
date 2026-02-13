"use client";

import Image from "next/image";
import { useState } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import { images } from "@/data/images";

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={images.events.hero1}
          alt="Photo Gallery"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-heading-1 text-white font-heading font-bold mb-4">
            Photo Gallery
          </h1>
          <p className="text-gold-500 font-heading text-xl max-w-2xl">
            Capturing the Spirit of Southwest Missouri Reining
          </p>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="bg-navy-800 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <CameraIcon className="w-8 h-8 text-gold-500" />
            <h2 className="text-heading-2 text-white">Our Photos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.gallery.map((imagePath, index) => (
              <div
                key={imagePath}
                className="relative aspect-square overflow-hidden rounded-lg border border-gold-500/20 cursor-pointer group"
                onClick={() => setSelectedIndex(index)}
              >
                <Image
                  src={imagePath}
                  alt={`Gallery photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
