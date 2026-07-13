import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const SITE = 'https://gandago.xyz';
const MARK = 'seo-enh-v1';

const REGION_KO = { seoul: '서울', gyeonggi: '경기', incheon: '인천' };
const SECTION_KO = {
  service: '서비스 안내', guide: '이용 안내', reviews: '이용 후기',
  magazine: '매거진', about: '회사 소개', contact: '고객센터', policy: '운영 정책',
};

const files = execSync(`grep -rl "styles.css" --include='*.html' ${ROOT}`, { encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean);

const rel = (f) => f.replace(ROOT + '/', '');
const jsonEsc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
const h1Of = (s) => {
  const m = s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return m ? m[1].replace(/<[^>]+>/g, '').trim() : '';
};
const titleOf = (s) => {
  const m = s.match(/<title>([\s\S]*?)<\/title>/);
  return m ? m[1].split('|')[0].trim() : '';
};
const canonOf = (s) => {
  const m = s.match(/<link rel="canonical" href="([^"]+)"/);
  return m ? m[1] : '';
};

// ---- Build city map: region -> [{name, slug}] (direct city pages only) ----
const cityMap = { seoul: [], gyeonggi: [], incheon: [] };
for (const f of files) {
  const r = rel(f);
  const p = r.split('/'); // area/<region>/<city>/index.html  => length 4
  if (p[0] === 'area' && p.length === 4 && p[3] === 'index.html') {
    const region = p[1], slug = p[2];
    const s = readFileSync(f, 'utf8');
    const name = (h1Of(s).replace(/\s*출장마사지$/, '') || slug).trim();
    if (cityMap[region]) cityMap[region].push({ name, slug });
  }
}
for (const r of Object.keys(cityMap)) cityMap[r].sort((a, b) => a.name.localeCompare(b.name, 'ko'));

// ---- Builders ----
function crumbNav(items) {
  // items: [{name, url|null}]
  const inner = items.map((it, i) => {
    const last = i === items.length - 1;
    const label = last || !it.url
      ? `<span aria-current="page">${it.name}</span>`
      : `<a href="${it.url}">${it.name}</a>`;
    return label;
  }).join('<span class="breadcrumb-sep" aria-hidden="true">›</span>');
  return `    <nav class="breadcrumb" aria-label="현재 위치"><!-- ${MARK} -->\n      ${inner}\n    </nav>\n`;
}

function crumbSchema(items) {
  const el = items.map((it, i) => {
    const base = `{ "@type": "ListItem", "position": ${i + 1}, "name": "${jsonEsc(it.name)}"`;
    return it.url ? `${base}, "item": "${it.url}" }` : `${base} }`;
  }).join(',\n          ');
  return `    <script type="application/ld+json"><!-- ${MARK} -->\n      {\n        "@context": "https://schema.org",\n        "@type": "BreadcrumbList",\n        "itemListElement": [\n          ${el}\n        ]\n      }\n    </script>\n`;
}

function faqSchema(html) {
  const items = [];
  const re = /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) {
    const q = m[1].replace(/<[^>]+>/g, '').trim();
    const a = m[2].replace(/<[^>]+>/g, '').trim();
    if (q && a) items.push({ q, a });
  }
  if (items.length < 1) return '';
  const el = items.map((it) =>
    `{\n            "@type": "Question",\n            "name": "${jsonEsc(it.q)}",\n            "acceptedAnswer": { "@type": "Answer", "text": "${jsonEsc(it.a)}" }\n          }`
  ).join(',\n          ');
  return `    <script type="application/ld+json"><!-- ${MARK} -->\n      {\n        "@context": "https://schema.org",\n        "@type": "FAQPage",\n        "mainEntity": [\n          ${el}\n        ]\n      }\n    </script>\n`;
}

