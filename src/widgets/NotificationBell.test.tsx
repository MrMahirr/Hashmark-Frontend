import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  notifications: vi.fn(),
  markRead: vi.fn(),
  markAll: vi.fn(),
}));

vi.mock("@/features/notifications/hooks/useNotifications", () => ({
  useNotifications: mocks.notifications,
  useMarkAsRead: () => ({ mutate: mocks.markRead, isPending: false }),
  useMarkAllAsRead: () => ({ mutate: mocks.markAll, isPending: false }),
}));

import { NotificationBell } from "./NotificationBell";
import { axeViolations } from "@/test/helpers";

const items = [
  { id: 1, title: "Tarama bitti", description: "12 borç", type: "SUCCESS", read: false, createdAt: "2026-01-01T10:00:00Z" },
  { id: 2, title: "Eski", description: "okundu", type: "INFO", read: true, createdAt: "2026-01-01T09:00:00Z" },
];

describe("NotificationBell", () => {
  beforeEach(() => {
    mocks.notifications.mockReset();
    mocks.markRead.mockReset();
    mocks.markAll.mockReset();
    mocks.notifications.mockReturnValue({ data: items, isLoading: false });
  });

  it("okunmamış sayısını erişilebilir ad olarak bildirir", () => {
    render(<NotificationBell />);

    expect(screen.getByRole("button", { name: "1 okunmamış bildirim" })).toHaveAttribute("aria-expanded", "false");
  });

  it("açılır, okunmamışı tıklayınca okundu işaretler", async () => {
    render(<NotificationBell />);

    await userEvent.click(screen.getByRole("button", { name: "1 okunmamış bildirim" }));
    expect(screen.getByRole("dialog", { name: "Bildirimler" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Okundu işaretle: Tarama bitti" }));
    expect(mocks.markRead).toHaveBeenCalledWith(1);

    await userEvent.click(screen.getByRole("button", { name: "Tümünü okundu işaretle" }));
    expect(mocks.markAll).toHaveBeenCalled();
  });

  it("Esc ile kapanır ve odak zile döner", async () => {
    render(<NotificationBell />);
    const bell = screen.getByRole("button", { name: "1 okunmamış bildirim" });
    await userEvent.click(bell);

    // jsdom Esc'yi işlemez; tarayıcının yerel "close" olayını taklit ediyoruz (bkz. Dialog.test)
    act(() => {
      screen.getByRole("dialog", { name: "Bildirimler" }).dispatchEvent(new Event("close"));
    });

    expect(screen.queryByRole("dialog", { name: "Bildirimler" })).not.toBeInTheDocument();
    expect(bell).toHaveFocus();
  });

  it("Okunmamış sekmesi yalnızca okunmamışları listeler", async () => {
    render(<NotificationBell />);
    await userEvent.click(screen.getByRole("button", { name: "1 okunmamış bildirim" }));

    await userEvent.click(screen.getByRole("button", { name: "Okunmamış (1)" }));

    expect(screen.getByText("Tarama bitti")).toBeInTheDocument();
    expect(screen.queryByText("Eski")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Okunmamış (1)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("boş listede açıklama gösterir", async () => {
    mocks.notifications.mockReturnValue({ data: [], isLoading: false });
    render(<NotificationBell />);

    await userEvent.click(screen.getByRole("button", { name: "Bildirimleri aç" }));

    expect(screen.getByText("Henüz bir bildiriminiz yok.")).toBeInTheDocument();
  });

  it("erişilebilirlik ihlali içermez", async () => {
    const { container } = render(<NotificationBell />);
    await userEvent.click(screen.getByRole("button", { name: "1 okunmamış bildirim" }));

    expect(await axeViolations(container)).toEqual([]);
  });
});
