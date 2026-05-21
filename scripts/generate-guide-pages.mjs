import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://gandago.xyz";
const phone = "0508-202-4743";
const updated = "2026-05-21";

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
  ["피로 관리", "magazine/#cat-fatigue"],
  ["지역 생활 정보", "magazine/#cat-local-life"],
  ["마사지 상식", "magazine/#cat-knowledge"],
  ["예약 전 알아둘 점", "magazine/#cat-before-booking"],
  ["직장인 피로 회복", "magazine/#cat-office-fatigue"]
];

const extraGuideLinks = [
  ["처음 이용 안내", "guide/first-time/"],
  ["예약 취소 및 변경 안내", "guide/cancel-change/"],
  ["결제 안내", "guide/payment/"],
  ["이용 방법 FAQ", "guide/faq/"]
];

const relatedText = {
  guide: "처음 이용한다면 예약 절차, 요금, 방문 가능 지역을 함께 보면 상담 흐름이 더 분명해집니다.",
  reservation: "예약 전 요금과 방문 가능 지역을 함께 확인하면 상담 시간을 줄일 수 있습니다.",
  price: "최종 요금은 지역, 시간, 관리 유형에 따라 달라질 수 있으니 예약 절차도 함께 확인해 주세요.",
  "service-time": "희망 시간이 있다면 방문 가능 지역과 준비사항을 함께 확인하면 일정 조율이 더 쉽습니다.",
  "available-area": "지역을 확인한 뒤에는 예약 절차와 이용 가능 시간을 함께 살펴보는 것이 좋습니다.",
  prepare: "이용 전 준비사항을 확인했다면 안전 이용 기준과 예약 절차도 함께 살펴보세요.",
  safety: "안전 기준을 먼저 확인한 뒤 요금, 시간, 취소 기준까지 함께 보면 더 안심하고 문의할 수 있습니다.",
  "first-time": "처음 이용한다면 예약 절차와 이용 전 준비사항을 차례로 확인하는 편이 좋습니다.",
  "cancel-change": "일정 변경 가능성까지 고려한다면 예약 절차와 결제 안내를 함께 확인해 주세요.",
  payment: "결제 전에는 최종 요금, 예약 확정 기준, 취소 및 변경 기준을 함께 살펴보세요.",
  faq: "자주 묻는 질문을 확인한 뒤에도 지역과 시간은 상담 시점에 다시 확인하는 것이 좋습니다."
};

