const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const clean = (value, max = 500) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const getChatIds = (env) => {
  const fromList = clean(env.TELEGRAM_CHAT_IDS, 300)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return [...new Set([env.TELEGRAM_CHAT_ID_1, env.TELEGRAM_CHAT_ID_2, ...fromList].filter(Boolean))];
};

export async function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestPost({ request, env }) {
  const token = clean(env.TELEGRAM_BOT_TOKEN, 120);
  const chatIds = getChatIds(env);

  if (!token || chatIds.length === 0) {
    return json({ ok: false, message: "전송 설정이 아직 완료되지 않았습니다." }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "요청 형식이 올바르지 않습니다." }, 400);
  }

  if (clean(payload.company, 80)) {
    return json({ ok: true, message: "접수되었습니다." });
  }

  const name = clean(payload.name, 40);
  const phone = clean(payload.phone, 40);
  const area = clean(payload.area, 80);
  const message = clean(payload.message, 1200);

  if (!name || !phone || !area || !message) {
    return json({ ok: false, message: "필수 항목을 모두 입력해 주세요." }, 400);
  }

  if (!/^[0-9+\-\s().]{8,20}$/.test(phone)) {
    return json({ ok: false, message: "전화번호 형식을 다시 확인해 주세요." }, 400);
  }

  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const text = [
    "[간다GO 제휴 문의]",
    `성명: ${name}`,
    `전화번호: ${phone}`,
    `광고지역: ${area}`,
    "",
    "전달 메시지:",
    message,
    "",
    `접수 IP: ${ip}`,
  ].join("\n");

  const results = await Promise.allSettled(
    chatIds.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text,
          disable_web_page_preview: true,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response.json();
      }),
    ),
  );

  const failed = results.filter((item) => item.status === "rejected");
  if (failed.length === results.length) {
    return json({ ok: false, message: "텔레그램 전송에 실패했습니다." }, 502);
  }

  return json({ ok: true, message: "제휴 문의가 전송되었습니다." });
}

export async function onRequestGet() {
  return json({ ok: false, message: "허용되지 않은 요청입니다." }, 405);
}
