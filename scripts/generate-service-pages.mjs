import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://gandago.xyz";
const phone = "0508-202-4743";
const updated = "2026-05-21";

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
  ["피로 관리", "magazine/#cat-fatigue"],
  ["지역 생활 정보", "magazine/#cat-local-life"],
  ["마사지 상식", "magazine/#cat-knowledge"],
  ["예약 전 알아둘 점", "magazine/#cat-before-booking"],
  ["직장인 피로 회복", "magazine/#cat-office-fatigue"]
];

const sharedLinks = [
  ["예약 절차 안내", "guide/reservation/"],
  ["요금 안내", "guide/price/"],
  ["서울 출장마사지 가능 지역", "#panel-seoul"],
  ["경기 출장마사지 가능 지역", "#panel-gyeonggi"],
  ["인천 출장마사지 가능 지역", "#panel-incheon"],
  ["처음 이용하는 분을 위한 안내", "guide/first-time/"]
];

const servicePages = [
  {
    path: "service",
    title: "서비스 안내",
    description: "간다GO 방문 관리 서비스 안내 허브입니다. 출장마사지, 홈타이, 스웨디시, 아로마, 건식 관리와 예약 전 확인사항을 한눈에 정리합니다.",
    eyebrow: "Service Guide",
    heading: "서비스 안내",
    summary: "방문 관리 서비스를 처음 살펴보는 분들이 관리 유형과 예약 전 확인사항을 차분하게 비교할 수 있도록 정리했습니다.",
    nav: ["방문 관리 서비스 한눈에 보기", "출장마사지 안내", "홈타이 안내", "스웨디시·아로마·건식", "예약 전 확인사항", "FAQ"],
    sections: [
      ["나에게 맞는 방문 관리 서비스를 찾는 방법", "방문 관리는 장소, 시간, 선호하는 관리 방식, 오일 사용 여부, 강도 선호에 따라 선택 기준이 달라집니다. 간다GO는 서울·경기·인천 가능 지역을 기준으로 실제 상담에 필요한 정보를 먼저 확인하고, 과장된 표현보다 예약 전 판단에 도움이 되는 내용을 안내합니다."],
      ["출장마사지와 홈타이의 기본 차이", "출장마사지 안내는 방문 관리 서비스 전체의 흐름과 가능 지역, 예약 기준을 설명하는 페이지입니다. 홈타이는 그중에서도 집이나 숙소처럼 익숙한 공간에서 편하게 이용하는 방식에 초점을 맞춥니다. 두 페이지를 분리해 중복 설명을 줄이고, 사용자가 목적에 맞는 정보를 빠르게 찾도록 구성했습니다."],
      ["스웨디시·아로마·건식 관리의 특징", "스웨디시는 부드러운 압과 릴랙스 중심의 흐름, 아로마 관리는 오일과 향 선호도, 건식 관리는 오일 없이 진행되는 관리 방식에 초점을 둡니다. 각 서비스 페이지는 선정적 표현이나 치료 보장 표현 없이 관리 방식과 예약 전 확인사항을 중심으로 설명합니다."],
      ["처음 예약 전 확인해야 할 사항", "처음 이용한다면 상세 주소, 희망 시간, 방문 가능 지역, 관리 유형, 요금 범위, 취소·변경 기준을 먼저 확인하는 것이 좋습니다. 특히 피부 민감도, 피해야 할 부위, 건물 출입 방식과 주차 가능 여부는 상담 단계에서 미리 공유하면 안내가 더 정확해집니다."],
      ["서울·경기·인천 이용 가능 지역 안내", "간다GO는 전국 지역명을 넓게 다루기보다 서울, 경기, 인천 지역을 중심으로 실제 운영 가능한 권역을 안내합니다. 세부 행정구역은 지역별 찾기 메뉴에서 확인하고, 서비스 안내 페이지에서는 관리 유형과 예약 기준을 중심으로 살펴보면 좋습니다."],
      ["서비스 안내 관련 자주 묻는 질문", "서비스 종류를 먼저 정해야 하나요? 꼭 그렇지는 않습니다. 상담 시 컨디션, 오일 사용 선호, 이용 장소, 희망 시간을 알려주면 선택지를 좁힐 수 있습니다. 의료 행위나 치료 효과를 보장하는 서비스는 아니며, 불법·선정적 요청은 받지 않습니다."]
    ],
    cards: serviceLinks.map(([label, href]) => [label, `${href}`, `${label} 페이지에서 이용 흐름과 예약 전 확인사항을 자세히 확인할 수 있습니다.`])
  },
  {
    path: "service/business-trip-massage",
    title: "출장마사지 안내",
    description: "출장마사지가 어떤 상황에서 이용되는 방문 관리 서비스인지, 예약 흐름과 가능 지역, 예약 전 확인사항을 안내합니다.",
    eyebrow: "Business Trip Massage",
    heading: "출장마사지 안내",
    summary: "출장마사지의 기본 개념, 예약부터 방문까지의 흐름, 서울·경기·인천 이용 가능 지역과 처음 이용 전 확인할 점을 정리했습니다.",
    nav: ["출장마사지란 무엇인가요", "필요한 상황", "진행 흐름", "장소와 시간", "가능 지역", "FAQ"],
    sections: [
      ["출장마사지란 어떤 서비스인가요", "출장마사지는 이용자가 매장으로 이동하지 않고 집, 숙소, 업무 후 머무는 공간에서 상담 기준에 따라 방문 관리를 받는 방식입니다. 이동 시간을 줄이고 익숙한 공간에서 휴식을 준비할 수 있다는 점이 특징이지만, 실제 가능 여부는 지역, 시간, 건물 출입 조건, 예약 현황에 따라 달라질 수 있습니다."],
      ["집이나 숙소에서 이용하는 방문 관리의 특징", "출장마사지가 필요한 상황은 늦은 퇴근 후 이동이 부담스러운 경우, 장시간 운전이나 업무 후 몸이 무겁게 느껴지는 경우, 숙소에서 조용히 쉬고 싶은 경우처럼 생활 흐름 안에서 생깁니다. 다만 의료 목적의 치료나 통증 개선 보장을 전제로 이용하는 서비스가 아니므로 컨디션이 좋지 않다면 먼저 전문가 상담을 고려하는 것이 좋습니다."],
      ["예약부터 방문까지 진행되는 과정", "기본 흐름은 상담, 가능 지역 확인, 시간과 관리 유형 안내, 요금 범위 확인, 방문 전 준비사항 공유 순서로 진행됩니다. 상담 단계에서는 상세 주소, 공동현관 출입 방식, 주차 가능 여부, 희망 시간, 피해야 할 부위를 알려주면 더 정확한 안내가 가능합니다."],
      ["서울·경기·인천 이용 가능 지역 안내", "간다GO는 서울, 경기, 인천 중심으로 방문 가능 지역을 안내합니다. 서비스 설명 페이지에서 지역명을 반복하기보다 세부 행정구역은 지역별 찾기에서 확인하도록 분리했습니다. 이 구조는 사용자가 서비스 유형과 가능 지역을 혼동하지 않도록 돕습니다."],
      ["처음 이용 전 꼭 확인해야 할 사항", "처음 이용한다면 요금 범위, 추가 비용 가능성, 취소·변경 기준, 건물 출입 방식, 관리 유형을 먼저 확인하세요. 오일 사용 여부나 강도 선호도처럼 개인차가 있는 부분은 예약 전에 공유하는 편이 좋습니다."],
      ["출장마사지 이용 시 자주 묻는 질문", "당일 예약은 가능한가요? 상담 시점의 예약 현황과 이동 동선에 따라 달라집니다. 장소는 어디까지 가능한가요? 집과 숙소처럼 관리가 가능한 조용한 공간을 기준으로 확인합니다. 불법·선정적 요청은 금액과 관계없이 받지 않습니다."]
    ],
    related: [
      ["서울 출장마사지 가능 지역 보기", "#panel-seoul"],
      ["경기 출장마사지 가능 지역 보기", "#panel-gyeonggi"],
      ["인천 출장마사지 가능 지역 보기", "#panel-incheon"],
      ["예약 절차 확인하기", "guide/reservation/"],
      ["요금 안내 확인하기", "guide/price/"]
    ]
  },
  {
    path: "service/hometai",
    title: "홈타이 안내",
    description: "홈타이의 기본 방식, 출장마사지와의 차이, 집에서 이용할 때 준비하면 좋은 사항과 예약 전 확인 기준을 안내합니다.",
    eyebrow: "Home Thai",
    heading: "홈타이 안내",
    summary: "홈타이는 집이나 숙소처럼 익숙한 공간에서 편하게 이용하는 방문 관리 방식입니다. 출장마사지와의 차이를 중심으로 살펴보세요.",
    nav: ["홈타이란 무엇인가요", "출장마사지와 차이", "이용 상황", "준비사항", "운영 기준", "FAQ"],
    sections: [
      ["홈타이는 어떤 방식의 방문 관리인가요", "홈타이는 이용자가 있는 공간으로 방문해 진행되는 관리 방식 중 하나입니다. 집에서 준비할 수 있는 조용한 환경, 관리 전후 이동 부담이 적다는 점, 이용자가 익숙한 공간에서 편하게 쉴 수 있다는 점이 주요 특징입니다."],
      ["출장마사지와 홈타이는 어떻게 다른가요", "출장마사지 안내가 방문 관리 서비스 전체의 흐름과 가능 지역을 설명한다면, 홈타이 안내는 집이나 숙소에서 이용하는 상황에 더 집중합니다. 같은 방문 관리라도 페이지 역할을 나누어 중복 콘텐츠를 줄이고 사용자가 원하는 정보를 더 빠르게 찾도록 구성했습니다."],
      ["집에서 편하게 이용할 때의 장점", "퇴근 후 다시 이동하기 어렵거나, 숙소에서 조용히 쉬고 싶은 경우, 이동 시간을 줄이고 싶은 경우에 홈타이 방식이 잘 맞을 수 있습니다. 다만 관리가 가능한 공간인지, 출입 방식과 주차 조건이 괜찮은지는 예약 전 확인해야 합니다."],
      ["예약 전 준비하면 좋은 기본 사항", "수건 준비 여부, 샤워 가능 여부, 관리 공간의 조도와 온도, 공동현관 출입 방식, 반려동물이나 동거인의 동선처럼 방문 환경에 영향을 줄 수 있는 요소를 미리 확인하면 좋습니다."],
      ["홈타이 이용 전 확인해야 할 운영 기준", "간다GO는 합법적인 웰니스 방문 관리 안내를 기준으로 운영합니다. 선정적 요청, 치료 효과 보장, 불법적 요구는 받지 않으며, 사용자의 컨디션에 따라 무리한 관리는 피하는 것이 원칙입니다."],
      ["홈타이 관련 자주 묻는 질문", "집이 아니어도 가능한가요? 숙소 등 관리가 가능한 조용한 공간이라면 상담에서 확인할 수 있습니다. 준비물이 꼭 필요한가요? 상황에 따라 달라질 수 있으므로 예약 전 안내를 확인하는 것이 좋습니다."]
    ]
  },
  {
    path: "service/swedish",
    title: "스웨디시 안내",
    description: "스웨디시 관리의 기본 특징, 아로마 관리와의 차이, 처음 이용 전 알아두면 좋은 예약 기준을 안내합니다.",
    eyebrow: "Swedish",
    heading: "스웨디시 안내",
    summary: "스웨디시는 부드러운 압과 편안한 분위기를 중심으로 설명하는 방문 관리 유형입니다. 과장된 표현 없이 기본 특징을 안내합니다.",
    nav: ["스웨디시란 무엇인가요", "기본 특징", "아로마와 차이", "잘 맞는 이용자", "예약 전 확인사항", "FAQ"],
    sections: [
      ["스웨디시는 어떤 관리 방식인가요", "스웨디시는 부드러운 압과 릴랙스 중심의 흐름을 선호하는 이용자에게 자주 언급되는 관리 방식입니다. 강한 자극이나 선정적인 암시가 아니라, 편안한 분위기와 긴장 완화 목적의 웰니스 관점에서 이해하는 것이 좋습니다."],
      ["부드러운 압과 릴랙스 중심의 특징", "스웨디시 안내에서 중요한 부분은 관리 강도와 분위기입니다. 처음 이용한다면 강한 압을 무리하게 요청하기보다 불편한 부위, 피해야 할 부위, 선호하는 강도를 상담 단계에서 구체적으로 말하는 편이 안전합니다."],
      ["아로마 관리와 스웨디시의 차이", "아로마 관리는 오일과 향, 피부 민감도 확인이 중요한 반면, 스웨디시는 부드러운 흐름과 릴랙스 중심의 느낌을 설명하는 경우가 많습니다. 두 관리 모두 치료 효과를 보장하는 서비스가 아니며, 개인 컨디션에 따라 선택 기준이 달라집니다."],
      ["처음 이용하는 분들이 알아두면 좋은 점", "처음이라면 관리 시간, 오일 사용 여부, 샤워 가능 여부, 피부 민감도, 희망 강도를 확인하세요. 낯선 표현이나 과장된 광고보다 운영 기준이 분명한지 살펴보는 것이 중요합니다."],
      ["스웨디시 예약 전 확인사항", "예약 전에는 가능 지역, 시간, 요금 범위, 관리 공간, 출입 방식, 취소 기준을 확인합니다. 불법·선정적 요청은 받지 않으며, 편안한 휴식 목적의 방문 관리로 안내합니다."],
      ["스웨디시 관련 자주 묻는 질문", "누구에게 잘 맞나요? 부드러운 압과 차분한 관리를 선호하는 분에게 맞을 수 있습니다. 아픈 부위 치료 목적으로 이용해도 되나요? 의료 목적이라면 전문가 상담이 우선입니다."]
    ]
  },
  {
    path: "service/aroma",
    title: "아로마 관리 안내",
    description: "아로마 관리의 기본 방식, 오일 사용 전 확인사항, 스웨디시와의 차이와 예약 전 알아둘 점을 안내합니다.",
    eyebrow: "Aroma",
    heading: "아로마 관리 안내",
    summary: "아로마 관리는 오일과 향, 피부 민감도 확인이 중요한 방문 관리 유형입니다. 이용 전 실제 확인할 내용을 중심으로 정리했습니다.",
    nav: ["아로마 관리란 무엇인가요", "기본 특징", "스웨디시와 차이", "오일 확인", "잘 맞는 상황", "FAQ"],
    sections: [
      ["아로마 관리는 어떤 방식인가요", "아로마 관리는 오일을 활용해 부드러운 흐름으로 진행되는 관리 방식입니다. 향 선호도와 피부 상태에 따라 만족도가 달라질 수 있으므로 예약 전 확인이 중요합니다."],
      ["오일을 활용한 부드러운 관리 특징", "오일 사용 관리에서는 피부에 닿는 제품, 향의 강도, 샤워 가능 여부, 수건 준비 여부가 실제 이용 경험에 영향을 줍니다. 민감한 피부라면 상담 단계에서 미리 공유하는 것이 좋습니다."],
      ["스웨디시와 아로마 관리는 어떻게 다른가요", "스웨디시가 부드러운 압과 릴랙스 중심의 흐름을 설명하는 경우가 많다면, 아로마 관리는 오일 사용과 향, 피부 민감도 확인이 더 중요합니다. 둘 다 편안한 휴식을 돕는 웰니스 관점에서 안내합니다."],
      ["피부 민감도가 있다면 확인할 부분", "오일 알레르기, 향에 대한 민감도, 특정 부위의 피부 자극, 샤워 가능 여부를 미리 확인하세요. 피부 질환이나 염증이 있다면 무리하게 이용하지 않는 것이 안전합니다."],
      ["아로마 관리 예약 전 알아둘 점", "관리 시간, 요금 범위, 방문 가능 지역, 관리 공간 준비, 수건과 샤워 가능 여부를 확인합니다. 불법·선정적 요청이나 치료 효과 보장 표현은 사용하지 않습니다."],
      ["아로마 관리 관련 자주 묻는 질문", "오일을 꼭 사용하나요? 아로마 관리는 오일 사용을 전제로 안내되는 경우가 많지만 세부 사항은 상담에서 확인합니다. 향이 부담스러우면 미리 알려주세요."]
    ]
  },
  {
    path: "service/dry-massage",
    title: "건식 관리 안내",
    description: "건식 관리는 오일 없이 진행되는 방문 관리입니다. 특징, 적합한 상황, 복장과 준비사항을 안내합니다.",
    eyebrow: "Dry Massage",
    heading: "건식 관리 안내",
    summary: "건식 관리는 오일 사용이 부담스럽거나 옷을 갈아입는 준비를 줄이고 싶은 분들이 확인하기 좋은 관리 방식입니다.",
    nav: ["건식 관리란 무엇인가요", "기본 특징", "오일 관리와 차이", "잘 맞는 상황", "복장과 준비사항", "FAQ"],
    sections: [
      ["건식 관리는 어떤 방식인가요", "건식 관리는 오일을 사용하지 않고 진행되는 관리 방식입니다. 옷이나 수건 준비가 비교적 단순할 수 있지만, 관리 강도와 피해야 할 부위는 예약 전 반드시 공유해야 합니다."],
      ["오일 없이 진행되는 관리의 특징", "오일이 부담스러운 경우, 샤워 준비가 어렵거나 향에 민감한 경우, 짧고 명확한 관리 흐름을 선호하는 경우 건식 관리가 선택지가 될 수 있습니다. 다만 강한 압이 항상 좋은 것은 아니므로 컨디션을 기준으로 조절해야 합니다."],
      ["아로마·스웨디시와 건식 관리의 차이", "아로마와 스웨디시는 오일 사용과 부드러운 흐름이 중심이 되는 경우가 많고, 건식 관리는 오일 없이 비교적 담백하게 진행되는 방식으로 설명할 수 있습니다. 어떤 방식이 더 좋다기보다 이용 상황에 맞는 선택이 중요합니다."],
      ["몸이 무겁거나 뭉쳤을 때 확인할 부분", "운동 후, 장시간 운전 후, 오래 앉아 있는 직장인처럼 몸이 무겁게 느껴지는 상황에서 문의가 있을 수 있습니다. 단, 통증이나 부상 치료 목적이라면 의료 전문가 상담이 먼저입니다."],
      ["건식 관리 예약 전 준비사항", "편안한 복장, 관리 가능한 공간, 출입 방식, 희망 강도, 피해야 할 부위를 준비하세요. 건식이라도 관리 전후 휴식 시간이 필요할 수 있습니다."],
      ["건식 관리 관련 자주 묻는 질문", "오일을 전혀 쓰지 않나요? 건식 관리는 일반적으로 오일 없이 안내되지만 세부 방식은 상담에서 확인합니다. 복장은 어떻게 하나요? 편안하고 움직임에 불편이 적은 복장이 좋습니다."]
    ]
  },
  {
    path: "service/before-reservation",
    title: "예약 전 확인사항",
    description: "출장마사지와 방문 관리 예약 전 확인해야 할 지역, 시간, 요금, 관리 유형, 취소·변경 기준을 안내합니다.",
    eyebrow: "Before Reservation",
    heading: "예약 전 확인사항",
    summary: "처음 이용하는 분들이 불안해하는 지역, 시간, 요금, 준비사항, 취소·변경 기준을 한 페이지에서 확인할 수 있도록 정리했습니다.",
    nav: ["기본 정보", "지역과 시간", "관리 유형", "요금 확인", "취소·변경", "FAQ"],
    sections: [
      ["예약 전 어떤 정보를 확인해야 하나요", "예약 전에는 상세 주소, 희망 시간, 관리 유형, 방문 가능 여부, 요금 범위, 건물 출입 방식, 주차 가능 여부를 확인해야 합니다. 이 정보가 정확할수록 상담 안내가 빨라집니다."],
      ["방문 가능 지역과 시간 확인", "서울, 경기, 인천 중심으로 가능 지역을 확인하며, 세부 행정구역은 지역별 찾기에서 살펴볼 수 있습니다. 같은 지역이라도 시간대와 이동 동선, 건물 조건에 따라 가능 여부가 달라질 수 있습니다."],
      ["관리 유형 선택 전 알아둘 점", "스웨디시, 아로마, 건식, 홈타이 등 관리 유형은 이름보다 컨디션과 선호도를 기준으로 선택하는 것이 좋습니다. 오일 사용 여부, 피부 민감도, 강도 선호를 미리 말해주세요."],
      ["요금과 추가 비용을 확인하는 방법", "요금은 관리 유형, 시간, 방문 지역, 이동 거리, 예약 시간대에 따라 달라질 수 있습니다. 안내된 금액은 참고 범위이며, 최종 안내는 상담 시점의 운영 조건을 기준으로 합니다."],
      ["예약 취소와 변경 기준", "시간, 주소, 코스 변경이 필요하면 가능한 빨리 알려주세요. 방문 준비나 이동이 시작된 뒤에는 조정 가능 범위가 줄어들 수 있으므로 상담 단계에서 기준을 확인하는 것이 좋습니다."],
      ["처음 이용하는 분들이 자주 묻는 질문", "처음이라면 어떤 정보를 먼저 말해야 하나요? 지역, 희망 시간, 관리 유형, 건물 출입 방식을 알려주시면 됩니다. 불법·선정적 요청은 받지 않으며, 의료 목적의 치료 효과를 보장하지 않습니다."]
    ],
    related: [
      ["예약 절차 보기", "guide/reservation/"],
      ["요금 안내 보기", "guide/price/"],
      ["서울 출장마사지 가능 지역 보기", "#panel-seoul"],
      ["경기 출장마사지 가능 지역 보기", "#panel-gyeonggi"],
      ["인천 출장마사지 가능 지역 보기", "#panel-incheon"],
      ["자주 묻는 질문 보기", "#faq"]
    ]
  }
];

