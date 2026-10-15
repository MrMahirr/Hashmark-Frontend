import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";
import { axeViolations } from "@/test/helpers";

function Harness({ onClose = () => undefined }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>aç</button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          onClose();
        }}
        title="Başlık"
      >
        <p>içerik</p>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("kapalıyken içerik yok; açılınca başlıkla etiketlenmiş modal gösterir", async () => {
    render(<Harness />);
    expect(screen.queryByText("içerik")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "aç" }));

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleName("Başlık");
    expect(screen.getByText("içerik")).toBeInTheDocument();
  });

  it("Kapat düğmesi ve arka plan tıklaması kapatır", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "aç" }));
    await userEvent.click(screen.getByRole("button", { name: "Kapat", hidden: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("içerik")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "aç" }));
    await userEvent.click(screen.getByRole("dialog", { hidden: true })); // dialog öğesinin kendisi = arka plan
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("native close olayı (Esc) onClose'u tetikler ve odak tetikleyiciye döner", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole("button", { name: "aç" });
    opener.focus();
    await userEvent.click(opener);

    screen.getByRole("dialog", { hidden: true }).dispatchEvent(new Event("close"));

    expect(onClose).toHaveBeenCalled();
    await vi.waitFor(() => expect(opener).toHaveFocus());
  });

  it("erişilebilirlik ihlali içermez", async () => {
    const { baseElement } = render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "aç" }));

    expect(await axeViolations(baseElement)).toEqual([]);
  });
});
