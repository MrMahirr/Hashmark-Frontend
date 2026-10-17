import { Heading } from "@/shared/ui/Typography";

interface Block {
  title: string | null;
  items: string[];
  paragraphs: string[];
}

/** "## Başlık", "- madde" ve düz satırlardan oluşan metni bloklara ayırır (backend: resources/consent). */
export function parsePolicy(text: string): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      current = { title: line.slice(3).trim(), items: [], paragraphs: [] };
      blocks.push(current);
      continue;
    }
    if (!current) {
      current = { title: null, items: [], paragraphs: [] };
      blocks.push(current);
    }
    if (line.startsWith("- ")) {
      current.items.push(line.slice(2).trim());
    } else {
      current.paragraphs.push(line);
    }
  }
  return blocks;
}

/** Aydınlatma metni: backend'in sunduğu metin aynen (yalnızca biçimlendirilerek) gösterilir. */
export function PolicyText({ text, headingLevel = "h2" }: { text: string; headingLevel?: "h2" | "h3" }) {
  return (
    <div className="flex flex-col gap-6">
      {parsePolicy(text).map((block, i) => (
        <section key={i} className="flex flex-col gap-2">
          {block.title && (
            <Heading as={headingLevel} className="text-[22px] leading-tight">
              {block.title}
            </Heading>
          )}
          {block.paragraphs.map((p, j) => (
            <p key={j} className="m-0 text-base leading-relaxed text-hm-text-secondary">
              {p}
            </p>
          ))}
          {block.items.length > 0 && (
            <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed text-hm-text-secondary">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
