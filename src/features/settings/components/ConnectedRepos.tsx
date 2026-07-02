"use client";

import { Button } from "@/shared/components/Button";
import { MOCK_CONNECTED_REPOS } from "../mock/settings.mock";
import { GitBranch, Unplug } from "lucide-react";

export function ConnectedRepos() {
  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm text-hm-text-primary mb-1">
            Connected Repositories
          </h3>
          <p className="text-sm text-hm-text-secondary">
            Manage your connected GitHub repositories.
          </p>
        </div>
        <Button variant="secondary" leftIcon={<GitBranch className="w-4 h-4" />}>
          Connect Repo
        </Button>
      </div>

      {MOCK_CONNECTED_REPOS.length > 0 ? (
        <div className="space-y-3">
          {MOCK_CONNECTED_REPOS.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between p-3 rounded-control border-[0.5px] border-solid border-hm-border bg-hm-bg"
            >
              <div className="flex items-center gap-3">
                <GitBranch className="w-5 h-5 text-hm-text-secondary" />
                <div>
                  <h4 className="text-sm font-medium text-hm-text-primary">
                    {repo.owner}/{repo.name}
                  </h4>
                  <p className="text-xs text-hm-text-muted mt-0.5">
                    Connected on {new Date(repo.connectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-hm-text-secondary hover:text-hm-danger hover:bg-hm-danger-bg"
                leftIcon={<Unplug className="w-3.5 h-3.5" />}
                onClick={() => console.log(`Disconnect ${repo.name}`)}
              >
                Disconnect
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-hm-text-secondary">
            No repositories connected yet.
          </p>
        </div>
      )}
    </section>
  );
}