const baseFor = (pagePath) => "../".repeat(pagePath.split("/").length);

const linkHref = (href, base) => {
  if (href.startsWith("#")) return `${base}${href}`;
  return `${base}${href}`;
};

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
        <p>서울 · 경기 · 인천에 집중한 합법 웰니스 방문 마사지 안내 서비스입니다.</p>
        <a class="footer-call" href="tel:${phone}">예약 문의 ${phone}</a>
      </div>
      <nav class="footer-nav" aria-label="하단 주요 메뉴">
        <div>
          <h2>서비스</h2>
          <a href="${base}service/">서비스 안내</a>
          <a href="${base}guide/">이용 방법</a>
          <a href="${base}guide/reservation/">예약 절차</a>
          <a href="${base}guide/price/">요금 안내</a>
        </div>
        <div>
          <h2>콘텐츠</h2>
          <a href="${base}magazine/">매거진</a>
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
    </footer>`;

const pageHtml = (page) => {
  const base = baseFor(page.path);
  const canonical = `${siteUrl}/${page.path}/`;
  const related = page.related ?? sharedLinks;
  const cards = page.cards ?? related.map(([label, href]) => [label, href, "예약 전 함께 확인하면 이용 흐름을 더 쉽게 이해할 수 있습니다."]);

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
  <body class="content-page service-page">
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
          <p>서비스 유형을 확인한 뒤에는 예약 흐름, 요금, 가능 지역을 함께 살펴보면 상담이 더 빠르고 정확해집니다.</p>
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

  for (const page of servicePages) {
    const dir = path.join(root, ...page.path.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), pageHtml(page));
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
