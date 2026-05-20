const header = document.querySelector(".site-header");
const areaTabs = document.querySelectorAll("[data-area-tab]");
const areaPanels = document.querySelectorAll("[data-area-panel]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

areaTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.areaTab;

    areaTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    areaPanels.forEach((panel) => {
      const isActive = panel.dataset.areaPanel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});

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
