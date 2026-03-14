'use client';

import { useTranslations } from 'next-intl';

import { MasonryGallery, type MasonryItem } from '@/core/components/masonry_gallery/MasonryGallery';
import homeData from '@/features/home/data/data.json';

// ── GalleriesHome ─────────────────────────────────────────────────────────────

const galleryItems: MasonryItem[] = homeData.exploreItems.map((item) => ({
  id: item.id,
  src: item.src,
  alt: item.alt,
}));

export function GalleriesHome() {
  const t = useTranslations('home');

  return (
    <section>
      <h2 className="text-text-primary mb-4 text-[2rem] font-medium">{t('explore.title')}</h2>

      <MasonryGallery items={galleryItems} columns={5} gap={3} rounded="lg" />
    </section>
  );
}
