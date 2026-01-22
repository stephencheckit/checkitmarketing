export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle grid background - positioned behind content */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, black 100%)',
        }}
      />
      {/* Content layer */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
