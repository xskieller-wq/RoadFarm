"use client";

import { useEffect, useState } from "react";
import type { BuyerNotificationSettings } from "@/lib/buyer/buyer-types";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  loadNotificationSettings,
  persistNotificationSettings,
} from "@/lib/buyer/buyer-preferences";
import { freshDropPagePanel } from "@/lib/freshdrop/buyer-page-styles";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 border-b border-warm-100 py-3 last:border-0 last:pb-0">
      <span>
        <span className="block text-sm font-semibold text-warm-900">{label}</span>
        <span className="mt-0.5 block text-xs text-warm-600">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-warm-300 text-warm-900 focus:ring-amber-400/40"
      />
    </label>
  );
}

export default function NotificationSettingsPanel({ showEmail = true }: { showEmail?: boolean }) {
  const [settings, setSettings] = useState<BuyerNotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

  useEffect(() => {
    setSettings(loadNotificationSettings());
  }, []);

  const update = (patch: Partial<BuyerNotificationSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    persistNotificationSettings(next);
  };

  return (
    <div className={freshDropPagePanel}>
      <p className="text-sm font-bold text-warm-950">Notification settings</p>
      <div className="mt-3">
        <ToggleRow
          label="Morning drops"
          description="Paczki, sourdough, and croissants before they sell out"
          checked={settings.morningDrops}
          onChange={(v) => update({ morningDrops: v })}
        />
        <ToggleRow
          label="Fresh batch alerts"
          description="When a followed baker posts a new batch"
          checked={settings.batchAlerts}
          onChange={(v) => update({ batchAlerts: v })}
        />
        <ToggleRow
          label="Reservation reminders"
          description="Pickup window reminders for active reserves"
          checked={settings.reservationReminders}
          onChange={(v) => update({ reservationReminders: v })}
        />
        <ToggleRow
          label="Followed bakers only"
          description="Skip alerts from bakers you do not follow"
          checked={settings.followedBakerOnly}
          onChange={(v) => update({ followedBakerOnly: v })}
        />
      </div>
      {showEmail && (
        <div className="mt-4 border-t border-warm-100 pt-4">
          <label className="mb-1.5 block text-xs font-semibold text-warm-700">Alert email</label>
          <input
            type="email"
            className="input-field bg-white"
            placeholder="you@example.com"
            value={settings.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
