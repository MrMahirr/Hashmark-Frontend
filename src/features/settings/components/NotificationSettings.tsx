"use client";

import { useState } from "react";
import { MOCK_NOTIFICATION_SETTINGS } from "../mock/settings.mock";

export function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = useState(
    MOCK_NOTIFICATION_SETTINGS.weeklyReport
  );

  return (
    <section className="bg-hm-surface rounded-card border-[0.5px] border-solid border-hm-border p-5 space-y-6">
      <div>
        <h3 className="font-medium text-sm text-hm-text-primary mb-1">
          Weekly report
        </h3>
        <p className="text-sm text-hm-text-secondary">
          Configure how you receive your weekly technical debt summary.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="email-toggle"
          className="text-sm font-medium text-hm-text-primary cursor-pointer select-none"
        >
          Email notifications
        </label>
        
        <button
          id="email-toggle"
          type="button"
          role="switch"
          aria-checked={emailEnabled}
          onClick={() => setEmailEnabled(!emailEnabled)}
          className={`
            relative inline-flex h-5 w-10 items-center rounded-full
            transition-colors duration-200 ease-in-out focus:outline-none 
            ${emailEnabled ? "bg-hm-blue" : "bg-hm-border"}
          `}
        >
          <span className="sr-only">Toggle email notifications</span>
          <span
            className={`
              inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out
              ${emailEnabled ? "translate-x-5.5" : "translate-x-1"}
            `}
          />
        </button>
      </div>
    </section>
  );
}
