import { HeaderBar } from "@/components/common/header-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <HeaderBar />
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
