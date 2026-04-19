import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <div className="bg-[#faf9f6] text-gray-900 font-sans min-h-screen flex flex-col">
      <Header />
      <DashboardClient />
      <Footer />
    </div>
  );
}
