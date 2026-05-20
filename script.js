const header = document.querySelector(".site-header");
const areaTabs = document.querySelectorAll("[data-area-tab]");
const areaPanels = document.querySelectorAll("[data-area-panel]");
const areaTargets = {
  "#panel-seoul": "seoul",
  "#panel-gyeonggi": "gyeonggi",
  "#panel-incheon": "incheon",
};

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const activateArea = (target) => {
  if (!target) return;

  areaTabs.forEach((item) => {
    const isActive = item.dataset.areaTab === target;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  areaPanels.forEach((panel) => {
    const isActive = panel.dataset.areaPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

const activateAreaFromHash = () => {
  const target = areaTargets[window.location.hash];
  if (!target) return;

  activateArea(target);
  document.querySelector("#areas")?.scrollIntoView({ block: "start" });
};

areaTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateArea(tab.dataset.areaTab);
  });
});

document.querySelectorAll('a[href^="#panel-"]').forEach((link) => {
  link.addEventListener("click", () => {
    const url = new URL(link.getAttribute("href"), window.location.href);
    const target = areaTargets[url.hash];
    if (!target) return;

    activateArea(target);
    window.requestAnimationFrame(() => {
      document.querySelector("#areas")?.scrollIntoView({ block: "start" });
    });
  });
});

activateAreaFromHash();
window.addEventListener("hashchange", activateAreaFromHash);

document.querySelectorAll(".area-subnav").forEach((nav) => {
  let isDown = false;
  let didDrag = false;
  let startX = 0;
  let startScrollLeft = 0;
  const dragThreshold = 8;

  nav.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    isDown = true;
    didDrag = false;
    startX = event.clientX;
    startScrollLeft = nav.scrollLeft;
  });

  nav.addEventListener("pointermove", (event) => {
    if (!isDown) return;

    const distance = event.clientX - startX;
    if (Math.abs(distance) <= dragThreshold && !didDrag) return;

    didDrag = true;
    nav.classList.add("is-dragging");
    nav.scrollLeft = startScrollLeft - distance;
  });

  const stopDragging = () => {
    if (!isDown) return;

    isDown = false;
    nav.classList.remove("is-dragging");
  };

  nav.addEventListener("pointerup", stopDragging);
  nav.addEventListener("pointercancel", stopDragging);
  nav.addEventListener("pointerleave", stopDragging);

  nav.addEventListener(
    "click",
    (event) => {
      if (!didDrag) return;

      event.preventDefault();
      event.stopPropagation();

      window.setTimeout(() => {
        didDrag = false;
      }, 0);
    },
    true,
  );

  nav.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (nav.scrollWidth <= nav.clientWidth) return;

      event.preventDefault();
      nav.scrollLeft += event.deltaY;
    },
    { passive: false },
  );
});
