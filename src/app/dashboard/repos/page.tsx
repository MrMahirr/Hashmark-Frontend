import { Navbar } from "@/widgets/Navbar";
import { ReposPageContent } from "@/features/repos/components/ReposPageContent";

export default function ReposPage() {
  return (
    <>
      <Navbar title="Depolar" />
      <div className="max-w-5xl mx-auto px-6 py-8 w-full">
        <ReposPageContent />
      </div>
    </>
  );
}
