export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#ffffff"/>
    <path d="M16 48 29 14h8L24 48z" fill="#ff6b1a"/>
    <path d="M24 48 38 26h9L33 48z" fill="#143c8c"/>
    <circle cx="44" cy="16" r="5" fill="#143c8c"/>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
