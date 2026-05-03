import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import ProfileClient from "./ProfileClient";

export default function ProfilePage() {
  return (
    <div className="bg-[#faf9f6] text-gray-900 font-sans min-h-screen flex flex-col">
      <Header />
      <ProfileClient />
      <Footer />
    </div>
  );
}