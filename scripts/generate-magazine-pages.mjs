import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://gandago-1.pages.dev";
const phone = "0508-202-4743";
const updated = "2026-05-20";

const serviceLinks = [
  ["출장마사지 안내", "service/business-trip-massage/"],
  ["홈타이 안내", "service/hometai/"],
  ["스웨디시 안내", "service/swedish/"],
  ["아로마 관리 안내", "service/aroma/"],
  ["건식 관리 안내", "service/dry-massage/"],
  ["예약 전 확인사항", "service/before-reservation/"]
];

const guideLinks = [
  ["예약 절차", "guide/reservation/"],
  ["요금 안내", "guide/price/"],
  ["이용 가능 시간", "guide/service-time/"],
  ["방문 가능 지역", "guide/available-area/"],
  ["이용 전 준비사항", "guide/prepare/"],
  ["안전 이용 안내", "guide/safety/"]
];

const reviewLinks = [
  ["서울 이용 후기", "reviews/seoul/"],
  ["경기 이용 후기", "reviews/gyeonggi/"],
  ["인천 이용 후기", "reviews/incheon/"],
  ["첫 이용 후기", "reviews/first-time/"]
];

const magazineLinks = [
  ["피로 관리", "magazine/fatigue/"],
  ["지역 생활 정보", "magazine/"],
  ["마사지 상식", "magazine/"],
  ["예약 전 알아둘 점", "magazine/"],
  ["직장인 피로 회복", "magazine/"]
];

const articles = [
  {
    title: "장시간 운전 후 몸이 무거울 때 먼저 확인할 부분",
    href: "magazine/fatigue/",
    category: "피로 관리",
    date: "2026.05.20",
    readTime: "6분",
    summary: "장시간 운전 뒤 바로 강한 관리를 찾기보다 수분, 휴식, 자세, 피해야 할 부위를 먼저 확인하는 방법을 정리했습니다.",
    imageClass: "drive"
  },
  {
    title: "퇴근 후 몸이 무겁게 느껴질 때 예약 전 정리할 체크리스트",
    href: "magazine/",
    category: "피로 관리",
    date: "준비 중",
    readTime: "예정",
    summary: "퇴근 직후 방문 관리를 알아볼 때 시간, 장소, 관리 유형, 컨디션을 어떻게 정리하면 좋은지 다룰 예정입니다.",
    imageClass: "work"
  },
  {
    title: "오래 앉아 있는 날, 무리하지 않고 몸 상태를 살피는 방법",
    href: "magazine/",
    category: "피로 관리",
    date: "준비 중",
    readTime: "예정",
    summary: "오래 앉아 있던 날에 바로 강한 압을 고르기 전 확인할 생활 포인트를 정리할 예정입니다.",
    imageClass: "desk"
  }
];

const baseFor = (pagePath) => "../".repeat(pagePath.split("/").length);

const header = (base) => `
    <header class="site-header is-scrolled" aria-label="상단 메뉴">
      <a class="brand" href="${base}" aria-label="간다GO 홈">
        <span class="brand-mark">ㄱ</span>
        <span>
          <strong><span class="brand-core">간다</span><span class="brand-go">GO</span></strong>
          <small>Seoul · Gyeonggi · Incheon</small>
        </span>
      </a>
      <nav class="nav" aria-label="주요 메뉴">
        <div class="nav-item">
          <a href="${base}#areas">지역별 찾기</a>
          <div class="submenu" aria-label="지역별 찾기 하위 메뉴">
            <a href="${base}#panel-seoul">서울</a>
            <a href="${base}#panel-gyeonggi">경기</a>
            <a href="${base}#panel-incheon">인천</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}service/">서비스 안내</a>
          <div class="submenu" aria-label="서비스 안내 하위 메뉴">
            ${serviceLinks.map(([label, href]) => `<a href="${base}${href}">${label}</a>`).join("\n            ")}
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}guide/">이용 방법</a>
          <div class="submenu" aria-label="이용 방법 하위 메뉴">
            ${guideLinks.map(([label, href]) => `<a href="${base}${href}">${label}</a>`).join("\n            ")}
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}reviews/">이용 후기</a>
          <div class="submenu" aria-label="이용 후기 하위 메뉴">
            ${reviewLinks.map(([label, href]) => `<a href="${base}${href}">${label}</a>`).join("\n            ")}
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}magazine/">매거진</a>
          <div class="submenu" aria-label="매거진 하위 메뉴">
            ${magazineLinks.map(([label, href]) => `<a href="${base}${href}">${label}</a>`).join("\n            ")}
          </div>
        </div>
        <div class="nav-item"><a href="${base}contact/">고객센터</a></div>
      </nav>
      <a class="nav-cta" href="tel:${phone}">예약 문의</a>
    </header>`;

