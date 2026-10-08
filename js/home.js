/* Home page: fills the hero, the page tiles, the about panel and the tools row. */
(function () {
  "use strict";

  const { h, icon, toast, countUp, fullName } = window.App;
  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);

  /* ---------- Hero text ---------- */
  const hour = new Date().getHours();
  const hello = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  $("greeting").textContent = hello + ", I'm";
  $("first-name").textContent = S.firstName || "Your";
  $("last-name").textContent = S.lastName || "Name";
  $("tagline").textContent = S.tagline || "";
  $("motto").textContent = S.motto || "";
  $("traits").append(...(S.traits || []).map((t) => h("li", {}, t)));

  /* ---------- Photo: swap the placeholder once the real file loads ---------- */
  if (S.photo) {
    const probe = new Image();
    probe.onload = () => {
      const img = $("photo");
      img.src = S.photo;
      img.style.objectPosition = S.photoPosition || "center";
      img.alt = "Portrait of " + fullName;
      img.closest(".photo").classList.add("has-photo");
      $("photo-hint").hidden = true;
    };
    probe.src = S.photo;
  }

  /* ---------- Coloured link pills ---------- */
  const PILLS = ["forest", "sage", "sand", "clay", "cream"];
  $("quick-links").append(
    ...(S.links || []).slice(0, 5).map((link, i) => {
      const url = link.url;
      const external = /^https?:/i.test(url);
      return h(
        "li",
        {},
        h(
          "a",
          {
            class: "pill bg-" + PILLS[i % PILLS.length],
            href: url,
            target: external ? "_blank" : null,
            rel: external ? "noopener" : null,
          },
          h("span", {}, link.label),
          icon("arrow")
        )
      );
    })
  );

  /* ---------- Copy email ---------- */
  const copyBtn = $("copy-email");
  if (!S.email) {
    copyBtn.hidden = true;
  } else {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(S.email);
      } catch (e) {
        // Older browsers, or the clipboard is blocked
        const box = h("textarea", { style: "position:fixed;opacity:0" }, S.email);
        document.body.append(box);
        box.select();
        document.execCommand("copy");
        box.remove();
      }
      toast("Copied " + S.email);
    });
  }

  /* ---------- Page tiles ---------- */
  const projects = S.projects || [];
  const timeline = (S.experience || []).length + (S.education || []).length + (S.achievements || []).length;

  const tiles = [
    {
      no: "02",
      href: "projects.html",
      color: "forest",
      title: "Projects",
      meta: projects.length + (projects.length === 1 ? " project" : " projects"),
      text: "Things I have built, with the story behind each one.",
    },
    {
      no: "03",
      href: "experience.html",
      color: "sage",
      title: "Experience",
      meta: timeline + (timeline === 1 ? " entry" : " entries"),
      text: "Work, education and skills on one timeline.",
    },
  ];

  $("tiles").append(
    ...tiles.map((t) =>
      h(
        "a",
        { class: "tile reveal", href: t.href },
        h(
          "div",
          { class: "tile-block bg-" + t.color },
          h("span", { class: "tile-num" }, t.no),
          h("span", { class: "tile-arrow" }, icon("arrow")),
          h("div", {}, h("div", { class: "tile-title" }, t.title), h("div", { class: "tile-meta" }, t.meta))
        ),
        h("p", { class: "tile-caption" }, t.text)
      )
    )
  );

  /* ---------- About + numbers ---------- */
  $("about").append(...(S.about || []).map((p) => h("p", {}, p)));

  const skillCount = (S.skills || []).reduce((n, group) => n + group.items.length, 0);
  const languages = (S.skills || []).find((group) => /language/i.test(group.group));
  // Counted from data.js; empty ones are skipped and the first four are shown
  const facts = [
    { label: "Projects", value: projects.length },
    { label: "Languages", value: languages ? languages.items.length : 0 },
    { label: "Skills & tools", value: skillCount },
    { label: "Roles", value: (S.experience || []).length },
    { label: "Achievements", value: (S.achievements || []).length },
  ]
    .filter((f) => f.value > 0)
    .slice(0, 4);
  const factNodes = facts.map((f) => {
    const dd = h("dd", {}, f.value);
    return { f, dd, node: h("div", { class: "fact" }, h("dt", {}, f.label), dd) };
  });
  $("facts").append(...factNodes.map((x) => x.node));

  // Start counting when the numbers scroll into view
  const startCounting = () => factNodes.forEach(({ f, dd }) => countUp(dd, f.value));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        startCounting();
      }
    });
    io.observe($("facts"));
  } else {
    startCounting();
  }

  /* ---------- Tools: the first three of each group (full list is on the Experience page) ---------- */
  $("tools").append(
    ...(S.skills || []).flatMap((group) =>
      group.items.slice(0, 3).map((item) => h("li", { class: "tool" }, h("strong", {}, item), h("span", {}, group.group)))
    )
  );
})();
