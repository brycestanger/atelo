import type { ColourProfile } from "@/lib/types";

/** Presentational render of a ColourProfile — the automatic colour summary.
 *  Pure (no hooks) so it works in both server and client trees. */
export function ProfileCard({ profile }: { profile: ColourProfile }) {
  return (
    <div>
      {/* persona */}
      <div className="flex items-center gap-4">
        <span
          className="size-14 shrink-0 rounded-2xl shadow-soft ring-1 ring-black/10"
          style={{ background: profile.familyHex }}
        />
        <div className="min-w-0">
          <div className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            Your colour profile
          </div>
          <div className="mt-1 text-[1.5rem] font-semibold leading-none tracking-[-0.02em]">
            {profile.persona}
          </div>
        </div>
      </div>

      <h3 className="mt-6 text-[clamp(1.5rem,4vw,2.2rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
        {profile.headline}
      </h3>
      <p className="mt-3 max-w-[54ch] text-[1.02rem] leading-relaxed text-ink/80">
        {profile.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {profile.traits.map((t) => (
          <span
            key={t}
            className="rounded-full bg-surface-2 px-3 py-1.5 text-[0.8rem] font-medium text-ink/80"
          >
            {t}
          </span>
        ))}
      </div>

      {/* palette */}
      <div className="mt-8">
        <div className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
          Your palette
        </div>
        <div className="mt-3 flex gap-2.5">
          {profile.palette.map((c) => (
            <div key={c.hex} className="min-w-0 flex-1">
              <div
                className="aspect-square w-full rounded-xl shadow-soft ring-1 ring-black/10"
                style={{ background: c.hex }}
              />
              <div className="mt-1.5 truncate text-[0.72rem] font-medium">{c.name}</div>
              <div className="truncate text-[0.64rem] uppercase tracking-wide text-faint">
                {c.hex}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* suggestions */}
      <div className="mt-8">
        <div className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
          Worth exploring next
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {profile.suggestions.map((s) => (
            <div
              key={s.hex}
              className="flex items-center gap-3 rounded-xl bg-surface p-3 shadow-soft"
            >
              <span
                className="size-10 shrink-0 rounded-lg ring-1 ring-black/10"
                style={{ background: s.hex }}
              />
              <div className="min-w-0">
                <div className="truncate text-[0.85rem] font-medium">{s.name}</div>
                <div className="text-[0.74rem] leading-snug text-muted">{s.why}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
