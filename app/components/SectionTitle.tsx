export default function SectionTitle({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-[11px] tracking-[0.35em] text-muted">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-2xl font-normal tracking-[0.12em] sm:text-3xl">{title}</h2>
      {desc && (
        <p className={`mt-4 max-w-lg text-sm leading-7 text-muted ${align === "center" ? "mx-auto" : ""}`}>{desc}</p>
      )}
    </div>
  );
}
