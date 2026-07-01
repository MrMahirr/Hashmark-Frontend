import { Navbar } from "@/widgets/Navbar";
import { RepoList } from "@/features/repos/components/RepoList";
import { MOCK_REPOS } from "@/features/repos/mock/repos.mock";
import { Plus } from "lucide-react";

export default function ReposPage() {
  return (
    <>
      <Navbar title="Repos" />
      <div className="max-w-5xl mx-auto px-6 py-8 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[16px] font-medium text-hm-text-primary">Your repos</h2>
          <button className="bg-hm-text-primary text-hm-surface px-4 py-2 rounded font-sans text-sm font-medium flex items-center gap-2 transition-opacity hover:opacity-90">
            <Plus size={18} />
            Connect a repo
          </button>
        </div>
        
        {/* Repo List */}
        <RepoList repos={MOCK_REPOS} />
      </div>
    </>
  );
}
