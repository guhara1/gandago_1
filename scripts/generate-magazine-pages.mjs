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

const categories = [
  { id: "fatigue", label: "피로 관리", intro: "운전, 이동, 외출 뒤 몸 상태를 차분히 확인하는 생활형 글입니다." },
  { id: "local-life", label: "지역 생활 정보", intro: "서울·경기·인천 생활권에서 방문 가능 여부를 판단할 때 필요한 정보를 다룹니다." },
  { id: "knowledge", label: "마사지 상식", intro: "관리 유형과 강도 선택을 과장 없이 이해할 수 있도록 정리합니다." },
  { id: "before-booking", label: "예약 전 알아둘 점", intro: "요금, 주소, 운영 기준처럼 예약 전에 확인해야 할 기준을 안내합니다." },
  { id: "office-fatigue", label: "직장인 피로 회복", intro: "오래 앉아 있거나 야근이 잦은 직장인을 위한 생활 체크 글입니다." }
];

const magazineLinks = categories.map((category) => [category.label, `magazine/#cat-${category.id}`]);

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const rssDate = (date) => {
  const [year, month, day] = date.split(".").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toUTCString();
};

const articles = [
  {
    categoryId: "fatigue",
    slug: "fatigue",
    imageClass: "drive",
    title: "장시간 운전 후 몸이 무거울 때 먼저 확인할 부분",
    description: "장시간 운전 후 목, 어깨, 허리, 종아리가 무겁게 느껴질 때 확인할 생활 포인트와 방문 관리 예약 전 체크 기준을 정리했습니다.",
    date: "2026.05.20",
    readTime: "8분",
    summary: "오래 운전한 날에는 바로 강한 관리를 찾기보다 몸 상태, 이용 장소, 예약 조건을 먼저 정리하는 편이 더 안전하고 실용적입니다.",
    sections: [
      ["운전 후 피로가 한꺼번에 오는 이유", "장시간 운전은 같은 자세를 오래 유지하는 시간이 길고, 시야와 집중을 계속 사용하기 때문에 단순히 한 부위만 피곤해지는 일이 적습니다. 목과 어깨는 핸들을 잡은 상태에서 긴장하기 쉽고, 허리는 좌석 각도와 골반 위치의 영향을 받습니다.", "종아리는 움직임이 줄어들면서 무겁게 느껴질 수 있고, 손목이나 팔도 미세한 긴장을 오래 유지합니다. 운전 직후 몸이 무겁다고 해서 무조건 강한 압이 필요한 것은 아니며, 오늘 몸에 맞는 범위를 먼저 정하는 것이 중요합니다."],
      ["예약 전 몸 상태를 먼저 나누어 보기", "상담 전에 목, 어깨, 허리, 종아리 중 어디가 가장 무거운지와 피해야 할 부위를 정리해 두면 좋습니다. 최근 다친 곳, 예민한 부위, 갑작스러운 저림이나 붓기가 있다면 방문 관리보다 전문 상담을 먼저 고려해야 합니다.", "도착 직후보다 물을 마시고 짧게 쉬면서 컨디션을 다시 확인하면 선택이 차분해집니다. 숙소나 집의 출입 조건까지 함께 준비하면 예약 상담도 더 명확해집니다."],
      ["강한 관리보다 중요한 상담 기준", "피로가 쌓인 날에는 무리한 강도보다 컨디션에 맞춘 조절이 더 중요합니다. 처음부터 높은 강도를 요청하기보다 불편하지 않은 범위에서 조절 가능한지 확인하는 것이 좋습니다.", "아로마, 건식, 홈타이, 스웨디시 같은 이름보다 오일 사용 여부, 복장, 관리 흐름, 희망 시간처럼 실제 이용에 영향을 주는 기준을 먼저 살피는 편이 안전합니다."]
    ],
    checklist: ["최근 통증, 저림, 붓기 여부 확인", "공동현관, 주차, 엘리베이터 조건 준비", "희망 시간과 관리 유형을 함께 전달", "최종 요금과 방문 가능 여부를 예약 확정 전 재확인"],
    faqs: [["운전 직후 바로 이용해도 되나요?", "평소와 다른 통증이 없다면 상담은 가능하지만, 도착 직후에는 짧게 쉬고 몸 상태를 다시 확인하는 편이 좋습니다."], ["강한 압이 더 좋은가요?", "개인차가 큽니다. 장거리 운전 뒤에는 몸이 예민할 수 있어 불편하지 않은 범위에서 조절하는 방식이 더 적합할 수 있습니다."]]
  },
  {
    categoryId: "fatigue",
    slug: "fatigue/after-work-checklist",
    imageClass: "work",
    title: "퇴근 후 몸이 무겁게 느껴질 때 예약 전 정리할 체크리스트",
    description: "퇴근 직후 방문 관리를 알아볼 때 시간, 장소, 관리 유형, 컨디션을 어떻게 정리하면 좋은지 안내합니다.",
    date: "2026.05.21",
    readTime: "7분",
    summary: "퇴근 직후에는 피로감과 일정 압박이 겹치기 쉽습니다. 예약 전에 시간 여유와 장소 조건, 몸 상태를 먼저 정리하세요.",
    sections: [
      ["퇴근 직후 피로가 크게 느껴지는 이유", "하루 종일 앉아서 일했거나 이동 시간이 길었던 날에는 어깨와 허리, 종아리가 동시에 무겁게 느껴질 수 있습니다. 업무 긴장이 끝난 뒤에야 몸의 피로가 더 또렷하게 느껴지는 경우도 많습니다.", "이때 바로 예약을 결정하기보다 귀가 시간, 식사 여부, 샤워 가능 여부, 다음 일정까지의 여유를 먼저 확인하면 무리한 선택을 줄일 수 있습니다."],
      ["예약 시간을 잡기 전에 볼 것", "퇴근 후 예약은 실제 도착 시간이 중요합니다. 예상보다 늦어질 수 있는 교통 상황, 공동현관 출입 방식, 주차 가능 여부를 함께 알려야 방문 가능 여부를 정확히 확인할 수 있습니다.", "특히 아파트 단지나 오피스텔은 경비실 확인, 엘리베이터 이용 시간, 동·호수 전달 방식이 필요할 수 있습니다. 이 정보가 정리되어 있으면 상담 시간이 짧아집니다."],
      ["관리 유형은 몸 상태에 맞게 고르기", "업무 후 몸이 무겁다고 해서 무조건 강한 관리를 고르는 것은 적절하지 않을 수 있습니다. 오래 앉아 있었던 날에는 허리와 목 주변이 예민할 수 있으므로 부드러운 흐름이나 건식 관리처럼 부담이 적은 방식을 먼저 상담해 볼 수 있습니다.", "오일 사용이 부담스러운지, 옷을 갈아입기 어려운지, 짧은 시간보다 충분한 휴식이 필요한지처럼 실제 상황을 기준으로 고르면 선택이 더 자연스럽습니다."]
    ],
    checklist: ["귀가 예상 시간과 여유 시간 확인", "샤워와 식사 여부 정리", "건물명, 동·호수, 출입 방식 준비", "피해야 할 부위와 원하는 강도 전달"],
    faqs: [["퇴근 후 늦은 시간도 가능한가요?", "지역과 시간대, 이동 조건에 따라 달라질 수 있어 상담 단계에서 가능 여부를 확인해야 합니다."], ["식사 직후 이용해도 되나요?", "개인차가 있으므로 바로 이용하기보다 잠시 여유를 두고 몸 상태를 확인하는 편이 좋습니다."]]
  },
  {
    categoryId: "fatigue",
    slug: "fatigue/weekend-condition-check",
    imageClass: "desk",
    title: "주말 일정 전 몸이 무거울 때 컨디션을 점검하는 방법",
    description: "주말 약속이나 가족 일정 전에 몸이 무겁게 느껴질 때 방문 관리 예약보다 먼저 확인할 컨디션, 시간 여유, 장소 조건을 정리했습니다.",
    date: "2026.05.21",
    readTime: "8분",
    summary: "주말에는 일정이 몰리기 쉬워 피로를 늦게 알아차리는 경우가 많습니다. 예약 전 컨디션, 이동 동선, 시간 여유를 먼저 나누어 보세요.",
    sections: [
      ["주말 피로는 평일 피로와 다르게 느껴질 수 있습니다", "평일에는 업무에 집중하느라 몸의 무거움을 지나치다가 주말 아침이나 외출 직전에 피로가 크게 느껴지는 경우가 있습니다. 늦잠, 불규칙한 식사, 전날 음주, 장거리 이동 계획이 겹치면 목과 허리, 다리가 한꺼번에 무겁게 느껴질 수 있습니다.", "이럴 때는 바로 예약을 잡기보다 오늘 일정이 얼마나 빡빡한지, 충분히 쉬는 시간이 있는지, 몸 상태가 평소와 다른지부터 확인하는 편이 좋습니다. 방문 관리는 일정 사이에 억지로 끼워 넣는 것보다 여유 있는 시간 안에서 상담하는 것이 더 자연스럽습니다."],
      ["외출 전과 귀가 후의 선택 기준", "주말 일정 전에 이용하려면 준비 시간이 충분해야 합니다. 샤워, 복장, 공간 정리, 출입 안내까지 여유가 없다면 일정 전 이용은 부담이 될 수 있습니다. 반대로 귀가 후라면 피로는 더 분명해질 수 있지만, 늦은 시간에는 지역과 이동 조건을 더 꼼꼼히 확인해야 합니다.", "특히 가족과 함께 거주하거나 숙소를 이용하는 경우에는 이용 공간이 조용하고 정리되어 있는지, 방문 동선이 다른 사람에게 불편을 주지 않는지 확인해야 합니다. 이런 부분은 서비스 품질보다 기본적인 이용 환경에 가까운 요소입니다."],
      ["컨디션을 말로 정리하는 방법", "상담할 때는 단순히 피곤하다고 말하기보다 어떤 일정 뒤에 어느 부위가 무거운지 설명하면 좋습니다. 예를 들어 장시간 운전 후 종아리가 무겁다거나, 외출 전 목과 어깨가 뻐근하다는 식으로 말하면 관리 유형과 강도 상담이 더 구체적입니다.", "주말에는 예약 문의가 특정 시간대에 몰릴 수 있으므로 희망 시간 하나만 고집하기보다 가능한 시간대를 두세 개 준비하는 편이 좋습니다. 최종 가능 여부와 요금은 예약 확정 전에 다시 확인해야 합니다."]
    ],
    checklist: ["오늘 일정과 휴식 가능 시간 확인", "전날 음주나 수면 부족 여부 점검", "외출 전인지 귀가 후인지 결정", "가능한 시간대를 2개 이상 준비"],
    faqs: [["주말에는 예약이 더 어려운가요?", "지역과 시간대에 따라 문의가 몰릴 수 있습니다. 가능한 시간대를 넓게 잡고 상담하는 편이 좋습니다."], ["외출 직전에 이용해도 괜찮나요?", "준비 시간이 부족하면 만족도가 떨어질 수 있습니다. 샤워, 공간 정리, 이동 여유를 먼저 확인하세요."]]
  },
  {
    categoryId: "local-life",
    slug: "local-life/late-night-areas",
    imageClass: "drive",
    title: "야근 많은 지역에서 방문 관리 시간을 확인할 때 볼 부분",
    description: "강남, 분당, 송도처럼 늦은 일정이 잦은 생활권에서 방문 가능 시간을 확인할 때 필요한 기준을 정리했습니다.",
    date: "2026.05.21",
    readTime: "7분",
    summary: "야근 지역은 늦은 문의가 많지만 무조건 가능하다고 판단하면 안 됩니다. 주소, 이동 거리, 건물 출입 조건을 함께 확인해야 합니다.",
    sections: [
      ["야근 생활권은 시간이 더 중요합니다", "강남, 여의도, 판교, 분당, 송도처럼 늦은 일정이 잦은 지역은 퇴근 시간이 일정하지 않은 경우가 많습니다. 방문 관리 예약을 고려할 때는 지역명보다 실제 도착 가능 시간과 건물 출입 조건이 더 중요합니다.", "같은 지역 안에서도 교통 흐름, 주차 가능 여부, 공동현관 호출 방식에 따라 방문 가능 여부가 달라질 수 있습니다. 상담에서는 행정구나 동 이름만 말하기보다 상세 주소 기준으로 확인하는 것이 좋습니다."],
      ["늦은 시간 예약 전 확인할 조건", "야간에는 엘리베이터 이용 제한, 경비실 확인, 주차 위치, 호출 방식이 낮 시간보다 더 중요해질 수 있습니다. 특히 숙소나 오피스텔은 출입 방식이 복잡하면 도착 시간이 늦어질 수 있습니다.", "예약 가능 시간은 고정된 문구로 판단하기보다 상담 시점의 이동 조건과 실제 운영 상황을 기준으로 확인해야 합니다. 무리하게 시간을 당기기보다 여유 있는 시간을 제안하는 편이 좋습니다."],
      ["지역 정보를 과하게 반복하지 않는 이유", "지역명은 예약 가능 여부를 확인하는 출발점일 뿐입니다. 같은 서울이나 경기, 인천이라도 세부 주소와 시간대에 따라 이동 조건은 달라집니다.", "따라서 매거진에서는 특정 지역명을 반복하기보다 방문 가능 여부를 판단하는 기준을 설명하고, 상세 행정구역은 지역별 찾기 페이지에서 확인하도록 안내합니다."]
    ],
    checklist: ["실제 도착 가능한 시간 정리", "공동현관과 경비실 확인 방식 준비", "주차 위치 또는 정차 가능 여부 확인", "최종 가능 시간은 상담 단계에서 재확인"],
    faqs: [["야근 후 당일 문의도 가능한가요?", "상담은 가능하지만 지역, 시간, 이동 조건에 따라 실제 방문 가능 여부가 달라질 수 있습니다."], ["지역명만 말해도 되나요?", "정확한 확인을 위해 동·건물명, 출입 방식, 주차 조건을 함께 전달하는 것이 좋습니다."]]
  },
  {
    categoryId: "local-life",
    slug: "local-life/apartment-access",
    imageClass: "desk",
    title: "아파트와 오피스텔 방문 예약 전 출입 정보를 정리하는 방법",
    description: "아파트, 오피스텔, 숙소에서 방문 관리를 예약하기 전 공동현관, 주차, 엘리베이터 정보를 정리하는 방법입니다.",
    date: "2026.05.21",
    readTime: "6분",
    summary: "방문 가능 여부는 주소만으로 결정되지 않습니다. 공동현관, 주차, 엘리베이터 같은 생활 정보가 상담 품질을 좌우합니다.",
    sections: [
      ["주소보다 출입 조건이 중요한 순간", "아파트나 오피스텔은 같은 동네라도 건물 구조와 출입 방식이 다릅니다. 공동현관 호출이 필요한지, 경비실 확인이 있는지, 방문 차량 주차가 가능한지에 따라 실제 방문 가능 여부가 달라질 수 있습니다.", "예약 상담에서 상세 주소만 전달하고 출입 방식을 빼면 현장 도착 후 시간이 지연될 수 있습니다. 처음 문의할 때부터 필요한 정보를 정리하는 편이 좋습니다."],
      ["주차와 엘리베이터는 미리 확인하기", "늦은 시간이나 주말에는 주차 공간이 부족하거나 엘리베이터 이용이 혼잡할 수 있습니다. 방문 관리가 가능한지 확인하려면 주차 가능 여부와 이동 동선을 함께 알려야 합니다.", "숙소의 경우 프런트 확인이나 건물 출입 카드가 필요한 경우도 있습니다. 이런 조건은 서비스 품질보다 기본적인 방문 가능성에 영향을 주는 요소입니다."],
      ["개인정보는 필요한 범위에서만 전달", "예약 상담에는 방문 가능 여부 확인에 필요한 정보만 전달하면 됩니다. 불필요한 개인정보를 과하게 공유하기보다 주소, 시간, 출입 방식, 연락 가능한 번호처럼 운영에 필요한 항목을 중심으로 정리하는 것이 좋습니다.", "간다GO는 예약 판단에 필요한 기준을 안내하며, 개인정보와 예약 정보는 필요한 범위에서 관리하는 것을 원칙으로 합니다."]
    ],
    checklist: ["공동현관 호출 방식 확인", "방문 차량 주차 가능 여부 확인", "엘리베이터 이용 시간과 동선 확인", "숙소라면 프런트 출입 기준 확인"],
    faqs: [["공동현관 비밀번호를 꼭 알려야 하나요?", "건물마다 방식이 다르므로 호출, 경비실 확인 등 가능한 출입 방식을 상담에서 정리하면 됩니다."], ["주차가 어려우면 예약이 불가능한가요?", "지역과 상황에 따라 다르므로 정차 가능 위치나 대체 이동 조건을 상담 단계에서 확인해야 합니다."]]
  },
  {
    categoryId: "knowledge",
    slug: "knowledge/aroma-dry-difference",
    imageClass: "work",
    title: "아로마 관리와 건식 관리의 차이를 고를 때 확인할 부분",
    description: "아로마 관리와 건식 관리를 선택할 때 오일, 복장, 피부 민감도, 이용 장소를 기준으로 확인할 점을 정리했습니다.",
    date: "2026.05.21",
    readTime: "7분",
    summary: "관리 이름보다 실제 진행 방식이 중요합니다. 오일 사용 여부와 복장, 피부 민감도, 장소 준비를 기준으로 선택하세요.",
    sections: [
      ["아로마와 건식은 준비가 다릅니다", "아로마 관리는 오일을 사용하는 방식이므로 피부 민감도, 샤워 가능 여부, 수건 준비 여부를 먼저 확인하는 편이 좋습니다. 향이나 오일에 민감한 사람은 예약 전에 반드시 상담해야 합니다.", "건식 관리는 오일 없이 진행되는 방식으로, 복장과 공간만 비교적 간단히 준비하면 되는 경우가 많습니다. 다만 몸 상태나 원하는 강도에 따라 적합성이 달라질 수 있습니다."],
      ["어떤 상황에 어떤 방식이 맞을까요", "퇴근 직후 옷을 갈아입기 어렵거나 오일 사용이 부담스럽다면 건식 관리가 더 편하게 느껴질 수 있습니다. 반대로 부드러운 흐름과 편안한 분위기를 원하고 오일 사용에 문제가 없다면 아로마 관리를 상담해 볼 수 있습니다.", "중요한 것은 특정 방식이 더 좋다고 단정하지 않는 것입니다. 이용자의 컨디션, 장소, 시간 여유, 피부 상태에 맞춰 선택해야 합니다."],
      ["예약 전 말해야 할 정보", "피부가 민감하거나 특정 향에 불편함이 있다면 상담 단계에서 먼저 알려야 합니다. 최근 피부 트러블, 상처, 알레르기 의심이 있다면 이용을 미루거나 전문 상담을 먼저 고려하는 편이 좋습니다.", "관리 유형은 최종 요금에도 영향을 줄 수 있으므로 예약 확정 전에 시간, 유형, 추가 비용 여부를 함께 확인해야 합니다."]
    ],
    checklist: ["오일 사용 가능 여부 확인", "피부 민감도와 향 민감도 전달", "샤워 가능 여부와 수건 준비", "관리 유형별 최종 요금 확인"],
    faqs: [["아로마가 무조건 더 부드러운가요?", "일반적으로 오일을 활용해 부드러운 흐름을 기대할 수 있지만, 실제 느낌은 강도와 진행 방식에 따라 달라집니다."], ["건식은 준비물이 없나요?", "오일 준비는 적지만 편한 복장, 정리된 공간, 피해야 할 부위 정보는 필요합니다."]]
  },
  {
    categoryId: "knowledge",
    slug: "knowledge/pressure-level",
    imageClass: "desk",
    title: "마사지 강도는 세게보다 맞게 조절하는 것이 중요한 이유",
    description: "방문 관리에서 강도를 선택할 때 무조건 강한 압보다 컨디션에 맞춘 조절이 중요한 이유를 설명합니다.",
    date: "2026.05.21",
    readTime: "6분",
    summary: "강한 압이 항상 좋은 선택은 아닙니다. 몸 상태, 피해야 할 부위, 이용 목적을 기준으로 강도를 조절해야 합니다.",
    sections: [
      ["강한 압이 늘 정답은 아닙니다", "몸이 무겁거나 뭉친 느낌이 들면 강한 압을 원하기 쉽습니다. 하지만 피로가 깊거나 수면이 부족한 날에는 몸이 예민해져 강한 자극이 부담스럽게 느껴질 수 있습니다.", "방문 관리는 편안한 휴식과 피로 완화를 목적으로 상담받는 서비스입니다. 통증을 참고 견디는 방식보다 불편하면 바로 조절할 수 있는 소통이 중요합니다."],
      ["강도 선택 전에 말해야 할 것", "피해야 할 부위, 최근 다친 곳, 예민하게 느껴지는 부위를 먼저 말해야 합니다. 목, 허리, 종아리처럼 자주 불편한 부위도 사람마다 적합한 강도가 다릅니다.", "처음 이용한다면 강하게 요청하기보다 중간 이하 강도에서 시작해 조절하는 방식이 더 안전합니다. 관리 중 불편함을 느끼면 바로 말할 수 있어야 합니다."],
      ["컨디션에 맞춘 선택이 좋은 이유", "같은 관리 유형이라도 이용자의 피로도, 수면 상태, 업무 강도, 이동 시간에 따라 적합한 강도는 달라집니다. 그래서 상담에서는 관리 이름보다 오늘의 몸 상태를 설명하는 것이 더 도움이 됩니다.", "요금과 시간도 함께 확인해야 합니다. 짧은 시간에 무리한 강도를 요구하기보다 충분한 시간 안에서 편안한 흐름을 선택하는 편이 만족도가 높을 수 있습니다."]
    ],
    checklist: ["피해야 할 부위 먼저 전달", "처음 이용 시 낮은 강도에서 시작", "관리 중 불편하면 바로 조절 요청", "통증이 심하면 이용보다 전문 상담 우선"],
    faqs: [["세게 받을수록 효과가 좋은가요?", "그렇게 단정할 수 없습니다. 컨디션에 맞지 않는 강도는 오히려 불편할 수 있어 조절이 중요합니다."], ["관리 중 강도를 바꿀 수 있나요?", "상담과 진행 방식에 따라 다르지만, 불편함은 즉시 말하고 조절 가능 여부를 확인하는 것이 좋습니다."]]
  },
  {
    categoryId: "before-booking",
    slug: "before-booking/check-business-info",
    imageClass: "drive",
    title: "출장마사지 예약 전 업체 정보를 확인해야 하는 이유",
    description: "출장마사지 예약 전 사업자 정보, 연락처, 정책, 요금 안내를 확인해야 하는 이유를 정리했습니다.",
    date: "2026.05.21",
    readTime: "7분",
    summary: "예약 전 업체 정보 확인은 신뢰의 기본입니다. 연락처, 사업자 정보, 운영 정책, 요금 기준을 함께 살펴보세요.",
    sections: [
      ["업체 정보는 왜 중요할까요", "출장형 방문 관리는 이용자가 직접 매장에 방문하는 방식이 아니기 때문에 사이트의 기본 정보가 더 중요합니다. 회사명, 대표자, 사업자등록번호, 주소, 연락처가 명확한지 확인해야 합니다.", "정보가 부족하거나 요금과 운영 기준이 불분명하면 예약 전후 오해가 생기기 쉽습니다. 신뢰할 수 있는 안내는 화려한 문구보다 확인 가능한 기본 정보에서 시작됩니다."],
      ["정책 페이지가 필요한 이유", "개인정보처리방침, 이용약관, 환불·취소 기준, 편집 정책은 단순한 형식이 아닙니다. 이용자가 어떤 기준으로 상담받고, 어떤 정보가 관리되는지 알 수 있는 최소한의 장치입니다.", "특히 처음 이용하는 사람은 가격보다 안전과 기준을 먼저 확인하는 경우가 많습니다. 명확한 정책은 사이트가 단순 홍보 페이지가 아니라 운영 기준이 있는 서비스임을 보여줍니다."],
      ["상담 전 확인할 질문", "요금이 얼마인지뿐 아니라 어떤 기준으로 달라지는지, 방문 가능 지역이 어디까지인지, 취소나 변경은 어떻게 처리되는지 물어보는 것이 좋습니다.", "무리한 표현이나 불분명한 약속보다 확인 가능한 기준을 안내하는 곳을 선택해야 합니다. 간다GO는 합법 웰니스 방문 관리 안내를 원칙으로 운영합니다."]
    ],
    checklist: ["회사명, 대표자, 사업자 정보 확인", "연락 가능한 전화번호 확인", "개인정보와 취소 기준 확인", "요금과 방문 가능 지역 기준 확인"],
    faqs: [["사업자 정보가 꼭 필요한가요?", "방문형 서비스에서는 신뢰 판단에 중요한 기본 정보입니다. 사이트 하단과 회사 소개 페이지를 함께 확인하는 것이 좋습니다."], ["정책 페이지를 모두 읽어야 하나요?", "처음 이용하거나 예약 금액이 걱정된다면 취소·변경, 개인정보, 요금 기준은 꼭 확인하는 편이 좋습니다."]]
  },
  {
    categoryId: "before-booking",
    slug: "before-booking/final-price",
    imageClass: "work",
    title: "예약 전 최종 요금을 다시 확인해야 하는 이유",
    description: "출장마사지 예약 전 관리 유형, 시간, 지역, 심야 여부에 따라 최종 요금이 달라질 수 있는 이유를 안내합니다.",
    date: "2026.05.21",
    readTime: "6분",
    summary: "가격표만 보고 끝내지 말고 예약 확정 전 최종 금액을 다시 확인하세요. 지역, 시간, 이동 조건이 달라질 수 있습니다.",
    sections: [
      ["요금은 단일 숫자로만 판단하기 어렵습니다", "방문 관리는 관리 유형, 이용 시간, 지역, 이동 조건, 시간대에 따라 상담 기준이 달라질 수 있습니다. 그래서 가격표는 기준을 이해하기 위한 자료이고, 실제 예약 전에는 최종 금액을 다시 확인해야 합니다.", "불분명한 금액 안내는 이용자와 운영자 모두에게 부담이 됩니다. 최종 요금이 어떤 기준으로 산정되는지 설명받는 것이 중요합니다."],
      ["추가 비용이 생길 수 있는 경우", "심야 시간, 이동 거리가 긴 지역, 주차가 어려운 장소, 요청 시간이 촉박한 상황에서는 조건이 달라질 수 있습니다. 모든 경우를 동일하게 판단하면 예약 후 오해가 생길 수 있습니다.", "따라서 상담할 때는 주소, 희망 시간, 관리 유형, 이용 시간을 함께 말하고 최종 금액을 확인해야 합니다. 금액과 가능 시간을 문자나 통화로 명확히 남겨두는 것도 도움이 됩니다."],
      ["저렴함보다 투명성이 먼저입니다", "무조건 저렴하다는 표현보다 중요한 것은 비용이 왜 그렇게 안내되는지 이해할 수 있는 구조입니다. 가격 경쟁보다 투명한 기준이 장기적으로 더 안전한 선택이 됩니다.", "간다GO는 요금 페이지와 예약 절차 페이지를 함께 확인하도록 안내합니다. 처음 이용자는 특히 예약 확정 전 최종 금액과 취소·변경 기준을 함께 확인하는 편이 좋습니다."]
    ],
    checklist: ["관리 유형과 이용 시간 확인", "지역과 이동 조건 전달", "심야 또는 추가 비용 여부 확인", "예약 확정 전 최종 금액 재확인"],
    faqs: [["가격표와 실제 금액이 다를 수 있나요?", "지역, 시간, 이동 조건에 따라 달라질 수 있으므로 예약 확정 전 최종 금액을 확인해야 합니다."], ["추가 비용은 언제 확인하나요?", "상담 단계에서 주소와 희망 시간을 전달한 뒤 최종 가능 여부와 함께 확인하는 것이 좋습니다."]]
  },
  {
    categoryId: "before-booking",
    slug: "before-booking/cancel-change-notice",
    imageClass: "drive",
    title: "예약 변경과 취소를 상담 전에 확인해야 하는 이유",
    description: "출장마사지 예약 전 일정 변경, 취소 연락, 도착 시간 조율, 최종 확정 기준을 어떻게 확인하면 좋은지 안내합니다.",
    date: "2026.05.21",
    readTime: "7분",
    summary: "예약은 확정만큼 변경 기준도 중요합니다. 일정이 흔들릴 수 있다면 취소·변경 가능 시간과 연락 방법을 먼저 확인하세요.",
    sections: [
      ["방문형 서비스는 시간 조율이 핵심입니다", "방문 관리는 정해진 장소로 이동해 진행되는 방식이기 때문에 예약 시간이 흔들리면 운영자와 이용자 모두에게 영향을 줍니다. 사용자는 퇴근, 교통, 식사, 샤워, 건물 출입 상황에 따라 준비 시간이 달라질 수 있고, 운영자는 이동 동선과 다음 상담 일정을 함께 고려해야 합니다.", "따라서 예약 전에는 단순히 가능한지만 묻는 것보다 변경이 필요할 때 언제까지 연락해야 하는지, 도착 시간이 늦어지면 어떻게 처리되는지 확인하는 것이 좋습니다. 이 기준이 분명해야 예약 후 오해가 줄어듭니다."],
      ["변경 가능성을 미리 말하는 것이 좋습니다", "업무가 늦게 끝날 수 있거나 도착 시간이 불확실하다면 상담 단계에서 먼저 알려야 합니다. 확정 후 갑자기 시간을 바꾸는 것보다 처음부터 시간 변동 가능성을 공유하면 더 현실적인 안내를 받을 수 있습니다.", "특히 서울, 경기, 인천은 같은 권역 안에서도 교통 상황과 이동 거리가 다릅니다. 같은 30분 지연이라도 지역과 시간대에 따라 방문 가능 여부가 달라질 수 있으므로, 가능 시간을 너무 촘촘하게 잡지 않는 편이 안전합니다."],
      ["취소 기준은 요금만큼 중요합니다", "처음 이용하는 사람은 요금표를 먼저 보지만, 실제 만족도에는 취소와 변경 기준도 큰 영향을 줍니다. 예상치 못한 일정 변경이 생겼을 때 어느 방식으로 연락해야 하는지, 이미 출발한 뒤에는 기준이 달라지는지 확인해야 합니다.", "명확한 취소·변경 기준은 이용자를 압박하기 위한 문구가 아니라 서로의 시간을 보호하기 위한 운영 원칙입니다. 예약 확정 전 최종 요금, 가능 시간, 취소·변경 기준을 함께 확인하면 더 차분하게 결정할 수 있습니다."]
    ],
    checklist: ["일정 변동 가능성 미리 공유", "변경 연락 가능 시간 확인", "방문 출발 후 기준 확인", "최종 확정 내용은 통화나 문자로 재확인"],
    faqs: [["예약 시간을 바꿀 수 있나요?", "지역, 이동 상황, 확정 단계에 따라 달라질 수 있습니다. 변경 가능성은 상담 초기에 먼저 말하는 것이 좋습니다."], ["취소 기준은 언제 확인해야 하나요?", "예약 확정 전에 요금, 시간, 방문 가능 여부와 함께 확인해야 합니다."]]
  },
  {
    categoryId: "office-fatigue",
    slug: "office-fatigue/desk-worker-shoulder",
    imageClass: "desk",
    title: "오래 앉아 일한 날 어깨가 무거울 때 확인할 생활 포인트",
    description: "오래 앉아 일한 날 목과 어깨가 무겁게 느껴질 때 예약 전 확인할 생활 포인트를 정리했습니다.",
    date: "2026.05.21",
    readTime: "7분",
    summary: "책상 앞 시간이 길었던 날에는 목과 어깨의 긴장이 뒤늦게 느껴질 수 있습니다. 자세, 휴식, 강도 선택을 먼저 확인하세요.",
    sections: [
      ["앉아 있는 시간이 긴 날의 피로", "오래 앉아 일하면 목과 어깨가 앞으로 말리고, 허리와 골반도 한 자세에 머물기 쉽습니다. 업무 중에는 집중 때문에 불편함을 잘 느끼지 못하다가 퇴근 후에야 무거움이 크게 느껴질 수 있습니다.", "이런 날에는 강한 압을 먼저 찾기보다 물을 마시고 짧게 걷고, 오늘 특히 불편한 부위를 정리하는 것이 좋습니다."],
      ["예약 전 자세와 컨디션 확인", "목과 어깨가 무겁더라도 두통, 심한 통증, 저림, 갑작스러운 감각 이상이 있다면 방문 관리보다 전문 상담을 먼저 고려해야 합니다. 단순 피로인지 평소와 다른 증상인지 스스로 확인하는 과정이 필요합니다.", "업무 후 바로 예약한다면 샤워 가능 여부, 이용 공간, 다음 일정까지의 여유를 함께 정리해야 합니다. 여유 없는 예약은 만족도를 떨어뜨릴 수 있습니다."],
      ["직장인에게 맞는 상담 방식", "상담에서는 직업명보다 하루 동안 어떤 자세가 길었는지, 어떤 부위가 무거운지 말하는 것이 도움이 됩니다. 예를 들어 모니터 앞에 오래 앉아 있었고 목 뒤와 어깨가 무겁다고 설명하면 관리 유형과 강도 상담이 더 구체적입니다.", "처음 이용자는 강한 압보다 조절 가능한 범위를 요청하는 편이 좋습니다. 관리 중 불편함이 있으면 바로 말해야 합니다."]
    ],
    checklist: ["목·어깨·허리 중 불편한 부위 구분", "저림이나 심한 통증 여부 확인", "퇴근 후 샤워와 휴식 시간 확보", "강도는 조절 가능한 범위로 상담"],
    faqs: [["어깨가 무거우면 어떤 관리를 고르면 되나요?", "관리 유형보다 현재 컨디션, 오일 사용 여부, 원하는 강도, 이용 장소를 기준으로 상담하는 것이 좋습니다."], ["업무 직후 바로 이용해도 되나요?", "가능 여부는 지역과 시간에 따라 다르며, 몸 상태를 잠시 확인한 뒤 예약하는 편이 좋습니다."]]
  },
  {
    categoryId: "office-fatigue",
    slug: "office-fatigue/night-shift-recovery",
    imageClass: "drive",
    title: "야근 후 피로 회복을 위해 예약 전에 정리할 것",
    description: "야근 후 방문 관리를 고민할 때 수면, 식사, 이동 시간, 안전한 예약 기준을 어떻게 확인하면 좋은지 정리했습니다.",
    date: "2026.05.21",
    readTime: "7분",
    summary: "야근 후에는 피로와 졸림이 함께 올 수 있습니다. 예약보다 먼저 수면 가능 시간과 몸 상태, 이동 조건을 확인하세요.",
    sections: [
      ["야근 후에는 몸 상태 판단이 흐려질 수 있습니다", "야근을 마친 뒤에는 피곤함뿐 아니라 졸림, 집중력 저하, 식사 리듬 변화가 함께 나타날 수 있습니다. 이때 즉흥적으로 예약하면 희망 시간이나 관리 강도를 무리하게 잡을 수 있습니다.", "방문 관리를 고민한다면 먼저 물을 마시고, 식사 여부와 수면 가능 시간을 확인하세요. 다음 날 일정이 빠듯하다면 짧은 휴식이 더 우선일 수 있습니다."],
      ["늦은 시간 예약에서 중요한 기준", "야간 예약은 지역과 이동 조건의 영향을 더 많이 받습니다. 공동현관 호출, 주차 가능 여부, 엘리베이터 이용, 숙소 출입 기준을 상담 전에 준비해야 합니다.", "늦은 시간이라고 해서 무조건 가능한 것은 아닙니다. 가능 여부는 상담 시점의 운영 상황과 이동 조건을 기준으로 확인해야 합니다."],
      ["안전한 이용을 위한 말하기 방식", "야근 후에는 몸이 예민할 수 있으므로 강한 관리보다 편안한 흐름과 강도 조절 가능 여부를 먼저 물어보는 것이 좋습니다. 음주 직후나 몸 상태가 평소와 크게 다르면 이용을 미루는 편이 안전합니다.", "상담에서는 지역, 주소, 희망 시간, 피해야 할 부위, 최종 요금 확인을 한 번에 정리하는 것이 좋습니다. 이런 준비가 예약 후 오해를 줄입니다."]
    ],
    checklist: ["수면 가능 시간과 다음 일정 확인", "음주 여부와 컨디션 확인", "야간 출입 방식과 주차 조건 준비", "최종 요금과 가능 시간 재확인"],
    faqs: [["야근 후 바로 예약해도 되나요?", "몸 상태가 평소와 다르거나 졸림이 심하다면 무리하지 않는 편이 좋습니다. 상담 전 컨디션을 먼저 확인하세요."], ["야간에는 비용이 달라질 수 있나요?", "시간대와 지역, 이동 조건에 따라 달라질 수 있어 예약 확정 전 최종 금액을 확인해야 합니다."]]
  }
];

