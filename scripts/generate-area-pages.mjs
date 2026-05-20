import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://gandago-1.pages.dev";
const phone = "0508-202-4743";
const updated = "2026-05-20";

const supportPages = [
  {
    path: "about",
    title: "회사 소개",
    description: "간다GO와 운영사 YH LAB의 운영 배경, 책임 정보, 서비스 원칙을 안내합니다.",
    eyebrow: "About",
    heading: "간다GO 운영 배경",
    summary: "간다GO는 서울, 경기, 인천에 집중해 방문 마사지 예약 전 확인해야 할 지역, 절차, 안전 기준을 정리하는 안내 사이트입니다.",
    sections: [
      ["운영 주체", "회사 YH LAB, 대표 김유환이 운영하며 사업자등록번호와 주소를 사이트 하단에 공개합니다."],
      ["서비스 범위", "서울, 경기, 인천 지역을 중심으로 합법적인 웰니스 방문 관리 정보와 예약 상담 기준을 안내합니다."],
      ["콘텐츠 책임", "지역 페이지와 안내 콘텐츠는 과장된 치료 효과나 선정적 표현을 피하고, 실제 예약 전 확인에 필요한 정보 위주로 작성합니다."]
    ]
  },
  {
    path: "contact",
    title: "고객센터",
    description: "간다GO 공지사항, 자주 묻는 질문, 1:1 문의, 제휴 문의, 운영 정책 안내입니다.",
    eyebrow: "Contact",
    heading: "고객센터",
    summary: "예약과 사이트 운영 관련 문의는 아래 기준을 확인한 뒤 전화 상담으로 진행합니다.",
    sections: [
      ["공지사항", "현재 간다GO는 서울, 경기, 인천 지역 안내를 우선 운영합니다. 운영 지역과 정책 변경이 있을 때 이 페이지에 반영합니다.", "notice"],
      ["자주 묻는 질문", "요금, 가능 시간, 방문 가능 지역은 상담 시점의 이동 조건과 예약 현황에 따라 달라질 수 있습니다.", "faq"],
      ["1:1 문의", `예약 또는 이용 전 확인이 필요한 내용은 ${phone}으로 문의해 주세요. 상담 시 지역, 희망 시간, 관리 유형을 함께 알려주시면 더 정확합니다.`, "one-to-one"],
      ["제휴 문의", "콘텐츠, 지역 운영, 브랜드 제휴 문의는 사업자 정보와 제안 내용을 정리한 뒤 전화 상담을 통해 접수합니다.", "partnership"],
      ["운영 정책", "간다GO는 불법·성매매·선정적 서비스를 제공하거나 중개하지 않으며, 치료 효과를 보장하지 않습니다.", "operation-policy"]
    ]
  },
  {
    path: "policy/editorial",
    title: "편집 정책",
    description: "간다GO 콘텐츠 작성 기준, 검수 원칙, 스팸 방지 기준을 안내합니다.",
    eyebrow: "Editorial Policy",
    heading: "편집 정책",
    summary: "간다GO는 검색 순위 조작보다 이용자의 예약 전 판단에 도움이 되는 정보 제공을 우선합니다.",
    sections: [
      ["작성 기준", "지역명만 바꾼 반복 글을 만들지 않고, 이동 조건, 건물 출입, 상담 전 확인사항처럼 실제 판단에 필요한 정보를 우선합니다."],
      ["검수 기준", "허위 후기, 과장된 치료 효과, 선정적 표현, 자격을 오해하게 하는 표현을 사용하지 않습니다."],
      ["수정 기준", "지역 행정구역, 운영 기준, 연락처, 정책 정보가 바뀌면 확인 가능한 날짜와 함께 콘텐츠를 갱신합니다."]
    ]
  },
  {
    path: "policy/privacy",
    title: "개인정보처리방침",
    description: "간다GO 개인정보 수집 최소화, 이용 목적, 보관 기준을 안내합니다.",
    eyebrow: "Privacy",
    heading: "개인정보처리방침",
    summary: "간다GO는 문의와 예약 상담에 필요한 정보만 최소한으로 확인하는 것을 원칙으로 합니다.",
    sections: [
      ["수집 항목", "전화 상담 과정에서 지역, 희망 시간, 문의 내용처럼 예약 가능 여부 확인에 필요한 정보가 안내될 수 있습니다."],
      ["이용 목적", "수집된 정보는 예약 가능 여부 확인, 상담 응대, 운영 기준 안내 목적으로만 사용합니다."],
      ["보관과 보호", "불필요한 개인정보를 공개 페이지에 게시하지 않으며, 실제 운영 시 관련 법령에 맞춰 보관과 파기 기준을 관리합니다."]
    ]
  },
  {
    path: "policy/terms",
    title: "이용약관",
    description: "간다GO 사이트 이용 기준, 금지 행위, 책임 범위를 안내합니다.",
    eyebrow: "Terms",
    heading: "이용약관",
    summary: "본 사이트는 서울, 경기, 인천 방문 마사지 안내와 예약 전 정보 확인을 돕기 위한 목적으로 운영됩니다.",
    sections: [
      ["이용 목적", "사이트 콘텐츠는 예약 전 참고 정보이며, 최종 가능 여부와 금액은 상담 시점의 운영 조건을 기준으로 안내됩니다."],
      ["금지 행위", "불법·선정적 요청, 허위 정보 제공, 타인의 개인정보 도용, 서비스 운영을 방해하는 행위를 금지합니다."],
      ["책임 범위", "의료 행위, 질병 진단, 치료 효과를 보장하지 않으며 건강 관련 우려가 있는 경우 전문가 상담이 우선입니다."]
    ]
  },
  {
    path: "policy/refund",
    title: "취소 및 환불 안내",
    description: "간다GO 예약 변경, 취소, 환불 상담 기준을 안내합니다.",
    eyebrow: "Refund",
    heading: "취소 및 환불 안내",
    summary: "예약 변경과 취소는 방문 준비와 이동 시작 여부에 따라 조정 가능 범위가 달라질 수 있습니다.",
    sections: [
      ["예약 변경", "시간, 주소, 관리 유형 변경이 필요하면 가능한 빨리 전화로 알려주세요."],
      ["취소 기준", "방문 준비 또는 이동이 시작된 뒤에는 조정이 제한될 수 있어 상담 시점의 조건을 기준으로 안내합니다."],
      ["환불 안내", "실제 결제 방식과 진행 상태에 따라 환불 가능 여부가 달라질 수 있으므로 개별 상담을 통해 확인합니다."]
    ]
  }
];

