import type { ReactNode } from 'react';

export interface PocComponent {
  component: ReactNode;
}

type PocComponentFactory = () => ReactNode;

const pocRegistry: Record<string, PocComponentFactory> = {};

export function registerPoc(slug: string, factory: PocComponentFactory): void {
  pocRegistry[slug] = factory;
}

export function getPoc(slug: string): PocComponent | undefined {
  const factory = pocRegistry[slug];
  if (!factory) {
    return undefined;
  }
  return {
    component: factory(),
  };
}

export function getAllPocSlugs(): string[] {
  return Object.keys(pocRegistry);
}
