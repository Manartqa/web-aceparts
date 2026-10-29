interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  light?: boolean;
  align?: "left" | "center";
}

// Keeps the WordPress "[ EYEBROW ] + title" pattern, restyled.
export default function SectionHeading({ eyebrow, title, light = false, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`inline-flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.25em] ${
          light ? "text-accent" : "text-brand/70"
        }`}
      >
        <span className="h-px w-8 bg-accent" aria-hidden />
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
