import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://gandago-1.pages.dev";
const phone = "0508-202-4743";
const updated = "2026-05-20";

const reviewLinks = [
  ["서울 이용 후기", "reviews/seoul/"],
  ["경기 이용 후기", "reviews/gyeonggi/"],
  ["인천 이용 후기", "reviews/incheon/"],
  ["첫 이용 후기", "reviews/first-time/"]
];

const magazineLinks = [
  ["피로 관리", "magazine/#cat-fatigue"],
  ["지역 생활 정보", "magazine/#cat-local-life"],
  ["마사지 상식", "magazine/#cat-knowledge"],
  ["예약 전 알아둘 점", "magazine/#cat-before-booking"],
  ["직장인 피로 회복", "magazine/#cat-office-fatigue"]
];

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

const samples = {
  seoul: [
    ["이O근 님", "4.8", "평일 저녁", "강남구 역삼동", "아로마 관리", "퇴근 후 가능한 시간을 먼저 확인해 주어 일정 조율이 수월했습니다.", "건물 주차 가능 여부를 제가 늦게 말해 상담 시간이 조금 길어졌습니다.", "다음에는 주소와 출입 방식을 먼저 정리해 다시 문의할 생각입니다."],
    ["박O준 님", "4.7", "주말 오후", "마포구 공덕동", "건식 관리", "오일 없이 가능한 관리인지 먼저 설명해 주어 선택이 쉬웠습니다.", "주말이라 희망 시간보다 한 시간 늦은 시간으로 조정했습니다.", "일정에 여유가 있는 날 다시 이용할 의사가 있습니다."],
    ["최O아 님", "4.9", "평일 밤", "송파구 문정동", "스웨디시 안내", "공동현관 출입 방식과 엘리베이터 이용 가능 시간을 미리 확인해 안정적이었습니다.", "야간에는 가능한 시간이 빠르게 마감될 수 있다는 점을 더 일찍 알면 좋겠습니다.", "예약 전 체크할 항목이 명확해 재문의할 만하다고 느꼈습니다."],
    ["정O현 님", "4.6", "퇴근 직후", "영등포구 여의도동", "홈타이", "업무 일정 때문에 시간이 촉박했는데 가능한 범위와 추가 비용 여부를 차분히 안내받았습니다.", "건물 보안 절차가 있어 도착 후 확인 시간이 조금 더 걸렸습니다.", "다음에는 방문 전 안내를 더 꼼꼼히 확인하려고 합니다."],
    ["김O서 님", "4.8", "토요일 저녁", "서초구 반포동", "아로마 관리", "오일 사용 전 피부 민감도와 샤워 가능 여부를 먼저 물어봐 준 점이 좋았습니다.", "주말 저녁은 문의가 많아 바로 원하는 시간은 어려웠습니다.", "조건이 맞는 시간대에는 다시 상담해 볼 생각입니다."],
    ["윤O민 님", "4.7", "평일 늦은 밤", "용산구 한남동", "건식 관리", "건물명과 정확한 동선을 확인한 뒤 가능 여부를 안내해 혼선이 적었습니다.", "야간에는 주차 위치를 더 구체적으로 알려야 했습니다.", "안내 기준이 분명해 다음 문의 때 참고하기 좋았습니다."]
  ],
  gyeonggi: [
    ["김O미 님", "4.7", "주말 저녁", "성남시 분당구", "건식 관리", "지역과 시간대에 따라 가능 여부가 달라진다는 점을 먼저 알려줘 현실적이었습니다.", "희망 시간보다 조금 늦은 시간으로 조정해야 했습니다.", "주말에는 미리 문의하면 다시 이용할 생각입니다."],
    ["한O석 님", "4.8", "평일 오후", "수원시 영통구", "아로마 관리", "아파트 단지 출입 방식과 주차 가능 여부를 함께 확인해 방문 안내가 명확했습니다.", "오일 관리 전 준비사항을 제가 늦게 확인했습니다.", "다음에는 준비사항을 먼저 확인하고 예약하려고 합니다."],
    ["오O정 님", "4.6", "퇴근 후", "고양시 일산동구", "홈타이", "집에서 이용할 때 필요한 공간과 수건 준비 여부를 안내받아 부담이 줄었습니다.", "퇴근 시간대에는 도로 상황 때문에 예상 시간이 조금 바뀌었습니다.", "시간 여유가 있는 날 다시 상담할 예정입니다."],
    ["서O훈 님", "4.9", "평일 밤", "용인시 수지구", "스웨디시 안내", "부드러운 관리 중심이라는 설명과 피해야 할 표현 없이 차분한 안내가 좋았습니다.", "지역이 넓어 세부 주소 확인이 꼭 필요했습니다.", "주소를 정확히 정리한 뒤 재문의할 의사가 있습니다."],
    ["문O영 님", "4.7", "토요일 낮", "부천시 중동", "건식 관리", "오일을 원하지 않는다고 말했을 때 적합한 관리 유형을 쉽게 비교해 줬습니다.", "주말 상담이 몰려 답변 간격이 조금 있었습니다.", "예약 기준이 투명해 다음에도 확인해 볼 생각입니다."],
    ["이O재 님", "4.8", "평일 저녁", "하남시 미사", "아로마 관리", "신도시 아파트 단지 특성을 고려해 공동현관과 주차 위치를 먼저 확인했습니다.", "정확한 동 이름을 처음에 말하지 않아 상담이 한 번 더 이어졌습니다.", "처음보다 다음 이용이 더 수월할 것 같습니다."]
  ],
  incheon: [
    ["권O미 님", "4.8", "평일 밤", "연수구 송도동", "스웨디시 안내", "업무지구 근처라 야간 가능 시간을 먼저 확인해 준 점이 도움이 됐습니다.", "건물 보안 데스크 확인이 생각보다 중요했습니다.", "방문 조건이 맞는 날 다시 문의할 생각입니다."],
    ["장O훈 님", "4.7", "주말 오후", "부평구 부평동", "건식 관리", "대중교통 혼잡 시간과 주차 여건을 같이 확인해 현실적인 안내를 받았습니다.", "희망 시간대가 이미 가까워 선택지가 많지는 않았습니다.", "다음에는 하루 전 문의해 보려고 합니다."],
    ["신O아 님", "4.9", "평일 저녁", "남동구 구월동", "아로마 관리", "오일 사용 전 피부 민감도와 샤워 가능 여부를 먼저 확인해 안심됐습니다.", "방문 전 준비사항을 제가 다시 확인해야 했습니다.", "안내가 차분해 재문의 의사가 있습니다."],
    ["조O준 님", "4.6", "늦은 저녁", "미추홀구 주안동", "홈타이", "집에서 이용할 때 필요한 공간 정리와 출입 방식을 알려줘 준비가 쉬웠습니다.", "늦은 시간에는 가능 여부 확인에 시간이 조금 걸렸습니다.", "다음에는 가능 시간을 더 여유 있게 문의하겠습니다."],
    ["배O현 님", "4.8", "주말 저녁", "계양구 계산동", "건식 관리", "오일 없이 편하게 받을 수 있는지 확인하고 선택할 수 있었습니다.", "주차 위치 안내를 더 자세히 준비했으면 좋았을 것 같습니다.", "조건이 맞으면 다시 상담하려고 합니다."],
    ["이O나 님", "4.7", "평일 오후", "검단구 예정 권역", "아로마 관리", "행정구 개편 예정 지역까지 설명해 주소 확인이 더 명확했습니다.", "새 권역 명칭은 아직 익숙하지 않아 상담에서 한 번 더 확인했습니다.", "개편 후에도 지역 페이지를 참고해 문의할 생각입니다."]
  ],
  first: [
    ["이O근 님", "4.7", "첫 전화 상담", "서울 가능 지역 확인", "상담 후 선택", "처음이라 어떤 정보를 말해야 할지 몰랐는데 지역, 시간, 관리 유형 순서로 안내받았습니다.", "처음에는 건물명과 공동현관 정보를 준비하지 않아 상담이 길어졌습니다.", "다음에는 체크리스트를 보고 문의하면 더 빠를 것 같습니다."],
    ["김O연 님", "4.8", "평일 저녁 문의", "경기 가능 지역 확인", "아로마 관리", "요금이 조건에 따라 달라질 수 있다는 설명이 솔직하게 느껴졌습니다.", "최종 금액은 상담 후 확인해야 해서 바로 단정할 수는 없었습니다.", "조건을 확인한 뒤 다시 예약할 생각입니다."],
    ["박O수 님", "4.6", "주말 상담", "인천 가능 지역 확인", "건식 관리", "오일 관리와 건식 관리의 차이를 간단히 비교해 줘 선택이 쉬웠습니다.", "주말에는 가능한 시간이 빠르게 줄어드는 편이었습니다.", "다음에는 하루 전 문의하려고 합니다."],
    ["최O민 님", "4.9", "당일 문의", "서울 숙소", "홈타이", "숙소 이용 시 확인해야 할 출입 방식과 조용한 공간 여부를 먼저 안내받았습니다.", "당일 문의라 가능한 시간이 제한적이었습니다.", "사전 문의가 중요하다는 점을 알게 되어 다시 이용할 때 참고하겠습니다."],
    ["정O희 님", "4.7", "퇴근 후 문의", "경기 아파트 단지", "스웨디시 안내", "선정적인 표현 없이 관리 방식과 준비사항 위주로 설명해 신뢰가 갔습니다.", "제가 원하는 시간대와 가능한 시간이 완전히 맞지는 않았습니다.", "다음에는 시간대를 넓게 두고 상담해 보겠습니다."],
    ["윤O재 님", "4.8", "처음 예약 전 확인", "인천 주거 지역", "상담 후 결정", "방문 가능 지역, 요금, 취소 기준을 한 번에 확인할 수 있어 불안이 줄었습니다.", "처음이라 질문이 많아 상담 시간이 길어졌습니다.", "안내 기준을 확인한 뒤 재문의할 의사가 있습니다."]
  ]
};

