/** Looping login illustration: a broom sweeps litter away, sparkles appear. Animations live in globals.css. */
export function CleaningScene() {
  const star = "M0-9 L2.5-2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5-2.5Z";
  return (
    <svg
      viewBox="0 0 400 240"
      className="w-full max-w-md"
      role="img"
      aria-label="Broom sweeping litter"
    >
      <rect x="20" y="196" width="360" height="4" rx="2" fill="rgb(var(--line) / .15)" />
      <g className="debris">
        <rect x="168" y="170" width="14" height="26" rx="4" fill="rgb(var(--water))" />
        <rect x="172" y="162" width="6" height="10" rx="2" fill="rgb(var(--water))" />
      </g>
      <g className="debris d2">
        <circle cx="204" cy="182" r="13" fill="rgb(var(--muted))" />
      </g>
      <g className="debris d3">
        <rect x="236" y="180" width="20" height="16" rx="3" fill="rgb(var(--accent))" />
      </g>
      <g className="broom">
        <line
          x1="120"
          y1="30"
          x2="120"
          y2="172"
          stroke="rgb(var(--fg))"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M98 172h44l10 26H88z" fill="rgb(var(--accent))" />
        {[96, 108, 120, 132, 144].map((x) => (
          <line
            key={x}
            x1={x}
            y1="190"
            x2={x - 2}
            y2="199"
            stroke="rgb(var(--accent-fg))"
            strokeOpacity=".6"
            strokeWidth="2"
          />
        ))}
      </g>
      {[
        [320, 150, 0],
        [350, 120, 0.4],
        [300, 110, 0.8],
      ].map(([x, y, d]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path
            d={star}
            className="spark"
            fill="rgb(var(--ok))"
            style={{ animationDelay: `${d}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