const baseFor = (pagePath) => "../".repeat(pagePath.split("/").length);
const categoryFor = (id) => categories.find((category) => category.id === id);
const pathFor = (article) => `magazine/${article.slug}/`;

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
        <div class="footer-social" aria-label="Gandago social links">
          <span>SNS</span>
          <a href="https://www.linkedin.com/in/%EB%B0%B1%ED%98%B8-%EA%B0%95-a84273261/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://medium.com/@88smartbro88" target="_blank" rel="noopener noreferrer">Medium</a>
          <a href="https://x.com/gugeulmake84173" target="_blank" rel="noopener noreferrer">X</a>
        </div>
      </div>
      <nav class="footer-nav" aria-label="하단 주요 메뉴">
        <div>
          <h2>매거진</h2>
          <a href="${base}magazine/">매거진 홈</a>
          <a href="${base}magazine/#cat-fatigue">피로 관리</a>
          <a href="${base}magazine/#cat-local-life">지역 생활 정보</a>
          <a href="${base}magazine/#cat-knowledge">마사지 상식</a>
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
        <span>&#51060;&#47700;&#51068; <a href="mailto:help@gandago.xyz">help@gandago.xyz</a></span>
        <span>주소 경기도 파주시 청석로 268</span>
      </address>
      <div class="footer-disclosure">
        <p>간다GO는 불법·성매매·선정적 서비스를 제공하거나 중개하지 않으며, 질병 진단 또는 치료 효과를 보장하지 않습니다.</p>
        <p>최종 수정일 ${updated}. 매거진은 생활 정보와 예약 전 판단을 돕는 안내 콘텐츠로 운영합니다.</p>
      </div>
    </footer>`;

const albumCard = (article, base, featured = false) => `
          <a class="magazine-album-card${featured ? " is-featured" : ""}" href="${base}${pathFor(article)}">
            <span class="magazine-thumb ${article.imageClass}" aria-hidden="true"></span>
            <span class="magazine-meta">${categoryFor(article.categoryId).label} · ${article.date} · ${article.readTime}</span>
            <strong>${article.title}</strong>
            <span>${article.summary}</span>
          </a>`;

const articleLinks = (base, current) => {
  const sameCategory = articles
    .filter((article) => article.categoryId === current.categoryId && article.slug !== current.slug)
    .slice(0, 2);
  const longtail = [
    ["guide/prepare/", "방문 관리 전 공간과 출입 조건 준비하기"],
    ["guide/price/", "서울·경기·인천 방문 관리 최종 요금 확인하기"],
    ["guide/safety/", "처음 이용 전 안전한 예약 기준 살펴보기"],
    ["#areas", "서울·경기·인천 출장마사지 가능 지역 찾기"]
  ];
  return [...sameCategory.map((article) => [pathFor(article), article.title]), ...longtail]
    .map(([href, label]) => `<a href="${base}${href}">${label}</a>`)
    .join("\n                ");
};

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
    <link rel="alternate" type="application/rss+xml" title="간다GO 매거진 RSS" href="${siteUrl}/rss.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="간다GO" />
    <meta property="og:title" content="매거진 | 간다GO" />
    <meta property="og:description" content="피로 관리, 지역 생활 정보, 마사지 상식, 예약 전 알아둘 점을 생활 정보 중심으로 정리합니다." />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/assets/gandago-thumb.jpg" />
    <meta property="og:image:secure_url" content="${siteUrl}/assets/gandago-thumb.jpg" />
    <meta property="og:image:width" content="1080" />
    <meta property="og:image:height" content="1080" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="간다GO 매거진 공유 이미지" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="매거진 | 간다GO" />
    <meta name="twitter:description" content="피로 관리, 지역 생활 정보, 마사지 상식, 예약 전 알아둘 점을 생활 정보 중심으로 정리합니다." />
    <meta name="twitter:image" content="${siteUrl}/assets/gandago-thumb.jpg" />
    <link rel="stylesheet" href="${base}styles.css" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="image_src" href="${siteUrl}/assets/gandago-thumb.jpg" />
  </head>
  <body class="content-page magazine-page">
    <a class="skip-link" href="#main">본문으로 이동</a>
${header(base)}
    <main id="main" class="content-main">
      <section class="content-hero magazine-hero">
        <p class="eyebrow">Gandago Magazine</p>
        <h1>매거진</h1>
        <p>서울·경기·인천 방문 관리를 고민하는 분들이 예약 전 스스로 판단할 수 있도록 생활 맥락, 요금 확인, 안전 기준, 관리 상식을 카테고리별로 정리합니다.</p>
      </section>

      <nav class="service-page-nav magazine-category-nav" aria-label="매거진 주제">
        ${categories.map((category) => `<a href="#cat-${category.id}">${category.label}</a>`).join("\n        ")}
      </nav>

      <section class="magazine-album" aria-labelledby="magazine-album-title">
        <div class="section-heading">
          <p class="eyebrow">Magazine Library</p>
          <h2 id="magazine-album-title">카테고리별 매거진 글</h2>
          <p>카테고리별 글을 생활 정보 중심으로 정리했습니다. 지역명 반복보다 실제 이용 전 판단에 도움이 되는 롱테일 주제를 중심으로 구성했습니다.</p>
        </div>
        ${categories.map((category) => `
        <section class="magazine-category-section" id="cat-${category.id}" aria-labelledby="title-${category.id}">
          <div class="magazine-category-head">
            <p class="eyebrow">${category.label}</p>
            <h3 id="title-${category.id}">${category.label} 글 ${articles.filter((article) => article.categoryId === category.id).length}개</h3>
            <p>${category.intro}</p>
          </div>
          <div class="magazine-album-grid compact">
