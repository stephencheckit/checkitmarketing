export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone layout - no navigation header
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
