const languageButton = document.querySelector(".language-toggle");
let currentLanguage = localStorage.getItem("preferredLanguage") === "en" ? "en" : "zh";

const cvButton = document.createElement("button");
cvButton.className = "header-link cv-placeholder";
cvButton.type = "button";
cvButton.disabled = true;
cvButton.setAttribute("aria-disabled", "true");
cvButton.setAttribute("data-zh", "CV · 暂未公开");
cvButton.setAttribute("data-en", "CV · PRIVATE");
cvButton.textContent = "CV · 暂未公开";
document.querySelector(".header-actions").insertBefore(cvButton, languageButton);

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const sitePages = [
  { file: "index.html", anchor: "#home", number: "00", zh: "网站首页", en: "Home" },
  { file: "publications.html", number: "01", zh: "学术成果", en: "Work" },
  { file: "experience.html", number: "02", zh: "学术经历", en: "Experience" },
];

if (currentPage !== "index.html") {
  document.body.classList.add("detail-page");
} else {
  document.body.classList.add("home-page");
}

const mobileQuery = window.matchMedia("(max-width: 680px)");
function syncDeviceMode() {
  const device = mobileQuery.matches ? "mobile" : "desktop";
  document.documentElement.dataset.device = device;
  document.body.classList.toggle("is-mobile", device === "mobile");
}
syncDeviceMode();
mobileQuery.addEventListener("change", syncDeviceMode);

const sectionNav = document.createElement("nav");
sectionNav.className = "section-nav";
sectionNav.setAttribute("aria-label", "Section navigation");
sectionNav.innerHTML = sitePages
  .map((page) => {
    const isCurrent = page.file === currentPage;
    return `<a class="section-switch${isCurrent ? " is-current" : ""}" href="${page.file}"${isCurrent ? ' aria-current="page"' : ""}><small>${page.number}</small><span data-zh="${page.zh}" data-en="${page.en}">${page.zh}</span></a>`;
  })
  .join("");
document.querySelector(".header-actions").prepend(sectionNav);

const mascot = document.createElement("aside");
mascot.className = "mascot";
mascot.setAttribute("aria-label", "Website mascot");
mascot.innerHTML = `
  <div class="mascot-speech" data-zh="嗨，欢迎来访！" data-en="Hi, welcome!">嗨，欢迎来访！</div>
  <button class="mascot-character" type="button" aria-label="Say hi">
    <img src="图像资源/Q版形象-透明.png" alt="肖友凯的 Q 版形象" data-zh-alt="肖友凯的 Q 版形象" data-en-alt="Kyle Xiao's cartoon character" />
  </button>`;
document.body.append(mascot);
mascot.querySelector(".mascot-character").addEventListener("click", () => {
  mascot.classList.remove("is-greeting");
  requestAnimationFrame(() => mascot.classList.add("is-greeting"));
});

const breathingSpace = document.createElement("div");
breathingSpace.className = "page-breathing-space";
breathingSpace.setAttribute("aria-hidden", "true");
document.body.append(breathingSpace);

function applyScriptFonts(root = document.body) {
  const textNodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue.trim() || parent.closest("script, style, textarea, .text-zh, .text-latin")) continue;
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const parts = textNode.nodeValue.split(/([\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]+)/g).filter(Boolean);
    if (!parts.some((part) => /[\u3400-\u9fff\uf900-\ufaff]/.test(part))) {
      const span = document.createElement("span");
      span.className = "text-latin";
      span.textContent = textNode.nodeValue;
      textNode.replaceWith(span);
      return;
    }

    const fragment = document.createDocumentFragment();
    parts.forEach((part) => {
      const span = document.createElement("span");
      span.className = /[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(part) ? "text-zh" : "text-latin";
      span.textContent = part;
      fragment.append(span);
    });
    textNode.replaceWith(fragment);
  });
}

function addYearWatermarks() {
  document.querySelectorAll(".timeline-item, .publication-item, .conference-item, .year-card").forEach((item) => {
    if (item.querySelector(":scope > .year-watermark")) return;
    const source = item.dataset.year || item.querySelector(".timeline-year, .publication-year")?.textContent || "";
    const years = [...new Set(source.match(/(?:19|20)\d{2}/g) || [])];
    if (!years.length) return;

    const watermark = document.createElement("span");
    watermark.className = "year-watermark";
    watermark.setAttribute("aria-hidden", "true");
    watermark.textContent = years.join(" — ");
    item.append(watermark);
  });
}

addYearWatermarks();

function setLanguage(language) {
  currentLanguage = language;
  const languageKey = language === "zh" ? "zh" : "en";
  const htmlKey = language === "zh" ? "zhHtml" : "enHtml";
  const ariaKey = language === "zh" ? "zhAria" : "enAria";
  const altKey = language === "zh" ? "zhAlt" : "enAlt";

  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.language = language;
  document.title = document.body.dataset[`title${language === "zh" ? "Zh" : "En"}`];

  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    element.textContent = element.dataset[languageKey];
  });
  document.querySelectorAll("[data-zh-html][data-en-html]").forEach((element) => {
    element.innerHTML = element.dataset[htmlKey];
  });
  document.querySelectorAll("[data-zh-aria][data-en-aria]").forEach((element) => {
    element.setAttribute("aria-label", element.dataset[ariaKey]);
  });
  document.querySelectorAll("[data-zh-alt][data-en-alt]").forEach((element) => {
    element.alt = element.dataset[altKey];
  });

  languageButton.setAttribute("aria-label", language === "zh" ? "切换至英文" : "Switch to Chinese");
  localStorage.setItem("preferredLanguage", language);
  applyScriptFonts();
}

languageButton.addEventListener("click", () => setLanguage(currentLanguage === "zh" ? "en" : "zh"));
setLanguage(currentLanguage);

const contactButtons = document.querySelectorAll(".contact-toggle");
const contactDisplay = document.querySelector(".contact-detail-display");
if (contactButtons.length && contactDisplay) {
  const contactLabel = contactDisplay.querySelector(".contact-detail-label");
  const contactValue = contactDisplay.querySelector(".contact-detail-value");

  contactButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const wasExpanded = button.getAttribute("aria-expanded") === "true";
      contactButtons.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("is-active");
      });

      if (wasExpanded) {
        contactDisplay.hidden = true;
        return;
      }

      button.setAttribute("aria-expanded", "true");
      button.classList.add("is-active");
      contactLabel.textContent = button.dataset.contactLabel;
      contactValue.textContent = button.dataset.contactValue;
      contactValue.href = button.dataset.contactHref;
      contactDisplay.hidden = false;
    });
  });
}

document.querySelectorAll(".portal-card, .timeline-item, .publication-item, .interest-item, .conference-item").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  });
});

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
