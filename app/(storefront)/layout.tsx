import HeaderMinimal from '@/components/storefront/HeaderMinimal';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <HeaderMinimal />
      {children}
    </div>
  );
}
