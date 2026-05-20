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