const areas = [
  ["seoul", "서울", [
    ["강남구", "gangnam-gu", "테헤란로와 압구정·청담 생활권처럼 업무와 주거 이동이 겹치는 지역입니다.", "건물 출입 방식과 주차 가능 여부를 먼저 확인하는 편이 좋습니다."],
    ["강동구", "gangdong-gu", "천호·명일·고덕을 중심으로 동쪽 주거권 이동 동선이 긴 편입니다.", "예약 시간대와 단지 출입 동선을 사전에 맞추는 것이 중요합니다."],
    ["강북구", "gangbuk-gu", "수유·미아 생활권처럼 언덕길과 주거 골목이 함께 있는 지역입니다.", "정확한 동·건물명과 야간 출입 가능 여부를 확인합니다."],
    ["강서구", "gangseo-gu", "마곡 업무지구와 화곡 주거권, 공항 인접 동선이 함께 있는 지역입니다.", "이동 거리와 엘리베이터·주차 조건을 함께 확인하는 것이 좋습니다."],
    ["관악구", "gwanak-gu", "신림·봉천 중심의 원룸, 오피스텔, 주거 골목 수요가 많은 지역입니다.", "상세 주소와 공동현관 출입 방식을 미리 공유하면 상담이 빨라집니다."],
    ["광진구", "gwangjin-gu", "건대입구·구의·자양 생활권이 맞닿아 이동 수요가 분산됩니다.", "혼잡 시간대와 주차 가능 여부를 예약 전 확인합니다."],
    ["구로구", "guro-gu", "구로디지털단지와 신도림 환승권이 함께 있는 업무·주거 복합 지역입니다.", "퇴근 시간대 이동 여유와 방문 가능 시간을 함께 조율합니다."],
    ["금천구", "geumcheon-gu", "가산디지털단지와 독산·시흥 주거권이 이어지는 지역입니다.", "업무지구 건물 보안 절차와 주차 조건 확인이 필요합니다."],
    ["노원구", "nowon-gu", "상계·중계·하계 중심의 대단지 주거권이 넓게 펼쳐진 지역입니다.", "단지명, 동 번호, 차량 진입 가능 여부를 구체적으로 확인합니다."],
    ["도봉구", "dobong-gu", "창동·쌍문·방학 생활권처럼 북부 주거 동선이 긴 지역입니다.", "예약 시간과 이동 소요를 여유 있게 잡는 것이 좋습니다."],
    ["동대문구", "dongdaemun-gu", "청량리·장안·회기 생활권이 섞여 교통 흐름이 자주 바뀌는 지역입니다.", "도착 가능 시간과 건물 출입 정보를 함께 확인합니다."],
    ["동작구", "dongjak-gu", "사당·노량진·흑석 생활권처럼 환승과 주거 수요가 겹칩니다.", "주차가 어려운 건물은 대체 진입 방식을 미리 정하는 것이 좋습니다."],
    ["마포구", "mapo-gu", "공덕·합정·상암처럼 업무, 주거, 상권이 빠르게 바뀌는 지역입니다.", "건물 유형과 예약 시간대 혼잡도를 함께 확인합니다."],
    ["서대문구", "seodaemun-gu", "신촌·홍제·가재울 생활권처럼 대학가와 주거지가 공존합니다.", "공동현관, 주차, 늦은 시간 출입 가능 여부를 확인합니다."],
    ["서초구", "seocho-gu", "교대·반포·양재 업무권과 고급 주거권이 함께 있는 지역입니다.", "건물 보안 절차와 방문 가능한 시간대를 명확히 맞춥니다."],
    ["성동구", "seongdong-gu", "성수·왕십리·금호 생활권처럼 업무지와 주거지가 빠르게 연결됩니다.", "퇴근 시간대 도로 혼잡과 주차 조건을 함께 확인합니다."],
    ["성북구", "seongbuk-gu", "길음·돈암·정릉처럼 언덕형 주거권과 대학교 주변 수요가 있습니다.", "세부 주소와 도보 이동 동선을 사전에 확인합니다."],
    ["송파구", "songpa-gu", "잠실·문정·위례 인접 생활권처럼 대형 단지와 업무시설이 많습니다.", "단지 출입 절차와 예약 시간대 이동 가능성을 함께 봅니다."],
    ["양천구", "yangcheon-gu", "목동과 신정·신월 생활권이 달라 예약 동선 차이가 큰 지역입니다.", "주차 가능 여부와 엘리베이터 이용 조건을 확인합니다."],
    ["영등포구", "yeongdeungpo-gu", "여의도 업무권과 영등포·문래 생활권이 겹치는 지역입니다.", "업무시설 출입 절차와 퇴근 시간대 혼잡을 고려합니다."],
    ["용산구", "yongsan-gu", "한남·이태원·용산역 생활권처럼 고저차와 보안 건물이 많은 지역입니다.", "출입 방식과 정확한 도착 지점을 상담 초기에 확인합니다."],
    ["은평구", "eunpyeong-gu", "연신내·불광·진관 생활권처럼 서북권 이동 거리가 긴 편입니다.", "동별 이동 시간과 단지 출입 가능 여부를 함께 확인합니다."],
    ["종로구", "jongno-gu", "광화문 업무권과 북촌·평창 주거권처럼 성격이 다른 동선이 공존합니다.", "차량 접근 가능 지점과 건물 보안 절차를 확인합니다."],
    ["중구", "jung-gu-seoul", "명동·을지로·신당처럼 업무, 상권, 주거가 촘촘히 섞인 중심지입니다.", "주차 난이도와 건물 출입 시간을 먼저 확인합니다."],
    ["중랑구", "jungnang-gu", "면목·상봉·망우 생활권처럼 동북권 주거 이동이 넓은 지역입니다.", "예약 시간대와 상세 주소를 정확히 맞추는 것이 좋습니다."]
  ]],
  ["gyeonggi", "경기", [
    ["가평군", "gapyeong-gun", "관광지와 전원 주거지가 넓게 퍼져 이동 시간이 크게 달라지는 지역입니다.", "읍·면 단위 위치와 야간 이동 가능 여부를 먼저 확인합니다."],
    ["고양시", "goyang-si", "일산·덕양 생활권이 넓고 서울 서북권과 이동이 자주 연결됩니다.", "구 단위 위치와 주차 조건을 함께 확인합니다."],
    ["과천시", "gwacheon-si", "서울 남부와 인접한 소규모 도시권으로 이동 동선은 짧지만 시간대 영향이 큽니다.", "방문 가능 시간과 단지 출입 절차를 확인합니다."],
    ["광명시", "gwangmyeong-si", "서울 서남권과 생활권이 맞닿아 퇴근 시간대 이동 변동이 있습니다.", "건물 출입 방식과 차량 정차 가능 지점을 확인합니다."],
    ["광주시", "gwangju-si", "오포·초월·곤지암처럼 주거지와 외곽 동선이 넓게 퍼집니다.", "읍·면·동 위치와 이동 시간을 여유 있게 확인합니다."],
    ["구리시", "guri-si", "서울 동북권과 남양주 사이에 있어 짧은 거리 이동 수요가 많습니다.", "도착 시간과 아파트 단지 출입 정보를 확인합니다."],
    ["군포시", "gunpo-si", "산본 중심 생활권과 금정 환승권이 가까운 도시형 지역입니다.", "주차와 공동현관 출입 방식을 예약 전 확인합니다."],
    ["김포시", "gimpo-si", "한강신도시와 구도심, 공항 접근 동선이 함께 있는 지역입니다.", "읍·동 위치와 이동 소요를 구체적으로 확인합니다."],
    ["남양주시", "namyangju-si", "다산·별내·진접처럼 신도시와 외곽 주거권이 넓게 분포합니다.", "생활권별 이동 시간이 달라 세부 주소 확인이 중요합니다."],
    ["동두천시", "dongducheon-si", "경기 북부 생활권으로 서울권보다 이동 계획을 더 여유 있게 잡아야 합니다.", "예약 가능 시간과 도착 가능성을 먼저 상담합니다."],
    ["부천시", "bucheon-si", "중동·상동·역곡처럼 서울 서남권과 인천 사이 이동이 많은 지역입니다.", "도로 혼잡 시간과 주차 가능 여부를 확인합니다."],
    ["성남시", "seongnam-si", "분당·판교·수정·중원 생활권 성격이 크게 다른 지역입니다.", "구와 동을 기준으로 상담해야 이동 시간이 정확해집니다."],
    ["수원시", "suwon-si", "장안·권선·팔달·영통 생활권이 넓고 예약 동선 차이가 큽니다.", "구 단위 위치와 주차 조건을 함께 확인합니다."],
    ["시흥시", "siheung-si", "배곧·정왕·은행 생활권처럼 해안권과 내륙권 동선이 나뉩니다.", "동별 이동 거리와 방문 가능 시간을 확인합니다."],
    ["안산시", "ansan-si", "상록·단원 생활권과 공단·주거지가 함께 있는 지역입니다.", "건물 유형과 주차 가능 여부를 먼저 확인합니다."],
    ["안성시", "anseong-si", "도심과 외곽 읍·면 이동 차이가 큰 남부권 지역입니다.", "정확한 위치와 이동 가능 시간을 상담 초기에 확인합니다."],
    ["안양시", "anyang-si", "동안·만안 생활권과 평촌 중심지가 가까운 도시형 지역입니다.", "아파트 단지 출입과 주차 조건을 확인합니다."],
    ["양주시", "yangju-si", "옥정·고읍 등 신도시권과 외곽 동선이 공존합니다.", "생활권별 이동 시간이 달라 상세 주소 확인이 필요합니다."],
    ["양평군", "yangpyeong-gun", "전원주택, 펜션, 읍내 생활권처럼 이동 범위가 매우 넓습니다.", "읍·면 위치와 야간 도착 가능 여부를 먼저 확인합니다."],
    ["여주시", "yeoju-si", "경기 동남부권으로 시내와 외곽 이동 차이가 큽니다.", "예약 전 이동 가능 시간과 주소 정확도를 확인합니다."],
    ["연천군", "yeoncheon-gun", "경기 최북단 생활권으로 이동 가능 여부 확인이 특히 중요합니다.", "읍·면 위치와 상담 가능 시간을 먼저 확인합니다."],
    ["오산시", "osan-si", "세교와 오산역 생활권 중심의 compact한 도시형 지역입니다.", "단지 출입과 주차 가능 여부를 확인합니다."],
    ["용인시", "yongin-si", "수지·기흥·처인 생활권이 넓고 지역별 이동 시간이 크게 다릅니다.", "구 단위와 동 단위 위치를 함께 확인합니다."],
    ["의왕시", "uiwang-si", "평촌·수원·과천 사이 생활권으로 이동 연결성이 높은 지역입니다.", "건물 접근성과 예약 시간대를 함께 조율합니다."],
    ["의정부시", "uijeongbu-si", "경기 북부 중심 생활권으로 주거 단지와 역세권 수요가 많습니다.", "동별 위치와 공동현관 출입 정보를 확인합니다."],
    ["이천시", "icheon-si", "도심과 산업단지, 외곽 읍·면 이동이 나뉘는 지역입니다.", "방문 가능 시간과 차량 이동 조건을 먼저 확인합니다."],
    ["파주시", "paju-si", "운정신도시와 문산·금촌 생활권이 넓게 나뉩니다.", "생활권별 이동 거리와 예약 시간을 구체적으로 확인합니다."],
    ["평택시", "pyeongtaek-si", "고덕·송탄·팽성 등 생활권이 넓고 산업·주거 수요가 공존합니다.", "세부 권역과 이동 가능 시간을 먼저 상담합니다."],
    ["포천시", "pocheon-si", "북부 외곽 이동이 많아 거리와 시간 변동이 큰 지역입니다.", "읍·면 위치와 야간 이동 조건을 확인합니다."],
    ["하남시", "hanam-si", "미사·감일·위례 인접 생활권처럼 신도시 단지가 많은 지역입니다.", "단지 출입 절차와 주차 조건을 확인합니다."],
    ["화성시", "hwaseong-si", "동탄·봉담·향남·남양처럼 생활권이 매우 넓게 분산됩니다.", "권역을 먼저 나누고 이동 가능 시간을 확인하는 것이 좋습니다."]
  ]],
  ["incheon", "인천", [
    ["강화군", "ganghwa-gun", "도서·농촌 생활권이 섞여 이동 가능 시간 확인이 중요한 지역입니다.", "읍·면 위치와 교통 조건을 먼저 확인합니다."],
    ["검단구", "geomdan-gu", "2026년 7월 1일 출범 예정인 북부 생활권으로 신도시 수요가 빠르게 늘고 있습니다.", "검단·원당·마전 등 세부 생활권과 이동 시간을 확인합니다."],
    ["계양구", "gyeyang-gu", "계산·작전·효성 생활권과 서울 서부 접근 동선이 함께 있습니다.", "주차 가능 여부와 공동현관 출입 정보를 확인합니다."],
    ["남동구", "namdong-gu", "구월·논현·만수 생활권처럼 상권과 대단지 주거지가 함께 있습니다.", "동별 위치와 혼잡 시간대를 함께 확인합니다."],
    ["미추홀구", "michuhol-gu", "주안·용현·학익 생활권처럼 구도심 주거지와 역세권이 공존합니다.", "건물 출입 방식과 주차 조건 확인이 필요합니다."],
    ["부평구", "bupyeong-gu", "부평역·삼산·청천 생활권처럼 인천 동북부 이동 수요가 많습니다.", "상권 혼잡 시간과 도착 지점을 미리 확인합니다."],
    ["서해구", "seohae-gu", "2026년 7월 1일 개편 예정인 서구 남부 생활권으로 청라와 가정권을 포함합니다.", "청라·가정·석남·가좌 등 세부 동선을 확인합니다."],
    ["연수구", "yeonsu-gu", "송도·동춘·연수 생활권처럼 국제도시와 기존 주거지가 함께 있습니다.", "건물 보안 절차와 주차 가능 여부를 확인합니다."],
    ["영종구", "yeongjong-gu", "2026년 7월 1일 출범 예정인 공항권 생활권으로 섬 지역 이동 변수가 있습니다.", "영종·운서·용유 등 세부 위치와 이동 가능 시간을 확인합니다."],
    ["옹진군", "ongjin-gun", "도서 지역 특성상 일반 방문 서비스 가능 여부를 별도로 확인해야 합니다.", "선박·연륙 조건과 상담 가능 시간을 먼저 확인합니다."],
    ["제물포구", "jemulpo-gu", "2026년 7월 1일 출범 예정인 중구 내륙·동구 통합 생활권입니다.", "원도심 건물 접근성과 주차 조건을 함께 확인합니다."]
  ]]
];

