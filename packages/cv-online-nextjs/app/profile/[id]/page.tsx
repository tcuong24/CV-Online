import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import ProfileClient from '../ProfileClient';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-[#faf9f6] text-gray-900 font-sans min-h-screen flex flex-col">
      <Header />
      <ProfileClient publicUserId={id} />
      <Footer />
    </div>
  );
}
