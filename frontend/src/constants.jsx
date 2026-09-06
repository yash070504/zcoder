export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};

const createSvgDataUrl = (bg1, bg2, innerSvg) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="url(#bg)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>${innerSvg}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const DEFAULT_AVATARS = [
  {
    id: "cyber-bot",
    name: "Cyber Bot",
    url: createSvgDataUrl(
      "#4f46e5",
      "#06b6d4",
      `<circle cx="50" cy="20" r="5" fill="#38bdf8"/><line x1="50" y1="20" x2="50" y2="35" stroke="#38bdf8" stroke-width="4"/><rect x="25" y="35" width="50" height="38" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/><rect x="33" y="44" width="12" height="10" rx="3" fill="#22d3ee"/><rect x="55" y="44" width="12" height="10" rx="3" fill="#22d3ee"/><path d="M38 62 Q50 68 62 62" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="18" y="46" width="6" height="14" rx="2" fill="#38bdf8"/><rect x="76" y="46" width="6" height="14" rx="2" fill="#38bdf8"/>`
    )
  },
  {
    id: "neon-coder",
    name: "Neon Developer",
    url: createSvgDataUrl(
      "#0f766e",
      "#10b981",
      `<circle cx="50" cy="45" r="22" fill="#fed7aa"/><path d="M28 42 C28 26 40 22 50 22 C60 22 72 26 72 42 C72 32 66 28 50 28 C34 28 28 34 28 42 Z" fill="#334155"/><rect x="34" y="40" width="14" height="10" rx="2" fill="#0f172a" stroke="#10b981" stroke-width="2.5"/><rect x="52" y="40" width="14" height="10" rx="2" fill="#0f172a" stroke="#10b981" stroke-width="2.5"/><line x1="48" y1="45" x2="52" y2="45" stroke="#10b981" stroke-width="2"/><path d="M42 58 Q50 64 58 58" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M22 88 C22 70 34 68 50 68 C66 68 78 70 78 88 Z" fill="#0284c7"/>`
    )
  },
  {
    id: "code-wizard",
    name: "Code Wizard",
    url: createSvgDataUrl(
      "#7e22ce",
      "#ec4899",
      `<polygon points="50,15 28,46 72,46" fill="#581c87"/><ellipse cx="50" cy="46" rx="28" ry="7" fill="#7e22ce"/><circle cx="50" cy="46" r="18" fill="#fde047"/><circle cx="44" cy="46" r="2.5" fill="#1e1b4b"/><circle cx="56" cy="46" r="2.5" fill="#1e1b4b"/><path d="M36 54 C36 78 50 82 50 82 C50 82 64 78 64 54 Z" fill="#f8fafc"/><path d="M50 24 L52 28 L56 29 L53 32 L54 36 L50 34 L46 36 L47 32 L44 29 L48 28 Z" fill="#fde047"/>`
    )
  },
  {
    id: "matrix-ninja",
    name: "Matrix Ninja",
    url: createSvgDataUrl(
      "#1e1b4b",
      "#6366f1",
      `<circle cx="50" cy="48" r="24" fill="#1e293b"/><path d="M26 44 L74 44 L74 62 L26 62 Z" fill="#0f172a"/><path d="M34 50 L46 50 L43 54 L37 54 Z" fill="#22d3ee"/><path d="M54 50 L66 50 L63 54 L57 54 Z" fill="#22d3ee"/><path d="M22 88 C22 72 34 68 50 68 C66 68 78 72 78 88 Z" fill="#1e1b4b"/><rect x="22" y="34" width="56" height="8" rx="3" fill="#6366f1"/>`
    )
  },
  {
    id: "cosmic-astro",
    name: "Cosmic Astro",
    url: createSvgDataUrl(
      "#c2410c",
      "#fbbf24",
      `<circle cx="50" cy="46" r="24" fill="#f8fafc"/><ellipse cx="50" cy="46" rx="18" ry="14" fill="#090d16" stroke="#f59e0b" stroke-width="2.5"/><ellipse cx="44" cy="42" rx="6" ry="3" fill="#fde68a" opacity="0.6"/><path d="M22 88 C22 70 34 68 50 68 C66 68 78 70 78 88 Z" fill="#f8fafc"/><rect x="36" y="70" width="28" height="12" rx="3" fill="#3b82f6"/>`
    )
  },
  {
    id: "arcade-gamer",
    name: "Arcade Gamer",
    url: createSvgDataUrl(
      "#be185d",
      "#f43f5e",
      `<circle cx="50" cy="48" r="22" fill="#fbcfe8"/><path d="M26 40 C26 26 40 24 50 24 C60 24 74 26 74 40 Z" fill="#831843"/><path d="M24 45 C24 30 36 22 50 22 C64 22 76 30 76 45" fill="none" stroke="#e11d48" stroke-width="5" stroke-linecap="round"/><rect x="22" y="42" width="8" height="16" rx="4" fill="#be185d"/><rect x="70" y="42" width="8" height="16" rx="4" fill="#be185d"/><circle cx="43" cy="47" r="3" fill="#1e293b"/><circle cx="57" cy="47" r="3" fill="#1e293b"/><path d="M44 57 Q50 62 56 57" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M22 88 C22 70 34 68 50 68 C66 68 78 70 78 88 Z" fill="#4c0519"/>`
    )
  },
  {
    id: "quantum-fox",
    name: "Quantum Fox",
    url: createSvgDataUrl(
      "#0369a1",
      "#38bdf8",
      `<polygon points="28,25 38,45 22,45" fill="#f97316"/><polygon points="72,25 62,45 78,45" fill="#f97316"/><polygon points="32,29 37,42 26,42" fill="#ffedd5"/><polygon points="68,29 63,42 74,42" fill="#ffedd5"/><circle cx="50" cy="50" r="24" fill="#ea580c"/><path d="M30 50 Q50 68 70 50 Q50 78 30 50 Z" fill="#fff7ed"/><circle cx="42" cy="48" r="3" fill="#0f172a"/><circle cx="58" cy="48" r="3" fill="#0f172a"/><polygon points="50,56 46,52 54,52" fill="#0f172a"/><path d="M22 88 C22 72 34 68 50 68 C66 68 78 72 78 88 Z" fill="#0284c7"/>`
    )
  }
];