const pages = [
  {
    path: "reviews",
    key: "hub",
    title: "이용 후기",
    description: "간다GO 이용 후기는 서울, 경기, 인천, 첫 이용 흐름을 나누어 예약 시간, 방문 지역, 관리 유형, 좋았던 점과 아쉬웠던 점을 함께 정리합니다.",
    eyebrow: "Review Desk",
    heading: "이용 후기",
    summary: "후기는 단순한 칭찬 문구보다 실제 이용자가 예약 전 확인할 수 있는 흐름을 보여주는 데 집중합니다. 이름은 익명 처리하고, 지역과 시간, 선택한 관리 유형, 좋았던 점과 아쉬웠던 점을 함께 공개하는 구조로 운영합니다.",
    sections: [
      ["후기를 나누어 보여주는 이유", "서울, 경기, 인천은 생활권과 이동 조건이 다릅니다. 같은 방문 관리라도 도심 업무지구, 아파트 단지, 숙소, 신도시, 야간 이동 여건에 따라 확인해야 할 내용이 달라집니다. 그래서 후기를 한 페이지에 모두 섞지 않고 지역별 후기와 첫 이용 후기로 나누어 확인할 수 있게 구성했습니다."],
      ["후기 작성 기준", "후기는 예약 시간, 방문 지역, 선택한 관리 유형, 상담에서 좋았던 점, 아쉬웠던 점, 재이용 판단을 중심으로 정리합니다. 최고, 무조건, 100% 같은 과장 문구를 반복하지 않고 이용자가 예약 전에 실제로 궁금해하는 정보가 남도록 관리합니다."],
      ["개인정보 보호 방식", "작성자 이름은 이O근 님처럼 일부만 표시하고, 세부 주소나 개인 생활 정보는 공개하지 않습니다. 공개 가능한 범위 안에서만 지역과 이용 흐름을 설명하며, 민감한 정보는 후기 문장에 포함하지 않습니다."],
      ["점수 표기 방식", "후기는 별 아이콘을 과하게 반복하기보다 5.0 만점 기준의 점수로 표시합니다. 점수만 보고 판단하지 않도록 예약 시간, 지역, 관리 유형, 좋았던 점과 아쉬웠던 점을 함께 배치합니다."],
      ["후기 검수 원칙", "실제 이용 흐름처럼 읽히는지, 불필요한 자극적 표현이 없는지, 특정 효과를 보장하는 표현이 없는지 확인한 뒤 게시하는 기준을 둡니다. 후기는 광고 문장보다 예약 전 판단을 돕는 생활 정보에 가깝게 다룹니다."],
      ["처음 이용하는 분을 위한 활용법", "처음 방문 관리를 알아보는 분은 첫 이용 후기에서 어떤 정보를 먼저 말해야 하는지 확인하고, 이후 본인의 지역에 맞는 서울, 경기, 인천 후기를 함께 보면 상담 전에 준비할 내용이 더 명확해집니다."]
    ],
    cards: reviewLinks.map(([label, href]) => [label, href, `${label} 페이지에서 지역별 예약 흐름과 실제 확인 포인트를 나누어 볼 수 있습니다.`]),
    reviews: [...samples.seoul.slice(0, 2), ...samples.gyeonggi.slice(0, 2), ...samples.incheon.slice(0, 1), ...samples.first.slice(0, 1)]
  },
  {
    path: "reviews/seoul",
    key: "seoul",
    title: "서울 이용 후기",
    description: "서울 이용 후기는 강남, 마포, 송파, 영등포, 서초, 용산 등 도심과 주거 지역에서 예약 전 확인한 흐름을 익명 사례로 정리합니다.",
    eyebrow: "Seoul Reviews",
    heading: "서울 이용 후기",
    summary: "서울은 업무지구와 주거지가 빠르게 이어지는 지역입니다. 후기는 퇴근 시간대, 건물 보안, 주차와 공동현관, 야간 가능 여부처럼 실제 상담에서 자주 확인되는 내용을 중심으로 정리했습니다.",
    sections: [
      ["서울 후기가 필요한 이유", "서울은 같은 구 안에서도 업무지구, 오피스텔, 아파트 단지, 숙소가 섞여 있어 방문 조건이 달라집니다. 후기에서는 지역명만 반복하지 않고 건물 출입 방식, 시간 조율, 관리 유형 선택 과정처럼 실제 예약 전 판단에 도움이 되는 내용을 보여줍니다."],
      ["도심 업무지구 이용 흐름", "강남, 여의도, 광화문처럼 퇴근 이후 문의가 많은 지역은 희망 시간과 실제 가능한 시간이 달라질 수 있습니다. 후기에서는 상담 단계에서 어떤 정보를 먼저 확인했는지, 도착 시간 여유를 어떻게 잡았는지 함께 다룹니다."],
      ["주거 지역에서 확인할 점", "아파트 단지나 공동주택은 공동현관, 경비실 확인, 주차 위치, 엘리베이터 이용 시간이 중요합니다. 서울 후기는 이런 요소가 예약 과정에서 어떻게 반영되는지 보여주는 예시를 포함합니다."],
      ["관리 유형 선택 기준", "아로마, 건식, 홈타이, 스웨디시 안내는 이름만 보고 선택하기보다 오일 사용 여부, 관리 강도, 이용 장소, 컨디션을 함께 확인해야 합니다. 후기에서는 선택 이유와 상담에서 확인한 내용을 같이 남깁니다."],
      ["아쉬운 점을 함께 적는 이유", "후기가 모두 좋은 말만 반복되면 실제 판단에 도움이 되지 않습니다. 가능한 시간이 맞지 않았던 점, 주차 정보가 늦게 전달된 점처럼 작은 아쉬움도 함께 공개해 예약 전 준비에 참고할 수 있게 합니다."],
      ["서울 후기 활용 방법", "서울 지역에서 처음 문의한다면 원하는 시간, 정확한 건물명, 공동현관 출입 방식, 주차 가능 여부를 먼저 정리한 뒤 후기를 보면 상담이 더 짧고 명확해집니다."]
    ],
    reviews: samples.seoul
  },
  {
    path: "reviews/gyeonggi",
    key: "gyeonggi",
    title: "경기 이용 후기",
    description: "경기 이용 후기는 성남, 수원, 고양, 용인, 부천, 하남 등 넓은 생활권에서 방문 가능 시간과 지역 조건을 확인한 흐름을 정리합니다.",
    eyebrow: "Gyeonggi Reviews",
    heading: "경기 이용 후기",
    summary: "경기도는 시·군별 이동 거리와 생활권 차이가 큽니다. 후기는 방문 가능 시간, 단지 출입, 주차, 이동 여건, 관리 유형 선택 과정을 중심으로 정리했습니다.",
    sections: [
      ["경기 후기가 서울과 다른 점", "경기도는 지역 간 거리가 넓고 같은 시 안에서도 신도시, 구도심, 산업단지, 전원 주거지가 섞여 있습니다. 후기에서는 단순 지역명보다 이동 조건과 가능 시간 확인이 왜 중요한지 보여줍니다."],
      ["신도시와 아파트 단지 이용 흐름", "분당, 광교, 미사, 동탄처럼 아파트 단지가 많은 지역은 공동현관, 주차 위치, 단지 출입 안내가 중요합니다. 후기에는 이런 준비가 상담 과정에서 어떻게 확인되는지 담았습니다."],
      ["주말과 평일의 차이", "주말에는 문의가 몰리고 평일 퇴근 시간에는 도로 상황에 영향을 받을 수 있습니다. 경기 후기는 희망 시간과 실제 가능 시간이 달라진 사례를 숨기지 않고 함께 정리합니다."],
      ["관리 유형 선택 기준", "오일 사용 여부, 건식 관리 선호, 홈타이처럼 집에서 편한 방식, 부드러운 관리 선호 여부를 상담 단계에서 확인하면 선택이 더 쉬워집니다. 후기에는 이런 선택 과정이 드러나도록 구성했습니다."],
      ["요금과 추가 비용 확인", "경기도는 이동 거리와 시간대에 따라 상담 기준이 달라질 수 있습니다. 후기에서는 최종 금액을 단정하기보다 예약 전 확인해야 하는 항목을 중심으로 설명합니다."],
      ["경기 후기 활용 방법", "정확한 시·구·동, 단지명, 주차 가능 여부, 희망 시간과 대체 가능 시간을 함께 정리해 두면 상담이 훨씬 현실적으로 진행됩니다."]
    ],
    reviews: samples.gyeonggi
  },
  {
    path: "reviews/incheon",
    key: "incheon",
    title: "인천 이용 후기",
    description: "인천 이용 후기는 연수구, 부평구, 남동구, 미추홀구, 계양구와 2026년 행정구 개편 예정 권역까지 고려한 예약 확인 흐름을 정리합니다.",
    eyebrow: "Incheon Reviews",
    heading: "인천 이용 후기",
    summary: "인천은 송도, 부평, 구월, 주안, 검단 등 생활권 성격이 뚜렷하고 행정구 개편 예정 권역도 함께 확인할 필요가 있습니다. 후기는 주소 확인, 가능 시간, 출입 조건을 중심으로 구성했습니다.",
    sections: [
      ["인천 후기가 필요한 이유", "인천은 업무지구, 주거 밀집지, 신도시, 항만·공항 생활권이 함께 있어 방문 조건이 다릅니다. 후기에서는 실제 상담에서 어떤 주소 정보와 출입 조건을 확인했는지 보여줍니다."],
      ["송도와 업무지구 이용 흐름", "송도처럼 업무지구와 주거지가 함께 있는 지역은 야간 가능 시간과 건물 보안 확인이 중요합니다. 후기에는 보안 데스크, 엘리베이터, 주차 안내처럼 실제 준비에 필요한 내용이 포함됩니다."],
      ["부평·구월·주안 생활권", "부평, 구월, 주안은 이동량이 많고 시간대별 도로 상황이 달라질 수 있습니다. 후기는 희망 시간 조율과 방문 가능 여부 확인 과정을 함께 보여줍니다."],
      ["2026년 개편 예정 권역 반영", "검단구, 영종구, 제물포구처럼 개편 예정 권역은 사용자에게 익숙한 기존 명칭과 새 권역명이 함께 쓰일 수 있습니다. 후기에서는 상담 단계에서 주소를 한 번 더 확인하는 방식을 권장합니다."],
      ["관리 유형과 준비사항", "아로마, 건식, 홈타이, 스웨디시 안내는 이용 장소와 컨디션에 따라 맞는 방식이 달라집니다. 후기에는 관리 유형을 고른 이유와 준비사항을 같이 표시합니다."],
      ["인천 후기 활용 방법", "동 이름, 건물명, 공동현관 방식, 주차 위치, 희망 시간과 대체 가능 시간을 먼저 준비하면 실제 상담에서 가능 여부를 더 빠르게 확인할 수 있습니다."]
    ],
    reviews: samples.incheon
  },
  {
    path: "reviews/first-time",
    key: "first",
    title: "첫 이용 후기",
    description: "첫 이용 후기는 방문 관리가 처음인 분들이 예약 전 어떤 정보를 확인하고 어떤 부분에서 불안이 줄었는지 익명 사례로 정리합니다.",
    eyebrow: "First Time Reviews",
    heading: "첫 이용 후기",
    summary: "처음 이용하는 분은 무엇을 먼저 말해야 하는지, 요금은 어떻게 확인되는지, 방문 전 무엇을 준비해야 하는지에서 막히기 쉽습니다. 첫 이용 후기는 그 불안을 줄이는 흐름에 집중합니다.",
    sections: [
      ["첫 이용 후기가 중요한 이유", "방문 관리를 처음 알아보는 분은 서비스 이름보다 예약 흐름과 확인해야 할 정보가 더 중요합니다. 첫 이용 후기는 상담에서 어떤 순서로 정보를 말하면 좋은지 보여줍니다."],
      ["처음 문의할 때 말하면 좋은 정보", "지역, 희망 시간, 이용 장소, 관리 유형, 주차와 출입 방식, 오일 사용 선호 여부를 먼저 정리하면 상담이 짧아집니다. 정확히 모르는 부분은 상담 중에 확인해도 됩니다."],
      ["요금 확인에서 불안이 줄어드는 지점", "요금은 관리 유형, 시간, 지역, 시간대에 따라 달라질 수 있습니다. 첫 이용 후기는 최저가를 강조하기보다 최종 금액을 언제 어떻게 확인해야 하는지 보여줍니다."],
      ["안전하게 이용하기 위한 기준", "무리한 요청이나 부적절한 요청을 받지 않는 운영 기준, 개인정보 보호, 방문 전 안내, 취소와 변경 기준을 확인하면 처음 이용할 때의 불확실성이 줄어듭니다."],
      ["아쉬운 점을 남기는 방식", "처음 이용자는 질문이 많아 상담 시간이 길어지거나 희망 시간대가 맞지 않을 수 있습니다. 이런 아쉬운 점도 함께 정리해 다음 이용자가 더 잘 준비할 수 있게 합니다."],
      ["첫 이용 후기 활용 방법", "후기를 읽은 뒤 예약 절차, 요금 안내, 이용 전 준비사항, 안전 이용 안내 페이지를 함께 보면 문의 전에 필요한 정보를 거의 정리할 수 있습니다."]
    ],
    reviews: samples.first
  }
];

