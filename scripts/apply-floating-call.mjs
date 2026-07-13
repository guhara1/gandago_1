import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Injects a self-contained, cache-proof mobile floating call button.
// The CSS is inlined into each page's <head> so it does not depend on the
// (aggressively cached) external styles.css. Idempotent.

const ROOT = process.cwd();
const MARK = 'fc-fixed-v2';
const PHONE = '0508-202-4743';

const STYLE = `    <style data-fc="${MARK}">
      .floating-call{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:linear-gradient(145deg,#ff9a3d,#f4600a);box-shadow:0 10px 24px rgba(244,96,10,.5),0 3px 8px rgba(0,0,0,.28);text-decoration:none;-webkit-tap-highlight-color:transparent;animation:fcBounce 1.7s ease-in-out infinite}
      .floating-call svg{width:28px;height:28px;fill:#fff;transform-origin:50% 60%;animation:fcRing 1.7s ease-in-out infinite}
      .floating-call::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(244,96,10,.55);animation:fcPulse 1.7s ease-out infinite}
      @keyframes fcBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes fcRing{0%,55%,100%{transform:rotate(0)}62%{transform:rotate(-13deg)}70%{transform:rotate(11deg)}78%{transform:rotate(-7deg)}86%{transform:rotate(4deg)}}
      @keyframes fcPulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.7)}}
      @media (min-width:900px){.floating-call{display:none}}
      @media (prefers-reduced-motion:reduce){.floating-call,.floating-call svg,.floating-call::after{animation:none}}
    </style>
`;

const BTN = `    <a class="floating-call" href="tel:${PHONE}" aria-label="전화 예약 문의 ${PHONE}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z"/></svg></a>\n`;

const files = execSync(`grep -rl "styles.css" --include='*.html' ${ROOT}`, { encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean);

let done = 0, skip = 0;
for (const f of files) {
  let s = readFileSync(f, 'utf8');
  if (s.includes(`data-fc="${MARK}"`)) { skip++; continue; }

  // remove any previously-injected floating-call anchor(s)
  s = s.replace(/[ \t]*<a class="floating-call"[\s\S]*?<\/a>\s*\n/g, '');

  // inject inline style into <head>
  if (s.includes('</head>')) s = s.replace('</head>', STYLE + '  </head>');
  // inject the button right before </body>
  const idx = s.lastIndexOf('</body>');
  if (idx !== -1) s = s.slice(0, idx) + BTN + '  ' + s.slice(idx).replace(/^\s*/, '');

  writeFileSync(f, s);
  done++;
}
console.log({ files: files.length, done, skip });
