import PublicNav from '@/components/PublicNav';

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>
        {children}
      </main>
    </div>
  );
}
