"use client";

import { Button } from "@/shared/components/Button";
import { MOCK_USER_PROFILE } from "../mock/settings.mock";

export function ProfileSection() {
  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-pill bg-hm-bg border-[0.5px] border-solid border-hm-border flex items-center justify-center">
          <span className="font-medium text-xl text-hm-text-primary">
            {MOCK_USER_PROFILE.initials}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-sm text-hm-text-primary">
            {MOCK_USER_PROFILE.name}
          </h3>
          <p className="text-sm text-hm-text-secondary mt-0.5">
            {MOCK_USER_PROFILE.email}
          </p>
        </div>
      </div>
      <Button variant="danger" onClick={() => console.log("Sign out clicked")}>
        Sign out
      </Button>
    </section>
  );
}
