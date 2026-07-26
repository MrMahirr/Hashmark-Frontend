import { Navbar } from "@/widgets/Navbar";
import { RepoDetailContent } from "@/features/repos/components/RepoDetailContent";

export default function RepoDetailPage() {
  return (
    <>
      <Navbar title="Repo Detail" />
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        <RepoDetailContent />
        <div className="h-12"></div>
      </div>
    </>
  );
}