${articles.filter((article) => article.categoryId === category.id).map((article, index) => albumCard(article, base, index === 0 && category.id === "fatigue")).join("\n")}
          </div>
        </section>`).join("\n")}
      </section>
    </main>
${footer(base)}
  </body>
</html>`;
};

const articleHtml = (article) => {
  const base = baseFor(pathFor(article).replace(/\/$/, ""));
  const category = categoryFor(article.categoryId);
  const canonical = `${siteUrl}/${pathFor(article)}`;
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${article.title} | 간다GO 매거진</title>
    <meta name="description" content="${article.description}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" type="application/rss+xml" title="간다GO 매거진 RSS" href="${siteUrl}/rss.xml" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="간다GO" />
    <meta property="og:title" content="${article.title} | 간다GO 매거진" />
    <meta property="og:description" content="${article.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/assets/gandago-thumb.jpg" />
    <meta property="og:image:secure_url" content="${siteUrl}/assets/gandago-thumb.jpg" />
    <meta property="og:image:width" content="1080" />
    <meta property="og:image:height" content="1080" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content="간다GO 매거진 공유 이미지" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.title} | 간다GO 매거진" />
    <meta name="twitter:description" content="${article.description}" />
    <meta name="twitter:image" content="${siteUrl}/assets/gandago-thumb.jpg" />
    <link rel="stylesheet" href="${base}styles.css" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="image_src" href="${siteUrl}/assets/gandago-thumb.jpg" />
  </head>
  <body class="content-page magazine-page">
    <a class="skip-link" href="#main">본문으로 이동</a>