const guidePages = [
  {
    path: "guide",
    key: "guide",
    title: "이용 방법",
    description: "간다GO 출장마사지 이용 방법 허브입니다. 예약 절차, 요금, 시간, 방문 가능 지역, 준비사항, 안전 안내를 한눈에 정리합니다.",
    eyebrow: "Use Guide",
    heading: "이용 방법",
    summary: "처음 문의하는 분이 예약 전 필요한 정보를 순서대로 확인할 수 있도록 이용 흐름을 정리했습니다.",
    nav: ["한눈에 보기", "예약 순서", "요금 확인", "가능 지역", "준비사항", "FAQ"],
    sections: [
      ["출장마사지 이용 방법 한눈에 보기", "간다GO 이용 방법은 예약 문의, 지역과 시간 확인, 관리 유형 선택, 요금 안내, 방문 가능 여부 확인, 예약 확정 순서로 이해하면 쉽습니다. 핵심은 무리하게 빠른 확답을 받기보다 실제 이동 조건과 이용 장소를 기준으로 확인하는 것입니다."],
      ["예약은 어떤 순서로 진행되나요", "먼저 전화로 지역, 희망 시간, 이용 장소, 관리 유형을 알려주세요. 상담에서는 방문 가능 여부와 요금 범위를 확인하고, 건물 출입 방식이나 주차 가능 여부처럼 실제 방문에 영향을 주는 정보를 함께 점검합니다."],
      ["요금은 어떻게 확인하나요", "요금은 관리 유형, 이용 시간, 지역, 예약 시간대, 이동 조건에 따라 달라질 수 있습니다. 최저가를 강조하기보다 상담 시점의 조건을 기준으로 최종 안내를 확인하는 것이 좋습니다."],
      ["서울·경기·인천 방문 가능 지역", "간다GO는 서울, 경기, 인천을 중심으로 방문 가능 지역을 안내합니다. 세부 행정구역은 지역별 찾기에서 확인하고, 이 페이지에서는 전체 이용 흐름을 먼저 파악하는 데 집중합니다."],
      ["이용 전 준비하면 좋은 사항", "상세 주소, 공동현관 출입 방식, 주차 가능 여부, 조용한 관리 공간, 오일 사용 선호, 피부 민감도, 피해야 할 부위를 미리 정리하면 상담과 방문 안내가 더 정확해집니다."],
      ["처음 이용하는 분들이 자주 묻는 질문", "당일 예약은 가능한가요? 예약 현황과 이동 동선에 따라 달라집니다. 요금은 확정인가요? 최종 금액은 상담에서 지역과 시간 조건을 확인한 뒤 안내됩니다. 무리한 요청이나 부적절한 요청은 받지 않습니다."]
    ],
    cards: [...guideLinks, ...extraGuideLinks].map(([label, href]) => [label, href, `${label} 페이지에서 세부 기준을 확인할 수 있습니다.`])
  },
  {
    path: "guide/reservation",
    key: "reservation",
    title: "예약 절차",
    description: "출장마사지 예약 문의 접수부터 지역·시간 확인, 요금 안내, 예약 확정, 방문 전 안내까지 순서대로 정리합니다.",
    eyebrow: "Reservation",
    heading: "예약 절차",
    summary: "어떻게 예약해야 하는지 막막하지 않도록 문의부터 확정까지 필요한 단계를 차분하게 안내합니다.",
    nav: ["예약 순서", "지역과 시간", "관리 유형", "요금과 확정", "방문 전 안내", "FAQ"],
    sections: [
      ["출장마사지 예약은 어떤 순서로 진행되나요", "예약은 문의 접수, 지역과 시간 확인, 관리 유형 선택, 요금 안내, 방문 가능 여부 확인, 예약 확정, 방문 전 안내, 이용 후 확인사항 순서로 진행됩니다. 처음 문의라면 이 흐름만 알아도 상담이 훨씬 편해집니다."],
      ["지역과 시간을 먼저 확인하는 이유", "방문 서비스는 같은 지역이라도 도로 상황, 예약 현황, 건물 출입 조건에 따라 가능 시간이 달라질 수 있습니다. 그래서 희망 시간만 말하기보다 동명, 건물 유형, 주차 가능 여부를 함께 알려주는 것이 좋습니다."],
      ["관리 유형을 선택할 때 확인할 점", "아로마, 건식, 스웨디시, 홈타이 등 관리 유형은 이름보다 컨디션과 선호도에 맞춰 선택해야 합니다. 오일 사용 여부, 강도 선호, 피해야 할 부위를 미리 공유하면 무리 없는 안내가 가능합니다."],
      ["요금 안내와 예약 확정 과정", "요금은 관리 시간, 관리 유형, 지역, 시간대, 이동 조건을 기준으로 안내됩니다. 최종 금액과 가능 시간을 확인한 뒤 예약을 확정하며, 확정 전에는 취소·변경 기준도 함께 확인하는 것이 좋습니다."],
      ["방문 전 안내받아야 할 내용", "방문 전에는 도착 예상 시간, 준비사항, 출입 방식, 주차나 정차 가능 지점, 이용 공간 준비 여부를 확인합니다. 안내를 미리 받으면 현장에서 불필요한 지연을 줄일 수 있습니다."],
      ["예약 절차 관련 자주 묻는 질문", "당일 예약도 가능한가요? 가능 여부는 상담 시점에 확인합니다. 예약 전 결제가 꼭 필요한가요? 결제 방식과 기준은 상담에서 안내받고 확인하는 것이 안전합니다."]
    ]
  },
  {
    path: "guide/price",
    key: "price",
    title: "요금 안내",
    description: "출장마사지 요금 기준, 관리 유형별 차이, 이용 시간별 차이, 지역·시간대 추가 비용과 최종 금액 확인 방법을 안내합니다.",
    eyebrow: "Price Guide",
    heading: "요금 안내",
    summary: "요금은 저렴함보다 투명성이 중요합니다. 예약 전 어떤 기준으로 금액을 확인해야 하는지 정리했습니다.",
    nav: ["요금 확인", "관리 시간", "추가 비용", "최종 금액", "확인할 부분", "FAQ"],
    sections: [
      ["출장마사지 요금은 어떻게 확인하나요", "요금은 관리 유형, 이용 시간, 방문 지역, 이동 거리, 예약 시간대, 건물 출입 조건을 기준으로 상담에서 확인합니다. 안내 금액은 참고 범위이며 최종 금액은 예약 조건 확인 후 안내됩니다."],
      ["관리 시간에 따라 달라지는 요금 기준", "60분, 90분, 120분처럼 이용 시간에 따라 금액이 달라질 수 있습니다. 처음 이용한다면 긴 시간보다 컨디션과 목적에 맞는 시간을 상담에서 확인하는 것이 좋습니다."],
      ["지역과 시간대에 따른 추가 비용 안내", "외곽 이동, 심야 시간, 주차 난이도, 당일 예약 상황에 따라 추가 비용이 생길 수 있습니다. 추가 비용 가능성은 예약 확정 전에 반드시 확인하는 것이 좋습니다."],
      ["예약 전 최종 금액을 확인해야 하는 이유", "방문 서비스는 주소와 시간대에 따라 실제 이동 조건이 달라집니다. 최종 금액을 확인하지 않으면 현장에서 오해가 생길 수 있으므로 상담 단계에서 금액 범위와 포함 항목을 분명히 해야 합니다."],
      ["요금 안내를 받을 때 확인할 부분", "관리 시간, 관리 유형, 출장비 포함 여부, 심야 비용, 결제 방식, 취소 기준을 함께 확인하세요. ‘최저가’나 ‘무조건 할인’보다 조건이 명확한 안내가 더 안전합니다."],
      ["요금 관련 자주 묻는 질문", "요금표와 실제 금액이 다를 수 있나요? 지역과 시간 조건에 따라 달라질 수 있습니다. 결제 전 다시 확인할 수 있나요? 예약 확정 전 최종 금액을 다시 확인하는 것이 좋습니다."]
    ]
  },
  {
    path: "guide/service-time",
    key: "service-time",
    title: "이용 가능 시간",
    description: "출장마사지 상담 가능 시간, 방문 가능 시간대, 주간·야간 예약 차이, 심야 예약 전 확인사항을 안내합니다.",
    eyebrow: "Service Time",
    heading: "이용 가능 시간",
    summary: "예약 가능 여부는 시간만으로 정해지지 않습니다. 지역, 이동 동선, 예약 현황까지 함께 확인해야 합니다.",
    nav: ["시간 확인", "주간과 야간", "심야 확인", "지역 차이", "몰리는 시간", "FAQ"],
    sections: [
      ["출장마사지 이용 가능 시간은 어떻게 확인하나요", "이용 가능 시간은 상담 가능 시간과 실제 방문 가능 시간을 나누어 확인하는 것이 좋습니다. 문의 시 희망 시간, 지역, 관리 유형, 주소 조건을 함께 알려주면 더 정확합니다."],
      ["주간과 야간 예약의 차이", "주간은 이동 조건이 비교적 예측되지만 업무 일정이나 교통 상황에 영향을 받을 수 있습니다. 야간은 퇴근 후 문의가 몰릴 수 있어 여유 있게 상담하는 편이 좋습니다."],
      ["심야 시간 이용 전 확인할 점", "심야 예약은 지역, 안전한 출입 방식, 건물 출입 가능 시간, 이동 거리, 추가 비용 가능성을 함께 확인해야 합니다. ‘무조건 가능’보다 조건 확인을 우선하는 안내가 안전합니다."],
      ["지역별 방문 가능 시간이 달라질 수 있는 이유", "서울, 경기, 인천 안에서도 도로 연결, 외곽 여부, 주차 가능성, 앞선 예약 위치에 따라 방문 가능 시간이 달라질 수 있습니다. 가까운 지역이라도 실제 이동 시간이 길어질 수 있습니다."],
      ["예약이 몰리는 시간대와 여유 있는 시간대", "평일 퇴근 직후와 주말 저녁은 문의가 몰리는 편입니다. 가능하면 희망 시간보다 조금 일찍 문의하고, 대체 가능한 시간대를 함께 준비하면 선택지가 넓어집니다."],
      ["이용 시간 관련 자주 묻는 질문", "늦은 시간도 가능한가요? 상담 시점의 지역과 예약 현황을 기준으로 확인합니다. 원하는 시간에 꼭 받을 수 있나요? 확정 전까지는 가능 여부를 다시 확인해야 합니다."]
    ]
  },
  {
    path: "guide/available-area",
    key: "available-area",
    title: "방문 가능 지역",
    description: "서울, 경기, 인천 방문 가능 지역 확인 방법과 지역별 예약 가능 여부, 이동 거리와 시간 차이를 안내합니다.",
    eyebrow: "Available Area",
    heading: "방문 가능 지역",
    summary: "방문 가능 지역은 행정구역 이름만으로 확정되지 않습니다. 실제 이동 조건과 시간대를 함께 확인해야 합니다.",
    nav: ["수도권 지역", "서울", "경기", "인천", "지역 차이", "확인 방법"],
    sections: [
      ["서울·경기·인천 방문 가능 지역 안내", "간다GO는 서울, 경기, 인천을 중심으로 방문 가능 지역을 안내합니다. 이 페이지에서는 상위 지역 구조를 설명하고, 상세 행정구역은 지역별 찾기 페이지로 연결합니다."],
      ["서울 출장마사지 가능 지역", "서울은 25개 자치구를 기준으로 세부 페이지를 제공합니다. 강남구처럼 업무와 주거 이동이 겹치는 지역은 건물 출입 방식과 주차 가능 여부를 함께 확인하는 것이 좋습니다."],
      ["경기 출장마사지 가능 지역", "경기는 시·군 단위 생활권이 넓어 세부 주소 확인이 중요합니다. 수원, 성남, 고양, 용인처럼 생활권이 큰 도시는 구 또는 동 단위 위치에 따라 가능 시간이 달라질 수 있습니다."],
      ["인천 출장마사지 가능 지역", "인천은 기존 행정구와 2026년 7월 1일 예정된 행정체제 개편 지역까지 반영해 안내합니다. 송도, 부평, 검단, 영종처럼 생활권 특성이 다르므로 세부 위치를 확인해야 합니다."],
      ["방문 가능 여부는 왜 지역마다 다를 수 있나요", "방문 가능 여부는 거리, 도로 상황, 예약 현황, 건물 출입 방식, 주차 난이도, 시간대에 따라 달라집니다. 행정구역상 가까워 보여도 실제 이동 조건이 좋지 않을 수 있습니다."],
      ["내 지역이 가능한지 확인하는 방법", "지역별 찾기에서 상위 지역과 세부 행정구역을 먼저 확인한 뒤, 전화 상담에서 상세 주소와 희망 시간을 알려주세요. 상담 시점의 실제 조건을 기준으로 안내합니다."]
    ],
    related: [
      ["서울 출장마사지 지역 보기", "#panel-seoul"],
      ["경기 출장마사지 지역 보기", "#panel-gyeonggi"],
      ["인천 출장마사지 지역 보기", "#panel-incheon"],
      ["강남구 출장마사지 보기", "area/seoul/gangnam/"],
      ["수원 출장마사지 보기", "area/gyeonggi/suwon/"],
      ["부평구 출장마사지 보기", "area/incheon/bupyeong/"]
    ]
  },
  {
    path: "guide/prepare",
    key: "prepare",
    title: "이용 전 준비사항",
    description: "출장마사지 이용 전 확인할 정보, 장소 정리, 샤워와 복장, 수건과 공간, 주차와 출입, 피부 민감도 확인사항을 안내합니다.",
    eyebrow: "Prepare",
    heading: "이용 전 준비사항",
    summary: "예약 전 작은 준비가 방문 흐름을 훨씬 편하게 만듭니다. 처음 이용자가 놓치기 쉬운 내용을 정리했습니다.",
    nav: ["준비 항목", "장소 정리", "관리 유형", "오일 확인", "놓치기 쉬운 부분", "FAQ"],
    sections: [
      ["출장마사지 이용 전 무엇을 준비하면 좋을까요", "상세 주소, 희망 시간, 공동현관 출입 방식, 주차 가능 여부, 관리 유형, 피해야 할 부위를 미리 정리하면 상담이 빨라집니다. 준비가 어렵다면 상담에서 순서대로 확인해도 됩니다."],
      ["이용 장소를 미리 정리해야 하는 이유", "방문 관리는 관리가 가능한 조용한 공간이 필요합니다. 바닥이나 침대 주변 공간, 조명, 온도, 반려동물이나 동거인의 이동 동선을 미리 정리하면 이용 중 불편을 줄일 수 있습니다."],
      ["관리 유형에 따라 준비가 달라지는 부분", "오일 관리는 샤워와 수건, 피부 민감도 확인이 중요하고, 건식 관리는 편안한 복장과 관리 강도 확인이 중요합니다. 관리 유형마다 필요한 준비가 다르므로 예약 전 확인하세요."],
      ["오일 관리 전 확인해야 할 사항", "오일 알레르기, 향 민감도, 피부 자극, 샤워 가능 여부, 수건 준비 여부를 확인합니다. 피부 질환이나 염증이 있다면 무리하게 진행하지 않는 것이 안전합니다."],
      ["처음 이용하는 분들이 놓치기 쉬운 부분", "공동현관 호출 방식, 엘리베이터 이용 시간, 주차 가능 여부, 정확한 건물명은 자주 빠지는 정보입니다. 이 부분이 늦게 확인되면 도착 시간이 지연될 수 있습니다."],
      ["이용 전 준비사항 관련 자주 묻는 질문", "준비물이 꼭 필요한가요? 관리 유형과 장소에 따라 달라질 수 있습니다. 주소는 어느 정도까지 알려야 하나요? 예약 확정 전에는 실제 방문 가능 여부 확인에 필요한 정보를 상담에서 안내받으면 됩니다."]
    ]
  },
  {
    path: "guide/safety",
    key: "safety",
    title: "안전 이용 안내",
    description: "안전한 출장마사지 이용을 위한 예약 상담 기준, 방문 전 안내, 불편사항 대응, 개인정보 보호와 운영 원칙을 안내합니다.",
    eyebrow: "Safety Guide",
    heading: "안전 이용 안내",
    summary: "출장형 서비스에서 가장 중요한 것은 명확한 기준입니다. 안전하고 건전한 이용을 위한 확인사항을 정리했습니다.",
    nav: ["안전 기준", "상담 정보", "방문 전 안내", "불편 대응", "개인정보", "FAQ"],
    sections: [
      ["안전하게 이용하려면 무엇을 확인해야 하나요", "예약 전 운영 기준, 요금, 방문 가능 지역, 관리 유형, 출입 방식, 취소 기준을 확인하세요. 불분명한 안내보다 조건을 차분히 확인하는 상담이 더 안전합니다."],
      ["예약 상담 시 확인해야 할 기본 정보", "상담에서는 지역, 시간, 이용 장소, 관리 유형, 주차와 출입 조건을 확인합니다. 개인 정보는 예약 가능 여부 확인에 필요한 범위에서만 다루는 것이 좋습니다."],
      ["방문 전 안내가 중요한 이유", "방문 전 도착 예상 시간, 준비사항, 출입 방식, 주차나 정차 가능 지점을 확인하면 현장 혼선을 줄일 수 있습니다. 건물 보안 절차가 있는 경우 미리 공유하세요."],
      ["이용 중 불편사항이 있을 때 대응 방법", "이용 중 불편한 강도, 환경, 시간 문제가 있다면 즉시 조정 요청을 해야 합니다. 참거나 무리하게 진행하기보다 안전과 컨디션을 우선으로 판단하는 것이 좋습니다."],
      ["개인정보 보호와 예약 정보 관리 기준", "예약 상담에서 확인한 정보는 가능 여부 안내와 상담 응대 목적에 맞게 다뤄야 합니다. 공개 페이지에는 개인을 식별할 수 있는 후기나 민감한 정보를 노출하지 않습니다."],
      ["안전 이용 관련 자주 묻는 질문", "불편한 요청은 거절할 수 있나요? 이용자와 운영 기준 모두를 위해 무리한 요청은 제한됩니다. 후기에는 실명을 쓰나요? 실제 게시 시에는 동의와 익명 처리를 기준으로 합니다."]
    ]
  },
  {
    path: "guide/first-time",
    key: "first-time",
    title: "처음 이용 안내",
    description: "출장마사지가 처음인 분을 위해 문의 전 확인할 정보, 예약 흐름, 요금 확인, 준비사항과 안전 기준을 안내합니다.",
    eyebrow: "First Time",
    heading: "처음 이용 안내",
    summary: "처음이라면 무엇을 먼저 말해야 할지부터 헷갈릴 수 있습니다. 문의 전 확인할 내용을 쉽게 정리했습니다.",
    nav: ["처음 확인", "문의 순서", "요금과 시간", "준비사항", "주의 기준", "FAQ"],
    sections: [
      ["처음 이용할 때 무엇부터 확인하나요", "먼저 지역, 희망 시간, 이용 장소, 원하는 관리 유형이 있는지 정리하세요. 정하지 못했다면 컨디션과 선호도를 상담에서 말해도 됩니다."],
      ["전화 문의는 어떤 순서로 하면 좋나요", "지역과 시간을 먼저 말하고, 이용 장소와 관리 유형을 이어서 확인하면 상담이 빠릅니다. 이후 요금 범위, 가능 시간, 방문 전 준비사항을 확인하세요."],
      ["요금과 시간은 어떻게 이해하면 좋나요", "요금과 시간은 고정값이 아니라 상담 시점의 조건에 따라 달라질 수 있습니다. 최종 안내를 확인한 뒤 예약을 확정하는 흐름이 안전합니다."],
      ["처음 이용 전 준비하면 좋은 것", "공동현관 출입 방식, 주차 가능 여부, 조용한 공간, 샤워 가능 여부, 오일 사용 선호, 피해야 할 부위를 미리 정리해두면 좋습니다."],
      ["처음 이용자가 특히 확인할 기준", "과장된 만족 표현이나 불분명한 비용 안내보다 운영 기준이 분명한지 확인하세요. 치료 효과 보장이나 부적절한 요청은 이용 기준에 맞지 않습니다."],
      ["처음 이용 관련 자주 묻는 질문", "관리 유형을 꼭 정해야 하나요? 꼭 그렇지는 않습니다. 상담에서 컨디션과 선호도를 말하면 선택 기준을 안내받을 수 있습니다."]
    ]
  },
  {
    path: "guide/cancel-change",
    key: "cancel-change",
    title: "예약 취소 및 변경 안내",
    description: "출장마사지 예약 시간, 주소, 관리 유형 변경과 취소 기준, 방문 준비 이후 조정 가능 범위를 안내합니다.",
    eyebrow: "Cancel Change",
    heading: "예약 취소 및 변경 안내",
    summary: "예약 변경은 가능한 빨리 알려주는 것이 좋습니다. 이동 준비 여부에 따라 조정 범위가 달라질 수 있습니다.",
    nav: ["변경 기준", "시간 변경", "주소 변경", "취소 기준", "이동 이후", "FAQ"],
    sections: [
      ["예약 변경은 언제까지 말해야 하나요", "시간, 주소, 관리 유형 변경이 필요하면 가능한 빨리 전화로 알려주세요. 방문 준비가 시작되기 전일수록 조정 가능성이 높습니다."],
      ["시간 변경 시 확인할 부분", "희망 시간을 바꾸면 앞뒤 예약과 이동 동선이 다시 조정됩니다. 변경 가능 여부는 상담 시점의 예약 현황을 기준으로 확인합니다."],
      ["주소 변경 시 확인할 부분", "주소가 바뀌면 이동 거리, 주차 조건, 출입 방식이 달라질 수 있습니다. 같은 행정구역 안에서도 가능 시간이 달라질 수 있어 다시 확인해야 합니다."],
      ["취소 기준은 어떻게 확인하나요", "취소는 방문 준비와 이동 시작 여부에 따라 안내가 달라질 수 있습니다. 예약 확정 전 취소 기준을 먼저 확인하는 것이 좋습니다."],
      ["방문 준비 이후 조정이 제한될 수 있는 이유", "관리사가 이동을 시작했거나 준비가 진행된 뒤에는 시간과 비용이 이미 발생할 수 있습니다. 그래서 변경이나 취소는 빠른 연락이 중요합니다."],
      ["취소 및 변경 관련 자주 묻는 질문", "당일 변경도 가능한가요? 상황에 따라 다릅니다. 주소를 잘못 말했을 때는 어떻게 하나요? 즉시 연락해 재확인해야 합니다."]
    ]
  },
  {
    path: "guide/payment",
    key: "payment",
    title: "결제 안내",
    description: "출장마사지 결제 전 최종 요금 확인, 결제 방식 상담, 추가 비용 확인, 영수 기준과 주의사항을 안내합니다.",
    eyebrow: "Payment",
    heading: "결제 안내",
    summary: "결제 전에는 최종 요금과 포함 항목을 확인하는 것이 중요합니다. 불명확한 비용을 줄이는 기준을 안내합니다.",
    nav: ["결제 전 확인", "최종 요금", "추가 비용", "결제 방식", "주의사항", "FAQ"],
    sections: [
      ["결제 전 무엇을 확인해야 하나요", "관리 유형, 이용 시간, 방문 지역, 출장비 포함 여부, 심야 비용 가능성, 취소 기준을 먼저 확인하세요. 결제는 안내받은 조건을 이해한 뒤 진행하는 것이 좋습니다."],
      ["최종 요금을 다시 확인해야 하는 이유", "상담 초기에 들은 금액과 최종 조건이 달라질 수 있습니다. 주소, 시간, 관리 유형이 확정된 뒤 최종 금액을 다시 확인해야 오해를 줄일 수 있습니다."],
      ["추가 비용은 어떤 경우 생길 수 있나요", "외곽 이동, 심야 시간, 주차 난이도, 당일 예약 상황에 따라 추가 비용 가능성이 있습니다. 추가 비용은 예약 확정 전에 안내받는 것이 원칙입니다."],
      ["결제 방식은 어떻게 확인하나요", "결제 방식은 상담에서 안내받고, 실제 이용 조건에 맞는지 확인하세요. 결제 전에는 금액, 시간, 장소, 관리 유형이 모두 맞는지 다시 보는 것이 좋습니다."],
      ["결제 관련 주의사항", "‘무조건 저렴’, ‘파격 할인’ 같은 표현보다 비용 구조가 명확한지 확인하는 것이 중요합니다. 불명확한 요구나 부적절한 요청은 결제와 관계없이 진행하지 않습니다."],
      ["결제 관련 자주 묻는 질문", "결제 전 취소 기준을 확인할 수 있나요? 예약 확정 전에 확인하는 것이 좋습니다. 추가 비용은 언제 알 수 있나요? 지역과 시간 조건 확인 후 안내됩니다."]
    ]
  },
  {
    path: "guide/faq",
    key: "faq",
    title: "이용 방법 FAQ",
    description: "출장마사지 이용 방법, 예약, 요금, 가능 시간, 방문 지역, 준비사항, 안전 기준에 대한 자주 묻는 질문을 정리합니다.",
    eyebrow: "Guide FAQ",
    heading: "이용 방법 FAQ",
    summary: "예약 전 자주 묻는 질문을 모았습니다. 세부 조건은 상담 시점의 운영 기준으로 다시 확인해 주세요.",
    nav: ["예약", "요금", "시간", "지역", "준비", "안전"],
    sections: [
      ["예약은 전화로만 확인하나요", "현재 예약 문의는 전화 상담을 기준으로 안내합니다. 지역, 희망 시간, 관리 유형, 주소 조건을 알려주면 가능 여부를 확인할 수 있습니다."],
      ["요금은 고정인가요", "요금은 관리 유형, 시간, 지역, 이동 조건, 시간대에 따라 달라질 수 있습니다. 최종 금액은 예약 확정 전 상담에서 다시 확인합니다."],
      ["원하는 시간에 바로 가능한가요", "가능 여부는 예약 현황과 이동 동선에 따라 달라집니다. 평일 퇴근 후와 주말 저녁은 문의가 몰릴 수 있어 미리 상담하는 것이 좋습니다."],
      ["우리 지역도 가능한가요", "서울, 경기, 인천 중심으로 확인합니다. 상세 행정구역은 지역별 찾기에서 확인하고, 실제 가능 여부는 상담에서 다시 확인해 주세요."],
      ["이용 전 무엇을 준비해야 하나요", "조용한 공간, 상세 주소, 공동현관 출입 방식, 주차 가능 여부, 샤워와 수건 준비 여부, 피부 민감도와 피해야 할 부위를 확인하면 좋습니다."],
      ["안전 기준은 어떻게 운영되나요", "간다GO는 합법적인 웰니스 방문 관리 안내를 기준으로 합니다. 무리한 요청, 부적절한 요청, 치료 효과 보장 표현은 사용하지 않습니다."]
    ]
  }
];

