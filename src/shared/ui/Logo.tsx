import { cn } from "./cn";

interface LogoProps {
  /** Footer gibi küçük yerlerde `0.75`. */
  scale?: number;
  className?: string;
}

/** Sayma çubuğu (tally) logosu: 4 çubuk + eğik vurgu çizgisi. Dekoratiftir. */
export function Logo({ scale = 1, className }: LogoProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-block h-6 w-[34px] flex-none", className)}
      style={scale === 1 ? undefined : { transform: `scale(${scale})`, transformOrigin: "left center" }}
    >
      {[2, 10, 18, 26].map((left) => (
        <i
          key={left}
          className="absolute top-0 h-6 w-[3px] rounded-[2px] bg-hm-text-primary"
          style={{ left }}
        />
      ))}
      <b className="absolute -left-[3px] top-[10px] h-[3px] w-[42px] -rotate-[24deg] rounded-[2px] bg-hm-acc" />
    </span>
  );
}
