/* Shared by every page: navigation, footer, theme switch, keyboard
   shortcuts and a few small helpers the page scripts reuse. */
(function () {
  "use strict";

  const SITE = window.SITE || {};
  const root = document.documentElement;
  const page = document.body.dataset.page;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PAGES = [
    { id: "home", href: "index.html", label: "Home" },
    { id: "projects", href: "projects.html", label: "Projects" },
    { id: "experience", href: "experience.html", label: "Experience" },
  ];

  const ICONS = {
    sun: '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  const fullName = [SITE.firstName, SITE.lastName].filter(Boolean).join(" ") || "My site";

  /* Build an element: h("a", { class: "btn", href: "#" }, "Text", child) */
  function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "html") node.innerHTML = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat()) {
      if (child == null || child === false) continue;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    }
    return node;
  }

  function icon(name) {
    return h("span", { class: "icon", "aria-hidden": "true", html: ICONS[name] });
  }

  /* ---------- Theme ---------- */
  function toggleTheme() {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* private mode: the choice just won't be remembered */
    }
  }

  /* ---------- Navigation + footer ---------- */
  function renderNav() {
    const host = document.getElementById("site-nav");
    if (!host) return;
    host.className = "nav";

    const links = h(
      "nav",
      { class: "nav-links", id: "nav-links", "aria-label": "Main" },
      PAGES.map((p) => h("a", { href: p.href, "aria-current": p.id === page ? "page" : null }, p.label))
    );

    const menuBtn = h("button", {
      class: "icon-btn nav-toggle",
      type: "button",
      "aria-label": "Menu",
      "aria-expanded": "false",
      "aria-controls": "nav-links",
      html: ICONS.menu,
    });
    menuBtn.addEventListener("click", () => {
      const open = host.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    const themeBtn = h("button", {
      class: "icon-btn theme-toggle",
      type: "button",
      "aria-label": "Switch between light and dark theme",
      title: "Light / dark (T)",
      html: ICONS.sun + ICONS.moon,
      onclick: toggleTheme,
    });

    host.append(
      h(
        "div",
        { class: "container nav-inner" },
        h(
          "a",
          { class: "brand", href: "index.html" },
          h("span", { class: "brand-mark", "aria-hidden": "true" }, (SITE.firstName || "M").charAt(0).toUpperCase()),
          h("span", { class: "brand-name" }, fullName)
        ),
        links,
        themeBtn,
        menuBtn
      )
    );
  }

  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.className = "footer";
    host.append(
      h(
        "div",
        { class: "container footer-inner" },
        h("p", {}, "© " + new Date().getFullYear() + " " + fullName),
        h(
          "p",
          { class: "footer-keys" },
          "Press ",
          h("kbd", {}, "1"),
          "–",
          h("kbd", {}, PAGES.length),
          " to switch pages, ",
          h("kbd", {}, "T"),
          " for light / dark"
        )
      )
    );
  }

  /* ---------- Keyboard shortcuts ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (document.querySelector("dialog[open]")) return;

    const target = /^[1-9]$/.test(e.key) ? PAGES[Number(e.key) - 1] : null;
    if (target) {
      if (target.id !== page) location.href = target.href;
    } else if (e.key === "t" || e.key === "T") {
      toggleTheme();
    }
  });

  /* ---------- Small helpers ---------- */
  function setupReveal(scope) {
    const items = (scope || document).querySelectorAll(".reveal:not(.in)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach((n) => io.observe(n));
  }

  let toastTimer;
  function toast(message) {
    let node = document.getElementById("toast");
    if (!node) {
      node = h("div", { id: "toast", class: "toast", role: "status", "aria-live": "polite" });
      document.body.append(node);
    }
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2400);
  }

  /* Count a number up from zero. Shows "—" when there is no number. */
  function countUp(node, to) {
    if (typeof to !== "number" || !isFinite(to)) {
      node.textContent = "—";
      return;
    }
    if (reduceMotion || document.hidden || to === 0) {
      node.textContent = String(to);
      return;
    }
    const duration = 700;
    const start = performance.now();
    node.textContent = "0";
    requestAnimationFrame(function tick(now) {
      const k = Math.min(1, (now - start) / duration);
      node.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(tick);
    });
    setTimeout(() => {
      node.textContent = String(to);
    }, duration + 200);
  }

  const current = PAGES.find((p) => p.id === page);
  document.title = (current ? current.label + " — " : "") + fullName;

  window.App = { h, icon, toast, countUp, setupReveal, fullName, PAGES };

  renderNav();
  renderFooter();
  // Page scripts load after this file and add their own content first.
  window.addEventListener("DOMContentLoaded", () => setupReveal());
})();