const baseFor = (pagePath) => "../".repeat(pagePath.split("/").length);

const linkHref = (href, base) => href.startsWith("#") ? `${base}${href}` : `${base}${href}`;

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
            <a href="${base}service/business-trip-massage/">출장마사지 안내</a>
            <a href="${base}service/hometai/">홈타이 안내</a>
            <a href="${base}service/swedish/">스웨디시 안내</a>
            <a href="${base}service/aroma/">아로마 관리 안내</a>
            <a href="${base}service/dry-massage/">건식 관리 안내</a>
            <a href="${base}service/before-reservation/">예약 전 확인사항</a>
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
        <p>서울 · 경기 · 인천에 집중한 합법 웰니스 방문 마사지 안내 서비스입니다.</p>
        <a class="footer-call" href="tel:${phone}">예약 문의 ${phone}</a>
        <div class="footer-social" aria-label="Gandago social links">
          <span>SNS</span>
          <a href="https://www.linkedin.com/in/%EB%B0%B1%ED%98%B8-%EA%B0%95-a84273261/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://medium.com/@88smartbro88" target="_blank" rel="noopener noreferrer">Medium</a>
          <a href="https://x.com/gugeulmake84173" target="_blank" rel="noopener noreferrer">X</a>
        </div>
      </div>
      <nav class="footer-nav" aria-label="하단 주요 메뉴">
        <div>
          <h2>이용 방법</h2>
          <a href="${base}guide/">이용 방법</a>
          <a href="${base}guide/reservation/">예약 절차</a>
          <a href="${base}guide/price/">요금 안내</a>
          <a href="${base}guide/first-time/">처음 이용 안내</a>
        </div>
        <div>
          <h2>서비스</h2>
          <a href="${base}service/">서비스 안내</a>
          <a href="${base}service/business-trip-massage/">출장마사지 안내</a>
          <a href="${base}#areas">방문 가능 지역</a>
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
        <span>&#51060;&#47700;&#51068; <a href="mailto:help@gandago.xyz">help@gandago.xyz</a></span>
        <span>주소 경기도 파주시 청석로 268</span>
      </address>
      <div class="footer-disclosure">
        <p>간다GO는 불법·성매매·선정적 서비스를 제공하거나 중개하지 않으며, 질병 진단 또는 치료 효과를 보장하지 않습니다.</p>
        <p>최종 수정일: ${updated}. 실제 가능 지역, 예약 시간, 금액은 상담 시점의 운영 조건을 기준으로 안내합니다.</p>
      </div>
    </footer>`;

const pageHtml = (page) => {
  const base = baseFor(page.path);
  const canonical = `${siteUrl}/${page.path}/`;
  const related = page.related ?? [
    ["예약 절차 확인하기", "guide/reservation/"],
    ["요금 안내 보기", "guide/price/"],
    ["방문 가능 지역 확인하기", "guide/available-area/"],
    ["이용 전 준비사항 보기", "guide/prepare/"],
    ["안전 이용 안내 보기", "guide/safety/"],
    ["처음 이용하는 분을 위한 안내 보기", "guide/first-time/"]
  ];
  const cards = page.cards ?? related.map(([label, href]) => [label, href, relatedText[page.key] ?? relatedText.guide]);

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
    <meta property="og:image" content="${siteUrl}/assets/og-image.jpg" />
    <meta property="og:image:secure_url" content="${siteUrl}/assets/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="간다GO ${page.title} 안내 이미지" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title} | 간다GO" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${siteUrl}/assets/og-image.jpg" />
  </head>
  <body class="content-page service-page guide-page">
${header(base)}
    <main class="content-main">
      <section class="content-hero service-hero">
        <p class="eyebrow">${page.eyebrow}</p>
        <h1>${page.heading}</h1>
        <p>${page.summary}</p>
      </section>

      <nav class="service-page-nav" aria-label="${page.title} 목차">
        ${page.nav.map((item, index) => `<a href="#section-${index + 1}">${item}</a>`).join("\n        ")}
      </nav>

      <section class="content-grid service-detail-grid" aria-label="${page.title} 본문">
        ${page.sections.map(([heading, body], index) => `<article class="content-card" id="section-${index + 1}">
          <span class="card-number">${String(index + 1).padStart(2, "0")}</span>
          <h2>${heading}</h2>
          <p>${body}</p>
        </article>`).join("\n        ")}
      </section>

      <section class="service-related" aria-label="함께 확인하면 좋은 안내">
        <div>
          <p class="eyebrow">Next Guide</p>
          <h2>함께 확인하면 좋은 안내</h2>
          <p>${relatedText[page.key] ?? relatedText.guide}</p>
        </div>
        <div class="service-related-grid">
          ${cards.map(([label, href, text]) => `<a href="${linkHref(href, base)}">
            <strong>${label}</strong>
            <span>${text}</span>
          </a>`).join("\n          ")}
        </div>
      </section>

      <section class="content-cta">
        <div>
          <h2>예약 전 궁금한 점이 있다면 전화 상담으로 확인하세요</h2>
          <p>지역, 시간, 관리 유형, 요금 범위를 상담 시점의 운영 조건에 맞춰 안내합니다.</p>
        </div>
        <a class="button primary" href="tel:${phone}">${phone}</a>
      </section>
    </main>
${footer(base)}
    <script src="${base}script.js" defer></script>
  </body>
</html>
`;
};

const main = async () => {
  const root = process.cwd();

  for (const page of guidePages) {
    const dir = path.join(root, ...page.path.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), pageHtml(page));
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
