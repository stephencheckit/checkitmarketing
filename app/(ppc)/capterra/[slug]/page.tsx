import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategory, getAllCategorySlugs } from '@/lib/ppc-config';
import CapterraLandingPage from './CapterraLandingPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: category.metaTitle,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export default async function CapterraPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  return <CapterraLandingPage category={category} />;
}