function areaRelatedSection(region, selfSlug, leaf) {
  const sibs = cityMap[region].filter((c) => c.slug !== selfSlug);
  // stable pick: up to 8 siblings around self by sorted order
  const idx = cityMap[region].findIndex((c) => c.slug === selfSlug);
  const ordered = [...sibs];
  const pick = ordered.slice(0, 8);
  const regionKo = REGION_KO[region];
  const links = pick.map((c) =>
    `<a href="/area/${region}/${c.slug}/">${c.name} 출장마사지</a>`
  ).join('\n            ');
  const kw = [
    [`${leaf} 출장마사지 예약 방법`, '/guide/reservation/'],
    [`${leaf} 홈타이 방문 안내`, '/service/hometai/'],
    [`${leaf} 스웨디시 관리 요금`, '/guide/price/'],
    [`${leaf} 아로마 방문 관리`, '/service/aroma/'],
    [`${leaf} 방문 가능 지역 확인`, '/guide/available-area/'],
    [`${leaf} 출장마사지 이용 후기`, '/reviews/'],
  ].map(([t, u]) => `<a href="${u}">${t}</a>`).join('\n            ');
  return `        <article class="area-link-panel"><!-- ${MARK} -->
          <p class="eyebrow">Related Areas</p>
          <h2>${regionKo} 지역 함께 보기</h2>
          <p>${leaf} 예약이 어렵거나 희망 시간이 맞지 않을 때는 같은 ${regionKo} 권역의 다른 지역도 함께 확인하면 선택지가 넓어집니다. 아래 지역별 안내에서 이동 조건과 방문 가능 시간을 비교해 보세요.</p>
          <div class="local-link-grid">
            ${links}
          </div>
        </article>
        <article class="area-link-panel"><!-- ${MARK} -->
          <p class="eyebrow">Popular Searches</p>
          <h2>${leaf} 관련 자주 찾는 안내</h2>
          <p>${leaf} 방문 관리를 준비할 때 많이 찾는 항목입니다. 예약 절차, 관리 종류, 요금 기준, 방문 가능 지역을 미리 확인하면 상담이 빨라집니다.</p>
          <div class="local-link-grid">
            ${kw}
          </div>
        </article>
`;
}

// ---- Process ----
let stat = { crumb: 0, faq: 0, related: 0, skipped: 0 };
for (const f of files) {
  let s = readFileSync(f, 'utf8');
  if (s.includes(MARK)) { stat.skipped++; continue; }
  const orig = s;
  const r = rel(f);
  const p = r.split('/');
  const canon = canonOf(s) || `${SITE}/${p.slice(0, -1).join('/')}/`;
  const isArea = p[0] === 'area';

  // Build breadcrumb items
  let items = [{ name: '홈', url: `${SITE}/` }];
  let leaf = '';
  if (isArea) {
    const region = p[1];
    const regionKo = REGION_KO[region] || region;
    items.push({ name: '지역 안내', url: `${SITE}/#areas` });
    items.push({ name: regionKo, url: `${SITE}/#panel-${region}` });
    if (p.length === 4) {
      // city page
      leaf = (h1Of(s).replace(/\s*출장마사지$/, '') || p[2]).trim();
      items.push({ name: `${leaf} 출장마사지`, url: null });
    } else {
      // dong/district page: area/region/city/dong/index.html
      const city = cityMap[region]?.find((c) => c.slug === p[2]);
      const cityName = city ? city.name : p[2];
      const dong = decodeURIComponent(p[3]);
      leaf = (h1Of(s).replace(/\s*출장마사지$/, '') || dong).trim();
      items.push({ name: `${cityName} 출장마사지`, url: `${SITE}/area/${region}/${p[2]}/` });
      items.push({ name: leaf, url: null });
    }
  } else {
    const section = p[0];
    const secKo = SECTION_KO[section] || section;
    const leafName = h1Of(s) || titleOf(s) || secKo;
    if (p.length <= 2) {
      // top-level section page (e.g. about/index.html, service/index.html)
      items.push({ name: leafName, url: null });
    } else {
      items.push({ name: secKo, url: `${SITE}/${section}/` });
      items.push({ name: leafName, url: null });
    }
    leaf = leafName;
  }

  // 1) Insert JSON-LD (breadcrumb + faq) before </head>
  const blocks = crumbSchema(items) + faqSchema(s);
  if (blocks && s.includes('</head>')) {
    s = s.replace('</head>', blocks + '  </head>');
    stat.crumb++;
    if (blocks.includes('FAQPage')) stat.faq++;
  }

  // 2) Visible breadcrumb after <main>
  const mainOpen = s.match(/<main[^>]*>\s*\n/);
  if (mainOpen) {
    s = s.replace(mainOpen[0], mainOpen[0] + crumbNav(items));
  }

  // 3) Area pages: related-area + long-tail keyword sections inside the area section
  if (isArea && leaf) {
    const region = p[1];
    const selfSlug = p[2]; // link siblings at city level
    const section = areaRelatedSection(region, selfSlug, leaf);
    const mainIdx = s.lastIndexOf('</main>');
    if (mainIdx !== -1) {
      const secClose = s.lastIndexOf('</section>', mainIdx);
      if (secClose !== -1) {
        s = s.slice(0, secClose) + section + '      ' + s.slice(secClose);
        stat.related++;
      }
    }
  }

  if (s !== orig) writeFileSync(f, s);
}
console.log('files:', files.length, stat);
