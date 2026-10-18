import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axeViolations } from "@/test/helpers";
import { Button, Chip, DataRow, Field, IconButton, Panel, Segmented, Switch, TagBadge, tagColor } from ".";

describe("shared/ui ilkelleri", () => {
  it("Chip: aria-pressed seçili durumu yansıtır ve tıklamayı iletir", async () => {
    const onClick = vi.fn();
    render(
      <Chip pressed onClick={onClick}>
        TODO
      </Chip>,
    );
    const chip = screen.getByRole("button", { name: "TODO" });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("Switch: role=switch, aria-checked; Space ve Enter ile değişir", async () => {
    function Harness() {
      const [on, setOn] = useState(false);
      return <Switch checked={on} onCheckedChange={setOn} aria-label="Özet" />;
    }
    render(<Harness />);
    const sw = screen.getByRole("switch", { name: "Özet" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    sw.focus();
    await userEvent.keyboard(" ");
    expect(sw).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Enter}");
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("Segmented: seçili seçenek aria-pressed, tıklama onChange çağırır", async () => {
    const onChange = vi.fn();
    render(
      <Segmented
        aria-label="Dil"
        value="tr"
        onChange={onChange}
        options={[
          { value: "tr", label: "TR" },
          { value: "en", label: "EN" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "TR" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(onChange).toHaveBeenCalledWith("en");
  });

  it("Field: hata aria-invalid + aria-describedby ile bağlanır", () => {
    render(<Field label="E-posta" error="Geçersiz adres" />);
    const input = screen.getByLabelText("E-posta");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Geçersiz adres");
  });

  it("TagBadge: etiket rengi değişkene eşlenir", () => {
    expect(tagColor("FIXME")).toBe("var(--hm-fixme)");
    // Yerleşik olmayan etiketler .hashmark.yml özel etiketleridir: ortak renk
    expect(tagColor("SECURITY")).toBe("var(--hm-custom)");
    expect(tagColor("")).toBe("var(--hm-text-secondary)");
    render(<TagBadge tag="TODO" />);
    expect(screen.getByText("TODO")).toBeInTheDocument();
  });

  it("Button yüklenirken devre dışıdır", () => {
    render(<Button isLoading>Kaydet</Button>);
    expect(screen.getByRole("button", { name: "Kaydet" })).toBeDisabled();
  });

  it("birleşik render erişilebilirlik ihlali içermez", async () => {
    const { container } = render(
      <Panel>
        <IconButton aria-label="Bildirimler">!</IconButton>
        <Button variant="outline">Tara</Button>
        <DataRow>
          <TagBadge tag="HACK" />
          <span>yol</span>
          <span>not</span>
          <span>tarih</span>
        </DataRow>
      </Panel>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