const baseFor = (pagePath) => "../".repeat(pagePath.split("/").length);

const header = (base) => `
    <header class="site-header is-scrolled" aria-label="상단 메뉴">
      <a class="brand" href="${base}" aria-label="간다GO 홈">
        <img class="brand-logo" src="${base}areas/ganda_go_logo_site.png" alt="간다GO" width="220" height="55" />
        <small>Seoul · Gyeonggi · Incheon</small>
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
        <a class="footer-logo" href="${base}" aria-label="간다GO 홈">
          <img src="${base}areas/ganda_go_logo_site.png" alt="간다GO" width="280" height="70" />
        </a>
        <p>서울 · 경기 · 인천에 집중한 합법 웰니스 방문 관리 안내 서비스입니다.</p>
        <a class="footer-call" href="tel:${phone}">예약 문의 ${phone}</a>
      </div>
      <nav class="footer-nav" aria-label="하단 주요 메뉴">
        <div>
          <h2>후기</h2>
          <a href="${base}reviews/">이용 후기</a>
          <a href="${base}reviews/seoul/">서울 이용 후기</a>
          <a href="${base}reviews/gyeonggi/">경기 이용 후기</a>
          <a href="${base}reviews/first-time/">첫 이용 후기</a>
        </div>
        <div>
          <h2>안내</h2>
          <a href="${base}service/">서비스 안내</a>
          <a href="${base}guide/">이용 방법</a>
          <a href="${base}guide/price/">요금 안내</a>
          <a href="${base}guide/safety/">안전 이용 안내</a>
        </div>
        <div>
          <h2>정책</h2>
          <a href="${base}about/">회사 소개</a>
          <a href="${base}contact/">고객센터</a>
          <a href="${base}policy/editorial/">편집 정책</a>
          <a href="${base}policy/privacy/">개인정보처리방침</a>
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
        <p>최종 수정일 ${updated}. 후기는 개인정보를 익명 처리하고, 공개 가능한 이용 흐름 중심으로 정리합니다.</p>
      </div>
    </footer>`;