${header(base)}
    <main id="main" class="content-main">
      <article class="magazine-article">
        <header class="magazine-article-hero">
          <p class="eyebrow">${category.label} · ${article.date} · ${article.readTime}</p>
          <h1>${article.title}</h1>
          <p>${article.summary}</p>
          <div class="magazine-article-meta" aria-label="글 작성 정보">
            <div><span>작성</span><strong>간다GO 콘텐츠팀</strong></div>
            <div><span>운영 검수</span><strong>김유환 · YH LAB</strong></div>
            <div><span>최종 수정</span><strong>${updated}</strong></div>
            <div><span>글의 목적</span><strong>예약 전 판단 기준</strong></div>
          </div>
        </header>

        <div class="magazine-article-layout">
          <aside class="magazine-toc" aria-label="글 목차">
            <strong>글 목차</strong>
            <a href="#summary">핵심 요약</a>
            ${article.sections.map((section, index) => `<a href="#section-${index + 1}">${section[0]}</a>`).join("\n            ")}
            <a href="#booking-example">상담 예시</a>
            <a href="#pause">이용을 미뤄야 할 경우</a>
            <a href="#area-price">지역과 요금 확인</a>
            <a href="#checklist">예약 전 체크리스트</a>
            <a href="#faq">자주 묻는 질문</a>
            <a href="#standard">함께 볼 안내</a>
          </aside>

          <div class="magazine-article-body">
            <section id="summary" class="article-lead-card">
              <p class="eyebrow">핵심 요약</p>
              <h2>${article.summary}</h2>
              <p>이 글은 ${category.label} 카테고리의 생활형 안내입니다. 방문 관리를 무조건 권하는 내용이 아니라, 이용자가 예약 전에 몸 상태와 장소 조건, 요금 기준을 차분히 확인하도록 돕는 데 목적이 있습니다.</p>
              <p>심한 통증, 갑작스러운 부상, 발열, 저림이나 붓기처럼 평소와 다른 증상이 있다면 방문 관리보다 의료 전문가 상담을 먼저 고려해야 합니다.</p>
            </section>

            ${article.sections.map((section, index) => `
            <section id="section-${index + 1}">
              <h2>${section[0]}</h2>
              <p>${section[1]}</p>
              <p>${section[2]}</p>
            </section>`).join("\n")}

            <section id="booking-example">
              <h2>상담할 때 이렇게 말하면 좋습니다</h2>
              <p>상담에서는 “${article.title}”처럼 고민하는 주제를 짧게 말한 뒤, 현재 위치와 희망 시간, 이용 장소의 출입 조건을 함께 전달하는 것이 좋습니다. 지역명만 말하면 실제 방문 가능 여부를 판단하기 어렵기 때문에 동·건물명, 공동현관 호출 방식, 주차 가능 여부를 같이 정리하는 편이 정확합니다.</p>
              <p>예를 들어 “오늘 ${category.label} 관련해서 상담하고 싶고, 주소는 ○○동입니다. ${article.checklist[0]}했고, ${article.checklist[1]}도 확인했습니다. 가능 시간과 최종 요금을 먼저 알고 싶습니다”처럼 말하면 상담자가 필요한 조건을 빠르게 확인할 수 있습니다.</p>
            </section>

            <section id="pause">
              <h2>이용을 미뤄야 할 경우도 있습니다</h2>
              <p>방문 관리는 휴식과 피로 완화를 목적으로 상담받는 서비스이며, 질병 진단이나 치료를 대신하지 않습니다. 심한 통증, 갑작스러운 부상, 발열, 붓기, 저림, 감각 이상처럼 평소와 다른 증상이 있다면 예약보다 의료 전문가 상담을 먼저 고려해야 합니다.</p>
              <p>또한 음주 직후, 과로로 몸 상태를 판단하기 어려운 날, 이용 장소가 정리되지 않아 방문 동선이 불분명한 날에는 무리해서 예약하지 않는 편이 좋습니다. 좋은 예약은 빠른 확정보다 필요한 정보를 충분히 확인한 뒤 결정하는 과정에서 시작됩니다.</p>
            </section>

            <section id="area-price">
              <h2>지역과 요금은 함께 확인하세요</h2>
              <p>${category.label} 글을 읽고 실제 예약을 고민한다면 서울, 경기, 인천 중 어느 권역인지와 세부 주소를 함께 확인해야 합니다. 같은 행정구역 안에서도 이동 거리, 주차 가능 여부, 시간대에 따라 방문 가능 조건이 달라질 수 있기 때문입니다.</p>
              <p>요금도 관리 유형과 이용 시간만으로 단정하기보다 지역, 심야 여부, 이동 조건을 함께 보고 최종 금액을 확인하는 편이 안전합니다. 이 글의 하단 내부 링크는 단순 메뉴명이 아니라 예약 전 실제로 검색하거나 확인할 만한 롱테일 주제로 연결해 두었습니다.</p>
            </section>

            <section id="checklist">
              <h2>예약 전 체크리스트</h2>
              <p>아래 항목은 상담 전에 정리하면 좋은 기본 정보입니다. 같은 지역이라도 시간대와 건물 조건에 따라 실제 방문 가능 여부가 달라질 수 있습니다.</p>
              <ul class="article-checklist">
                ${article.checklist.map((item) => `<li><strong>확인</strong><span>${item}</span></li>`).join("\n                ")}
              </ul>
            </section>

            <section id="faq" class="article-faq">
              <h2>${category.label} FAQ</h2>
              ${article.faqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("\n              ")}
            </section>

            <section id="standard" class="article-source-links">
              <h2>함께 확인하면 좋은 안내</h2>
              <p>이 글은 상담에서 반복적으로 확인되는 질문과 사이트 운영 기준을 바탕으로 정리했습니다. 아래 링크는 같은 주제를 더 구체적으로 확인할 때 도움이 됩니다.</p>
              <div>
                ${articleLinks(base, article)}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
${footer(base)}
  </body>
</html>`;
};

const rssXml = () => {
  const items = [...articles]
    .sort((a, b) => Date.parse(rssDate(b.date)) - Date.parse(rssDate(a.date)))
    .map((article) => {
      const link = `${siteUrl}/${pathFor(article)}`;
      const category = categoryFor(article.categoryId).label;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(article.description)}</description>
      <category>${escapeXml(category)}</category>
      <pubDate>${rssDate(article.date)}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>간다GO 매거진</title>
    <link>${siteUrl}/magazine/</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>서울, 경기, 인천 방문 관리 예약 전 확인할 생활 정보와 안전 기준을 정리한 간다GO 매거진입니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date(Date.UTC(2026, 4, 21, 0, 0, 0)).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
};

const main = async () => {
  const root = process.cwd();
  const pages = [["magazine", hubHtml()], ...articles.map((article) => [pathFor(article).replace(/\/$/, ""), articleHtml(article)])];

  for (const [pagePath, html] of pages) {
    const dir = path.join(root, ...pagePath.split("/"));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), html.replace(/^[ \t]+$/gm, ""));
  }

  await writeFile(path.join(root, "rss.xml"), rssXml());
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