const footer = (base) => `
    <footer class="site-footer" aria-label="사이트 하단 정보">
      <div class="footer-brand">
        <strong><span class="brand-core">간다</span><span class="brand-go">GO</span></strong>
        <p>서울 · 경기 · 인천에 집중한 합법 웰니스 방문 관리 안내 서비스입니다.</p>
        <a class="footer-call" href="tel:${phone}">예약 문의 ${phone}</a>
      </div>
      <nav class="footer-nav" aria-label="하단 주요 메뉴">
        <div>
          <h2>매거진</h2>
          <a href="${base}magazine/">매거진 홈</a>
          <a href="${base}magazine/fatigue/">피로 관리</a>
          <a href="${base}guide/prepare/">이용 전 준비사항</a>
          <a href="${base}guide/safety/">안전 이용 안내</a>
        </div>
        <div>
          <h2>서비스</h2>
          <a href="${base}service/">서비스 안내</a>
          <a href="${base}guide/">이용 방법</a>
          <a href="${base}reviews/">이용 후기</a>
          <a href="${base}contact/">고객센터</a>
        </div>
        <div>
          <h2>정책</h2>
          <a href="${base}about/">회사 소개</a>
          <a href="${base}policy/editorial/">편집 정책</a>
          <a href="${base}policy/privacy/">개인정보처리방침</a>
          <a href="${base}policy/terms/">이용약관</a>
        </div>
      </nav>
      <address class="footer-business">
        <span>회사 YH LAB</span>
        <span>대표 김유환</span>
        <span>사업자등록번호 815-26-00585</span>
        <span>주소 경기도 파주시 청석로 268</span>
      </address>
      <div class="footer-disclosure">
        <p>간다GO는 불법·성매매·선정적 서비스를 제공하거나 중개하지 않으며, 질병 진단 또는 치료 효과를 보장하지 않습니다.</p>
        <p>최종 수정일 ${updated}. 매거진은 생활 정보와 예약 전 판단을 돕는 안내 콘텐츠로 운영합니다.</p>
      </div>
    </footer>`;

const albumCard = (article, base, featured = false) => `
          <a class="magazine-album-card${featured ? " is-featured" : ""}" href="${base}${article.href}">
            <span class="magazine-thumb ${article.imageClass}" aria-hidden="true"></span>
            <span class="magazine-meta">${article.category} · ${article.date} · ${article.readTime}</span>
            <strong>${article.title}</strong>
            <span>${article.summary}</span>
          </a>`;