const pageShell = ({ regionSlug, regionName, name, slug, context, check, prev, next }) => {
  const url = `${siteUrl}/areas/${regionSlug}/${slug}/`;
  const title = `${name} 출장마사지 예약 안내 | 간다GO ${regionName} 방문 케어`;
  const description = `간다GO ${name} 페이지는 ${context} ${check} 서울·경기·인천 방문 마사지 예약 전 확인할 정보를 정리합니다.`;
  const neighboring = [prev, next].filter(Boolean).join(" · ");

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <link rel="stylesheet" href="../../../styles.css" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="간다GO" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${siteUrl}/assets/gandago-hero.png" />
    <meta property="og:image:alt" content="간다GO ${name} 방문 마사지 안내 이미지" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${title}",
        "url": "${url}",
        "description": "${description}",
        "about": {
          "@type": "Service",
          "name": "${name} 출장마사지 예약 안내",
          "areaServed": { "@type": "AdministrativeArea", "name": "${name}" },
          "provider": { "@type": "HealthAndBeautyBusiness", "name": "간다GO", "telephone": "${phone}" }
        },
        "reviewedBy": {
          "@type": "Organization",
          "name": "간다GO 운영팀"
        },
        "dateModified": "${updated}"
      }
    </script>
  </head>
  <body class="area-page">
    <header class="site-header is-scrolled" aria-label="상단 메뉴">
      <a class="brand" href="../../../" aria-label="간다GO 홈">
        <span class="brand-mark">ㄱ</span>
        <span>
          <strong><span class="brand-core">간다</span><span class="brand-go">GO</span></strong>
          <small>Seoul · Gyeonggi · Incheon</small>
        </span>
      </a>
      <nav class="nav" aria-label="주요 메뉴">
        <div class="nav-item">
          <a href="../../../#areas">지역별 찾기</a>
          <div class="submenu" aria-label="지역별 찾기 하위 메뉴">
            <a href="../../../#panel-seoul">서울</a>
            <a href="../../../#panel-gyeonggi">경기</a>
            <a href="../../../#panel-incheon">인천</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="../../../#service">서비스 안내</a>
          <div class="submenu" aria-label="서비스 안내 하위 메뉴">
            <a href="../../../#service-onsite">출장마사지 안내</a>
            <a href="../../../#service-home-thai">홈타이 안내</a>
            <a href="../../../#service-swedish">스웨디시 안내</a>
            <a href="../../../#service-aroma">아로마 관리 안내</a>
            <a href="../../../#service-dry">건식 관리 안내</a>
            <a href="../../../#service-before">예약 전 확인사항</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="../../../#process">이용 방법</a>
          <div class="submenu" aria-label="이용 방법 하위 메뉴">
            <a href="../../../#process-booking">예약 절차</a>
            <a href="../../../#process-price">요금 안내</a>
            <a href="../../../#process-hours">이용 가능 시간</a>
            <a href="../../../#process-areas">방문 가능 지역</a>
            <a href="../../../#process-change">취소 및 변경 안내</a>
            <a href="../../../#process-safety">안전 이용 안내</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="../../../#reviews">이용 후기</a>
          <div class="submenu" aria-label="이용 후기 하위 메뉴">
            <a href="../../../#review-seoul">서울 이용 후기</a>
            <a href="../../../#review-gyeonggi">경기 이용 후기</a>
            <a href="../../../#review-incheon">인천 이용 후기</a>
            <a href="../../../#review-first">첫 이용 후기</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="../../../#magazine">매거진</a>
          <div class="submenu" aria-label="매거진 하위 메뉴">
            <a href="../../../#magazine-fatigue">피로 관리</a>
            <a href="../../../#magazine-local">지역 생활 정보</a>
            <a href="../../../#magazine-knowledge">마사지 상식</a>
            <a href="../../../#magazine-before">예약 전 알아둘 점</a>
            <a href="../../../#magazine-worker">직장인 피로 회복</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="../../../contact/">고객센터</a>
          <div class="submenu" aria-label="고객센터 하위 메뉴">
            <a href="../../../contact/#notice">공지사항</a>
            <a href="../../../contact/#faq">자주 묻는 질문</a>
            <a href="../../../contact/#one-to-one">1:1 문의</a>
            <a href="../../../contact/#partnership">제휴 문의</a>
            <a href="../../../policy/editorial/">운영 정책</a>
          </div>
        </div>
      </nav>
      <a class="nav-cta" href="tel:${phone}">예약 문의</a>
    </header>

    <main>
      <section class="area-hero">
        <p class="eyebrow">${regionName} 지역 안내</p>
        <h1>${name} 출장마사지 예약 안내</h1>
        <p>${description}</p>
        <div class="hero-actions">
          <a class="button primary" href="tel:${phone}">${phone}</a>
          <a class="button secondary on-light" href="../../../#areas">다른 지역 보기</a>
        </div>
      </section>

      <section class="area-content">
        <article>
          <p class="eyebrow">Local Note</p>
          <h2>${name}에서 먼저 확인할 점</h2>
          <p>${context}</p>
          <p>${check}</p>
        </article>
        <article>
          <p class="eyebrow">Before Booking</p>
          <h2>예약 전 체크리스트</h2>
          <ul class="check-list">
            <li>정확한 동·건물명·공동현관 출입 방식을 확인합니다.</li>
            <li>주차 가능 여부와 엘리베이터 이용 가능 시간을 확인합니다.</li>
            <li>마사지 강도, 희망 시간, 피해야 할 부위를 상담 단계에서 공유합니다.</li>
            <li>의료 행위나 치료 효과를 보장하는 표현은 사용하지 않습니다.</li>
          </ul>
        </article>
        <article>
          <p class="eyebrow">Who · How · Why</p>
          <h2>작성 기준</h2>
          <p>이 페이지는 간다GO 운영팀이 예약 상담에 필요한 지역별 확인 항목을 정리한 안내입니다. AI 초안을 활용할 수 있으나, 최종 게시 전 운영 기준과 법적 표현을 검토한다는 원칙으로 관리합니다.</p>
        </article>
        <article>
          <p class="eyebrow">Nearby</p>
          <h2>인접 지역 확인</h2>
          <p>${neighboring || "같은 권역의 다른 지역 페이지도 순차적으로 확인할 수 있습니다."}</p>
        </article>
      </section>
    </main>

    <footer class="site-footer" aria-label="사이트 하단 정보">
      <div class="footer-brand">
        <strong><span class="brand-core">간다</span><span class="brand-go">GO</span></strong>
        <p>${regionName} ${name} 방문 마사지 안내</p>
        <a class="footer-call" href="tel:${phone}">예약 문의 ${phone}</a>
      </div>

      <nav class="footer-nav" aria-label="하단 주요 메뉴">
        <div>
          <h2>서비스</h2>
          <a href="../../../#service">서비스 안내</a>
          <a href="../../../#process">이용 방법</a>
          <a href="../../../#areas">방문 가능 지역</a>
          <a href="../../../#reviews">이용 후기</a>
        </div>
        <div>
          <h2>콘텐츠</h2>
          <a href="../../../#magazine">매거진</a>
          <a href="../../../#trust">신뢰 기준</a>
          <a href="../../../about/">회사 소개</a>
          <a href="../../../contact/">고객센터</a>
        </div>
        <div>
          <h2>정책</h2>
          <a href="../../../policy/editorial/">편집 정책</a>
          <a href="../../../policy/privacy/">개인정보처리방침</a>
          <a href="../../../policy/terms/">이용약관</a>
          <a href="../../../policy/refund/">취소·환불 안내</a>
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
        <p>최종 수정일: ${updated}. 실제 가능 지역, 예약 시간, 금액은 상담 시점의 운영 조건을 기준으로 안내합니다.</p>
      </div>
    </footer>
  </body>
