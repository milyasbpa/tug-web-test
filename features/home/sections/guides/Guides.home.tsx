'use client';

import { useTranslations } from 'next-intl';

import { useGetGuideCards } from '@/core/api/generated/home/home';
import { GuideCard } from '@/core/components/guide_card/GuideCard';

// ── Types ─────────────────────────────────────────────────────────────────────

interface GuideCardTranslation {
  category: string;
  title: string;
  description: string;
  thumbnailAlt: string;
}

// ── GuidesHome ────────────────────────────────────────────────────────────────

export function GuidesHome() {
  const t = useTranslations('home');
  const guideItems = t.raw('guides.items') as Record<string, GuideCardTranslation>;

  const { data, isPending, isError } = useGetGuideCards();

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Failed to load guide cards.</p>;

  const cards = (data?.data ?? []).map((card) => ({
    ...card,
    ...guideItems[card.id],
  }));

  return (
    <section>
      <h2 className="text-text-primary mb-4 text-[2rem] font-medium">{t('guides.title')}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <GuideCard
            key={card.id}
            category={card.category}
            title={card.title}
            description={card.description}
            thumbnailSrc={card.thumbnailSrc}
            thumbnailAlt={card.thumbnailAlt}
            videoSrc={card.videoSrc}
            onPlay={() => console.log(`Play: ${card.title}`)}
          />
        ))}
      </div>
    </section>
  );
}
