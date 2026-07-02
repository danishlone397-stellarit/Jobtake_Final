import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { AIMatching } from "@/components/home/AIMatching";

export default function AIMatchPage() {
  return (
    <main className="min-h-screen">
      <PublicNav />
      <div className="pt-20" />
      <AIMatching />
      <PublicFooter />
    </main>
  );
}