</html>
`;
};

const supportShell = ({ path: pagePath, title, description, eyebrow, heading, summary, sections }) => {
  const depth = pagePath.split("/").length;
  const base = "../".repeat(depth);
  const canonical = `${siteUrl}/${pagePath}/`;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} | 간다GO</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="stylesheet" href="${base}styles.css" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="간다GO" />
    <meta property="og:title" content="${title} | 간다GO" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
  </head>
  <body class="content-page">
    <a class="skip-link" href="#main">본문으로 이동</a>

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
          <a href="${base}#service">서비스 안내</a>
          <div class="submenu" aria-label="서비스 안내 하위 메뉴">
            <a href="${base}#service-onsite">출장마사지 안내</a>
            <a href="${base}#service-home-thai">홈타이 안내</a>
            <a href="${base}#service-swedish">스웨디시 안내</a>
            <a href="${base}#service-aroma">아로마 관리 안내</a>
            <a href="${base}#service-dry">건식 관리 안내</a>
            <a href="${base}#service-before">예약 전 확인사항</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}#process">이용 방법</a>
          <div class="submenu" aria-label="이용 방법 하위 메뉴">
            <a href="${base}#process-booking">예약 절차</a>
            <a href="${base}#process-price">요금 안내</a>
            <a href="${base}#process-hours">이용 가능 시간</a>
            <a href="${base}#process-areas">방문 가능 지역</a>
            <a href="${base}#process-change">취소 및 변경 안내</a>
            <a href="${base}#process-safety">안전 이용 안내</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}#reviews">이용 후기</a>
          <div class="submenu" aria-label="이용 후기 하위 메뉴">
            <a href="${base}#review-seoul">서울 이용 후기</a>
            <a href="${base}#review-gyeonggi">경기 이용 후기</a>
            <a href="${base}#review-incheon">인천 이용 후기</a>
            <a href="${base}#review-first">첫 이용 후기</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}#magazine">매거진</a>
          <div class="submenu" aria-label="매거진 하위 메뉴">
            <a href="${base}#magazine-fatigue">피로 관리</a>
            <a href="${base}#magazine-local">지역 생활 정보</a>
            <a href="${base}#magazine-knowledge">마사지 상식</a>
            <a href="${base}#magazine-before">예약 전 알아둘 점</a>
            <a href="${base}#magazine-worker">직장인 피로 회복</a>
          </div>
        </div>
        <div class="nav-item">
          <a href="${base}contact/">고객센터</a>
          <div class="submenu" aria-label="고객센터 하위 메뉴">
            <a href="${base}contact/#notice">공지사항</a>
            <a href="${base}contact/#faq">자주 묻는 질문</a>
            <a href="${base}contact/#one-to-one">1:1 문의</a>
            <a href="${base}contact/#partnership">제휴 문의</a>
            <a href="${base}policy/editorial/">운영 정책</a>
          </div>
        </div>
      </nav>
      <a class="nav-cta" href="${base}#booking">예약 문의</a>
    </header>

    <main id="main" class="content-main">
      <section class="content-hero">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${heading}</h1>
        <p>${summary}</p>
      </section>

      <section class="content-grid" aria-label="${title} 상세 정보">
        ${sections.map(([sectionTitle, body, id]) => `<article${id ? ` id="${id}"` : ""} class="content-card">
          <h2>${sectionTitle}</h2>
          <p>${body}</p>
        </article>`).join("\n        ")}
      </section>

      <section class="content-cta" aria-label="문의 안내">
        <div>
          <h2>예약 및 운영 문의</h2>
          <p>실제 가능 지역, 예약 시간, 금액은 상담 시점의 운영 조건을 기준으로 안내합니다.</p>
        </div>
        <a class="button primary" href="tel:${phone}">${phone}</a>
      </section>
    </main>

    <footer class="site-footer" aria-label="사이트 하단 정보">
      <div class="footer-brand">
        <strong><span class="brand-core">간다</span><span class="brand-go">GO</span></strong>
        <p>서울 · 경기 · 인천에 집중한 합법 웰니스 방문 마사지 안내 서비스입니다.</p>
        <a class="footer-call" href="tel:${phone}">예약 문의 ${phone}</a>
      </div>

      <nav class="footer-nav" aria-label="하단 주요 메뉴">
        <div>
          <h2>서비스</h2>
          <a href="${base}#service">서비스 안내</a>
          <a href="${base}#process">이용 방법</a>
          <a href="${base}#areas">방문 가능 지역</a>
          <a href="${base}#reviews">이용 후기</a>
        </div>
        <div>
          <h2>콘텐츠</h2>
          <a href="${base}#magazine">매거진</a>
          <a href="${base}#trust">신뢰 기준</a>
          <a href="${base}about/">회사 소개</a>
          <a href="${base}contact/">고객센터</a>
        </div>
        <div>
          <h2>정책</h2>
          <a href="${base}policy/editorial/">편집 정책</a>
          <a href="${base}policy/privacy/">개인정보처리방침</a>
          <a href="${base}policy/terms/">이용약관</a>
          <a href="${base}policy/refund/">취소·환불 안내</a>
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
        <p>최종 수정일: ${updated}. 실제 가능 지역, 예약 시간, 금액은 상담 시점의 운영 조건을 기준으로 안내합니다.</p>
      </div>
    </footer>
  </body>
</html>
`;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildLinks = (html) => {
  let next = html;
  for (const [regionSlug, , list] of areas) {
    for (const [name, slug] of list) {
      const url = `areas/${regionSlug}/${slug}/`;
      const pattern = new RegExp(`<li>${escapeRegExp(name)}( <small>[^<]+<\\/small>)?<\\/li>`);
      next = next.replace(pattern, (match, badge = "") => `<li><a href="${url}">${name}${badge}</a></li>`);
    }
  }
  return next;
};