const reviewCard = ([name, score, time, area, type, good, regret, revisit]) => `
          <article class="review-card review-story">
            <div class="review-card-head">
              <span>${name}</span>
              <strong>${area} ${type} 이용 흐름</strong>
            </div>
            <div class="review-score" aria-label="5점 만점 ${score}점">
              <span>평점</span>
              <strong>${score}</strong>
              <em>/ 5.0</em>
            </div>
            <dl>
              <div><dt>예약 시간</dt><dd>${time}</dd></div>
              <div><dt>방문 지역</dt><dd>${area}</dd></div>
              <div><dt>선택한 관리 유형</dt><dd>${type}</dd></div>
            </dl>
            <p><strong>좋았던 점</strong> ${good}</p>
            <p><strong>아쉬웠던 점</strong> ${regret}</p>
            <p><strong>재이용 여부</strong> ${revisit}</p>
          </article>`;

const pageHtml = (page) => {
  const base = baseFor(page.path);
  const canonical = `${siteUrl}/${page.path}/`;
  const cards = page.cards ?? reviewLinks.map(([label, href]) => [label, href, `${label}에서 더 구체적인 예약 흐름을 확인할 수 있습니다.`]);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${page.title} | 간다GO</title>
    <meta name="description" content="${page.description}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="stylesheet" href="${base}styles.css" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="간다GO" />
    <meta property="og:title" content="${page.title} | 간다GO" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${canonical}" />
  </head>
  <body class="content-page review-page">
    <a class="skip-link" href="#main">본문으로 이동</a>
${header(base)}

    <main id="main" class="content-main">
      <section class="content-hero review-hero">
        <p class="eyebrow">${page.eyebrow}</p>
        <h1>${page.heading}</h1>
        <p>${page.summary}</p>
      </section>

      <nav class="service-page-nav review-category-nav" aria-label="이용 후기 카테고리">
        ${reviewLinks.map(([label, href]) => `<a href="${base}${href}"${page.path === href.replace(/\/$/, "") ? " aria-current=\"page\"" : ""}>${label}</a>`).join("\n        ")}
      </nav>

      <section class="content-grid" aria-label="${page.title} 운영 기준">
        ${page.sections.map(([title, body]) => `<article class="content-card">
          <h2>${title}</h2>
          <p>${body}</p>
        </article>`).join("\n        ")}
      </section>

      <section class="section review-samples" aria-labelledby="review-samples-title">
        <div class="section-heading">
          <p class="eyebrow">Verified Format</p>
          <h2 id="review-samples-title">${page.title} 사례</h2>
          <p>아래 후기는 개인정보를 익명 처리한 운영 예시 형식입니다. 실제 게시 시에는 작성 동의, 이용 흐름 확인, 과장 표현 검수를 거친 내용만 사용합니다.</p>
        </div>
        <div class="review-grid">
${page.reviews.map(reviewCard).join("\n")}
        </div>
      </section>

      <section class="service-related" aria-labelledby="review-related-title">
        <div>
          <p class="eyebrow">Next Step</p>
          <h2 id="review-related-title">함께 확인하면 좋은 안내</h2>
          <p>후기를 본 뒤 예약 절차와 요금, 방문 가능 지역을 함께 확인하면 실제 상담에서 필요한 정보를 더 빠르게 정리할 수 있습니다.</p>
        </div>
        <div class="service-related-grid">
          ${cards.map(([label, href, text]) => `<a href="${base}${href}">
            <strong>${label}</strong>
            <span>${text}</span>
          </a>`).join("\n          ")}
          <a href="${base}guide/reservation/">
            <strong>예약 절차 확인하기</strong>
            <span>상담 전 어떤 정보를 준비하면 좋은지 순서대로 확인합니다.</span>
          </a>
          <a href="${base}guide/price/">
            <strong>요금 안내 보기</strong>
            <span>관리 유형과 시간, 지역에 따른 요금 확인 기준을 살펴봅니다.</span>
          </a>
        </div>
      </section>

      <section class="content-cta" aria-label="예약 문의">
        <div>
          <h2>후기 확인 후 예약 조건을 상담해 보세요</h2>
          <p>지역, 시간, 관리 유형, 출입 방식이 정리되어 있으면 실제 가능 여부를 더 빠르게 확인할 수 있습니다.</p>
        </div>
        <a class="button primary phone-ring" href="tel:${phone}" aria-label="${phone} 전화 예약 문의">
          <span class="phone-icon" aria-hidden="true">☎</span>${phone}
        </a>
      </section>
    </main>

${footer(base)}
  </body>
</html>
`;
};

const main = async () => {
  const root = process.cwd();
  for (const page of pages) {
    const dir = path.join(root, ...page.path.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), pageHtml(page));
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
