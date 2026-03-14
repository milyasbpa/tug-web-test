'use client';

import * as React from 'react';

import { NavigationModule } from '@/core/modules/navigation';
import { GalleriesHome } from '@/features/home/sections/galleries/Galleries.home';
import { GuidesHome } from '@/features/home/sections/guides/Guides.home';

// ── HomeContainer ─────────────────────────────────────────────────────────────

export function HomeContainer() {
  return (
    <div className="bg-background min-h-screen">
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <NavigationModule />

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl space-y-10 px-6 py-10">
        {/* ── Guide Cards Section ─────────────────────────────────────────── */}
        <GuidesHome />

        {/* ── Explore Section ─────────────────────────────────────────────── */}
        <GalleriesHome />
      </main>
    </div>
  );
}