const main = async () => {
  const root = process.cwd();
  const urls = [`${siteUrl}/`];

  for (const [regionSlug, regionName, list] of areas) {
    for (let index = 0; index < list.length; index += 1) {
      const [name, slug, context, check] = list[index];
      const previous = list[index - 1]?.[0];
      const next = list[index + 1]?.[0];
      const dir = path.join(root, "areas", regionSlug, slug);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, "index.html"), pageShell({
        regionSlug,
        regionName,
        name,
        slug,
        context,
        check,
        prev: previous,
        next
      }));
      urls.push(`${siteUrl}/areas/${regionSlug}/${slug}/`);
    }
  }

  for (const page of supportPages) {
    const dir = path.join(root, ...page.path.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), supportShell(page));
    urls.push(`${siteUrl}/${page.path}/`);
  }

  const indexPath = path.join(root, "index.html");
  const indexHtml = await readFile(indexPath, "utf8");
  await writeFile(indexPath, buildLinks(indexHtml));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${updated}</lastmod>
    <changefreq>${url === `${siteUrl}/` ? "weekly" : "monthly"}</changefreq>
    <priority>${url === `${siteUrl}/` ? "1.0" : "0.7"}</priority>
  </url>`).join("\n")}
</urlset>
`;
  await writeFile(path.join(root, "sitemap.xml"), sitemap);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
