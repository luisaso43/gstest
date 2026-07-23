/* Galino Solutions — shared behavior */
(function () {
  const STORAGE_KEY = "galino_lang";

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function applyLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    document.querySelectorAll(".acc-item.open .acc-panel").forEach((panel) => {
      panel.style.maxHeight = panel.scrollHeight + "px";
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function initLangToggle() {
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.getAttribute("data-lang")));
    });
    applyLang(getLang());
  }

  function initMobileMenu() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open"))
    );
  }

  function initAccordions() {
    document.querySelectorAll(".acc-item.open").forEach((item) => {
      const panel = item.querySelector(".acc-panel");
      if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
    });

    document.querySelectorAll(".acc-item").forEach((item) => {
      const trigger = item.querySelector(".acc-trigger");
      const panel = item.querySelector(".acc-panel");
      if (!trigger || !panel) return;
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        item.closest(".accordion").querySelectorAll(".acc-item.open").forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove("open");
            openItem.querySelector(".acc-panel").style.maxHeight = null;
          }
        });
        item.classList.toggle("open", !isOpen);
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
      });
    });
  }

  function initForms() {
    document.querySelectorAll("form[data-fake-submit]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const success = form.parentElement.querySelector(".form-success");
        if (success) success.style.display = "block";
        form.reset();
      });
    });
  }

  function initHeaderShadow() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener("scroll", () => {
      header.style.boxShadow = window.scrollY > 8 ? "0 8px 24px -12px rgba(0,0,0,.5)" : "none";
    });
  }

  function initPageTransitions() {
    requestAnimationFrame(() => {
      document.body.classList.add("page-loaded");
    });

    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      const url = new URL(link.href, window.location.href);
      const current = window.location.pathname.split("/").pop() || "index.html";
      if (url.pathname.split("/").pop() === current) return; // already on this page

      link.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || link.target === "_blank") return;
        e.preventDefault();
        document.body.classList.remove("page-loaded");
        document.body.classList.add("page-leaving");
        setTimeout(() => { window.location.href = link.href; }, 220);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLangToggle();
    initMobileMenu();
    initAccordions();
    initForms();
    initHeaderShadow();
    initPageTransitions();
  });
})();