const hubHtml = () => {
  const base = baseFor("magazine");
  const canonical = `${siteUrl}/magazine/`;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>매거진 | 간다GO</title>
    <meta name="description" content="간다GO 매거진은 피로 관리, 지역 생활 정보, 마사지 상식, 예약 전 알아둘 점, 직장인 피로 회복을 생활 정보 중심으로 정리합니다." />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="stylesheet" href="${base}styles.css" />
  </head>
  <body class="content-page magazine-page">
    <a class="skip-link" href="#main">본문으로 이동</a>
${header(base)}
    <main id="main" class="content-main">
      <section class="content-hero magazine-hero">
        <p class="eyebrow">Gandago Magazine</p>
        <h1>매거진</h1>
        <p>지역 키워드를 반복하는 글보다 실제 생활 흐름과 예약 전 판단에 도움이 되는 주제를 차분하게 다룹니다. 우선 피로 관리 주제부터 깊게 시작합니다.</p>
      </section>

      <nav class="service-page-nav magazine-category-nav" aria-label="매거진 주제">
        <a href="${base}magazine/fatigue/" aria-current="page">피로 관리</a>
        <a href="${base}magazine/">지역 생활 정보</a>
        <a href="${base}magazine/">마사지 상식</a>
        <a href="${base}magazine/">예약 전 알아둘 점</a>
        <a href="${base}magazine/">직장인 피로 회복</a>
      </nav>

      <section class="magazine-album" aria-labelledby="magazine-album-title">
        <div class="section-heading">
          <p class="eyebrow">Latest Album</p>
          <h2 id="magazine-album-title">피로 관리 글 모음</h2>
          <p>첫 주제는 피로 관리입니다. 강한 표현이나 치료 보장 대신, 이용 전 스스로 확인해야 할 컨디션과 생활 포인트를 중심으로 정리합니다.</p>
        </div>
        <div class="magazine-album-grid">
${articles.map((article, index) => albumCard(article, base, index === 0)).join("\n")}
        </div>
      </section>

      <section class="service-related" aria-labelledby="magazine-topics-title">
        <div>
          <p class="eyebrow">Topic Plan</p>
          <h2 id="magazine-topics-title">앞으로 확장할 매거진 주제</h2>
          <p>한 번에 얇은 글을 많이 만들기보다, 한 주제씩 충분한 깊이로 확장하는 방식이 더 안정적입니다.</p>
        </div>
        <div class="service-related-grid">
          <a href="${base}magazine/fatigue/"><strong>피로 관리</strong><span>현재 운영 중인 첫 주제입니다.</span></a>
          <a href="${base}magazine/"><strong>지역 생활 정보</strong><span>서울·경기·인천 생활권별 이동과 예약 전 참고 정보를 다룰 예정입니다.</span></a>
          <a href="${base}magazine/"><strong>마사지 상식</strong><span>관리 유형을 고를 때 필요한 기본 지식을 정리할 예정입니다.</span></a>
          <a href="${base}magazine/"><strong>예약 전 알아둘 점</strong><span>업체 정보, 요금, 가능 지역 확인 기준을 생활 정보로 다룰 예정입니다.</span></a>
        </div>
      </section>
    </main>
${footer(base)}
  </body>
</html>`;
};

const fatigueHtml = () => {
  const base = baseFor("magazine/fatigue");
  const canonical = `${siteUrl}/magazine/fatigue/`;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>장시간 운전 후 몸이 무거울 때 확인할 부분 | 간다GO 매거진</title>
    <meta name="description" content="장시간 운전 후 목, 어깨, 허리, 종아리가 무겁게 느껴질 때 확인할 생활 포인트와 방문 관리 예약 전 체크 기준을 간다GO가 정리했습니다." />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="stylesheet" href="${base}styles.css" />
  </head>
  <body class="content-page magazine-page">
    <a class="skip-link" href="#main">본문으로 이동</a>
${header(base)}
    <main id="main" class="content-main">
      <article class="magazine-article">
        <header class="magazine-article-hero">
          <p class="eyebrow">피로 관리 · 2026.05.20 · 약 8분</p>
          <h1>장시간 운전 후 몸이 무거울 때 먼저 확인할 부분</h1>
          <p>오래 운전한 날에는 목, 어깨, 허리, 종아리가 한꺼번에 무겁게 느껴질 수 있습니다. 이때 바로 강한 관리를 찾기보다 몸 상태, 이용 장소, 예약 조건을 차분히 확인하는 편이 더 안전하고 실용적입니다.</p>
          <div class="magazine-article-meta" aria-label="글 작성 정보">
            <div><span>작성</span><strong>간다GO 콘텐츠팀</strong></div>
            <div><span>운영 검수</span><strong>김유환 · YH LAB</strong></div>
            <div><span>최종 수정</span><strong>2026.05.20</strong></div>
            <div><span>글의 목적</span><strong>예약 전 생활 체크 기준</strong></div>
          </div>
        </header>

        <div class="magazine-article-layout">
          <aside class="magazine-toc" aria-label="글 목차">
            <strong>글 목차</strong>
            <a href="#summary">핵심 요약</a>
            <a href="#tired-reason">운전 후 피로가 쌓이는 이유</a>
            <a href="#checklist">예약 전 체크리스트</a>
            <a href="#care-type">관리 강도와 유형 선택</a>
            <a href="#booking-talk">상담 때 말하면 좋은 정보</a>
            <a href="#pause">이용을 미뤄야 할 경우</a>
            <a href="#faq">자주 묻는 질문</a>
            <a href="#standard">작성 기준</a>
          </aside>

          <div class="magazine-article-body">
            <section id="summary" class="article-lead-card">
              <p class="eyebrow">핵심 요약</p>
              <h2>바로 예약하기 전, 몸과 장소를 먼저 정리하세요</h2>
              <p>장시간 운전 뒤에는 피곤함이 한 부위에만 머물지 않고 목, 어깨, 허리, 종아리처럼 여러 곳에 동시에 나타나는 경우가 많습니다. 그래서 “어디가 불편한지”만 말하기보다 언제부터 무거웠는지, 최근 다친 부위는 없는지, 숙소나 집의 출입 조건은 어떤지까지 함께 정리하는 편이 좋습니다.</p>
              <p>방문 관리는 휴식과 피로 완화를 목적으로 상담받는 서비스입니다. 심한 통증, 갑작스러운 부상, 저림, 붓기, 발열처럼 몸 상태가 평소와 다르다면 예약보다 의료 전문가 상담이 먼저입니다. 간다GO 매거진은 치료 판단이 아니라 실제 예약 전에 도움이 되는 생활 기준을 안내합니다.</p>
            </section>

            <section id="tired-reason">
              <h2>운전 후 피로는 왜 한꺼번에 느껴질까요</h2>
              <p>장시간 운전은 같은 자세를 오래 유지하는 시간이 길고, 시야와 집중을 계속 사용하기 때문에 단순히 한 부위만 피곤해지는 일이 적습니다. 목과 어깨는 핸들을 잡은 상태에서 긴장하기 쉽고, 허리는 좌석 각도와 골반 위치의 영향을 받습니다. 종아리는 움직임이 줄어들면서 무겁게 느껴질 수 있고, 손목이나 팔도 미세한 긴장을 오래 유지합니다.</p>
              <div class="article-note-grid">
                <div><strong>자세 고정</strong><span>한 자세가 오래 이어지면 목과 허리 주변이 굳은 느낌으로 이어질 수 있습니다.</span></div>
                <div><strong>집중 피로</strong><span>운전 중에는 눈과 신경이 계속 긴장해 몸의 피곤함을 늦게 알아차리기도 합니다.</span></div>
                <div><strong>이동 후 회복 시간</strong><span>도착 직후보다 샤워와 휴식 후 몸 상태를 다시 확인하면 선택이 차분해집니다.</span></div>
              </div>
              <p>운전 직후 몸이 무겁다고 해서 무조건 강한 압이 필요한 것은 아닙니다. 오히려 피로가 깊은 날에는 부드러운 흐름, 짧은 휴식, 강도 조절이 더 편하게 느껴질 수 있습니다. 중요한 것은 “오늘 내 몸에 맞는 범위”를 정하는 것입니다.</p>
            </section>

            <section id="checklist">
              <h2>예약 전 체크리스트</h2>
              <p>상담 전에 아래 정보를 정리해 두면 예약 시간이 줄고, 방문 가능 여부도 더 명확하게 확인할 수 있습니다. 특히 서울, 경기, 인천처럼 이동 시간이 지역별로 달라지는 권역에서는 주소와 건물 출입 조건이 실제 가능 여부에 영향을 줍니다.</p>
              <ul class="article-checklist">
                <li><strong>몸 상태</strong><span>목, 어깨, 허리, 종아리 중 어디가 무거운지와 피해야 할 부위를 정리합니다.</span></li>
                <li><strong>최근 컨디션</strong><span>부상, 붓기, 저림, 발열, 심한 통증이 있으면 예약보다 전문 상담을 먼저 고려합니다.</span></li>
                <li><strong>이용 장소</strong><span>집, 숙소, 오피스텔 등 장소 유형과 정확한 주소, 동·건물명을 확인합니다.</span></li>
                <li><strong>출입 조건</strong><span>공동현관 호출, 주차 가능 여부, 엘리베이터 이용 시간, 경비실 확인 여부를 준비합니다.</span></li>
                <li><strong>희망 시간</strong><span>도착 직후 바로 이용할지, 샤워와 휴식 후 이용할지 여유 시간을 정합니다.</span></li>
                <li><strong>요금 확인</strong><span>관리 유형, 시간, 이동 조건에 따라 최종 금액이 달라질 수 있어 예약 확정 전 다시 확인합니다.</span></li>
              </ul>
            </section>

            <section id="care-type">
              <h2>강한 관리가 항상 좋은 선택은 아닙니다</h2>
              <p>몸이 무겁게 느껴질수록 강한 관리를 원하기 쉽지만, 피로가 쌓인 날에는 무리한 강도보다 컨디션에 맞춘 조절이 더 중요합니다. 특히 장거리 운전 후에는 목과 허리 주변이 예민하게 느껴질 수 있어, 상담 단계에서 피해야 할 부위와 원하는 압의 정도를 구체적으로 말하는 편이 좋습니다.</p>
              <p>아로마, 건식, 홈타이, 스웨디시 같은 관리 유형은 이름보다 방식의 차이를 이해하는 것이 먼저입니다. 오일 사용이 부담스러운지, 옷을 입은 상태가 편한지, 부드러운 흐름이 맞는지, 짧은 시간보다 충분한 휴식이 필요한지에 따라 선택 기준이 달라집니다. 처음 이용한다면 “강하게”보다 “불편하지 않은 범위에서 조절”처럼 말하는 것이 더 안전합니다.</p>
              <div class="article-callout">
                <strong>처음 이용한다면</strong>
                <p>처음부터 높은 강도를 요청하기보다 몸 상태를 설명하고, 관리 중 불편하면 바로 조절할 수 있는지 확인해 보세요. 편안한 관리 경험은 강도보다 소통에서 시작되는 경우가 많습니다.</p>
              </div>
            </section>

            <section id="booking-talk">
              <h2>예약 상담에서 이렇게 말하면 좋습니다</h2>
              <p>상담은 지역명만 말하는 단계가 아닙니다. 실제 방문 가능 여부를 확인하려면 이용 장소와 준비 조건이 함께 필요합니다. 예를 들어 “오늘 장시간 운전 후 목과 어깨가 무겁고, 강한 압보다는 편안한 관리가 좋습니다. 숙소는 ○○동이고 주차는 가능하지만 공동현관 호출이 필요합니다”처럼 말하면 상담자가 이동 조건과 가능 시간을 더 정확하게 확인할 수 있습니다.</p>
              <p>또한 최종 요금은 지역, 시간대, 관리 유형, 이동 조건에 따라 달라질 수 있으므로 예약 확정 전에 다시 확인해야 합니다. 불분명한 금액 안내나 과장된 표현보다, 가능한 범위와 확인해야 할 조건을 차분히 안내받는 쪽이 안전합니다. 요금이 중요한 이유는 단순히 비용 때문만이 아니라, 예약 전후의 오해를 줄이는 운영 기준이기 때문입니다.</p>
              <div class="article-fact-box">
                <span>상담 전 준비 문장</span>
                <p>“지역은 ○○동이고, 오늘 운전 시간이 길어 목과 허리가 무겁습니다. 주차 가능 여부와 최종 요금, 방문 가능 시간을 먼저 확인하고 싶습니다.”</p>
              </div>
            </section>

            <section id="pause">
              <h2>방문 관리가 맞지 않을 수 있는 경우</h2>
              <p>심한 통증, 갑작스러운 부상, 발열, 염증 의심, 저림이나 감각 이상이 있다면 방문 마사지보다 의료 전문가 상담이 우선입니다. 또한 음주 직후나 몸 상태가 평소와 크게 다른 날에는 무리해서 예약하지 않는 편이 좋습니다. 피로와 통증은 비슷하게 느껴질 수 있지만, 이용자가 스스로 구분하기 어려운 경우에는 안전한 판단을 먼저 해야 합니다.</p>
              <p>간다GO는 불법·선정적 요청을 받지 않으며, 치료 효과를 보장하는 표현을 사용하지 않습니다. 매거진 역시 실제 이용 전 판단에 필요한 생활 정보와 안전한 예약 기준을 중심으로 운영합니다. 예약을 빨리 진행하는 것보다 이용 전 확인해야 할 기준을 놓치지 않는 것이 더 중요합니다.</p>
            </section>

            <section id="faq" class="article-faq">
              <h2>장시간 운전 후 방문 관리 FAQ</h2>
              <details>
                <summary>운전 직후 바로 예약해도 괜찮을까요?</summary>
                <p>몸 상태가 평소와 크게 다르지 않다면 상담은 가능하지만, 도착 직후에는 물을 마시고 짧게 쉬면서 컨디션을 다시 확인하는 편이 좋습니다. 통증이 심하거나 저림, 붓기, 발열이 있다면 예약보다 전문 상담을 먼저 고려해야 합니다.</p>
              </details>
              <details>
                <summary>강한 압을 요청하면 더 시원한가요?</summary>
                <p>개인차가 큽니다. 장거리 운전 후에는 몸이 예민해진 상태일 수 있어 무리한 강도보다 불편하지 않은 범위에서 조절하는 방식이 더 편하게 느껴질 수 있습니다. 상담 단계에서 피해야 할 부위와 선호 강도를 함께 말하는 것이 좋습니다.</p>
              </details>
              <details>
                <summary>상담 때 주소 외에 무엇을 말해야 하나요?</summary>
                <p>동·건물명, 주차 가능 여부, 공동현관 출입 방식, 엘리베이터 이용 가능 시간, 희망 시간, 원하는 관리 유형을 함께 알려주면 실제 방문 가능 여부와 최종 요금을 더 정확하게 확인할 수 있습니다.</p>
              </details>
            </section>

            <section id="standard" class="article-source-links">
              <h2>이 글을 정리한 기준</h2>
              <p>이 글은 장거리 이동 후 방문 관리를 고민하는 이용자가 예약 전 스스로 확인할 수 있는 정보를 중심으로 작성했습니다. 작성자는 사이트 운영 기준, 고객 상담에서 반복적으로 확인되는 질문, 요금과 안전 안내 페이지의 기준을 함께 검토했습니다.</p>
              <div>
                <a href="${base}guide/prepare/">장시간 운전 후 방문 관리 전 준비사항</a>
                <a href="${base}guide/price/">서울·경기·인천 출장마사지 요금 확인 방법</a>
                <a href="${base}guide/safety/">처음 이용 전 안전하게 확인할 운영 기준</a>
                <a href="${base}#panel-seoul">서울 출장마사지 가능 지역 한눈에 보기</a>
                <a href="${base}#panel-gyeonggi">경기 출장마사지 가능 시·군 확인하기</a>
                <a href="${base}#panel-incheon">인천 출장마사지 가능 구역 확인하기</a>
                <a href="${base}contact/">예약 전 주소와 시간 상담 문의</a>
              </div>
            </section>
          </div>
        </div>
      </article>

      <section class="service-related" aria-labelledby="fatigue-related-title">
        <div>
          <p class="eyebrow">Related Guide</p>
          <h2 id="fatigue-related-title">함께 확인하면 좋은 안내</h2>
          <p>몸 상태를 확인한 뒤 실제 예약을 고민한다면 요금, 준비사항, 안전 기준을 함께 보는 편이 좋습니다.</p>
        </div>
        <div class="service-related-grid">
          <a href="${base}guide/prepare/"><strong>장거리 이동 후 방문 관리 준비 체크</strong><span>공간, 수건, 주차와 출입 방식을 예약 전 함께 확인합니다.</span></a>
          <a href="${base}guide/price/"><strong>관리 유형별 최종 요금 확인 기준</strong><span>지역과 시간, 관리 유형에 따라 달라질 수 있는 금액 기준을 봅니다.</span></a>
          <a href="${base}guide/safety/"><strong>처음 이용자를 위한 안전 예약 기준</strong><span>무리한 요청 제한과 개인정보 보호 기준을 함께 확인합니다.</span></a>
          <a href="${base}#areas"><strong>서울·경기·인천 방문 가능 지역 찾기</strong><span>현재 이용할 수 있는 수도권 권역을 지역별로 확인합니다.</span></a>
        </div>
      </section>
    </main>
${footer(base)}
  </body>
</html>`;
};

const main = async () => {
  const root = process.cwd();
  const pages = [
    ["magazine", hubHtml()],
    ["magazine/fatigue", fatigueHtml()]
  ];

  for (const [pagePath, html] of pages) {
    const dir = path.join(root, ...pagePath.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), html);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
