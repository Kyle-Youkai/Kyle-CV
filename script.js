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
const detailPages = [
  { file: "about.html", number: "01", zh: "关于", en: "About" },
  { file: "research.html", number: "02", zh: "研究", en: "Research" },
  { file: "publications.html", number: "03", zh: "成果", en: "Work" },
  { file: "experience.html", number: "04", zh: "经历", en: "Experience" },
];

if (currentPage !== "index.html") {
  document.body.classList.add("detail-page");
  const sectionNav = document.createElement("nav");
  sectionNav.className = "section-nav";
  sectionNav.setAttribute("aria-label", "Section navigation");
  sectionNav.innerHTML = detailPages
    .filter((page) => page.file !== currentPage)
    .map((page) => `<a class="section-switch" href="${page.file}"><small>${page.number}</small><span data-zh="${page.zh}" data-en="${page.en}">${page.zh}</span></a>`)
    .join("");
  document.querySelector(".header-actions").prepend(sectionNav);
}

const mascot = document.createElement("aside");
mascot.className = "mascot";
mascot.setAttribute("aria-label", "Website mascot");
mascot.innerHTML = `
  <div class="mascot-speech" data-zh="嗨，欢迎来访！" data-en="Hi, welcome!">嗨，欢迎来访！</div>
  <button class="mascot-character" type="button" aria-label="Say hi">
    <img src="Q版形象.gif" alt="肖友凯的 Q 版形象" data-zh-alt="肖友凯的 Q 版形象" data-en-alt="Kyle Xiao's cartoon character" />
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
}

languageButton.addEventListener("click", () => setLanguage(currentLanguage === "zh" ? "en" : "zh"));
setLanguage(currentLanguage);

document.querySelectorAll(".portal-card").forEach((card) => {
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
