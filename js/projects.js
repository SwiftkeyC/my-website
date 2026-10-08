/* Projects page: cards, topic filter, search and the details pop-up. */
(function () {
  "use strict";

  const { h, icon } = window.App;
  const projects = (window.SITE && window.SITE.projects) || [];
  const COLORS = ["forest", "sage", "sand", "clay"];
  const $ = (id) => document.getElementById(id);

  const grid = $("project-grid");
  const filters = $("filters");
  const search = $("search");
  const count = $("count");
  const empty = $("empty");
  const modal = $("project-modal");

  let activeTag = "All";
  let query = "";

  /* ---------- Filter buttons, built from the tags in data.js ---------- */
  const tags = ["All", ...new Set(projects.flatMap((p) => p.tags || []))];
  const tagButtons = tags.map((tag) =>
    h(
      "button",
      {
        class: "chip-btn",
        type: "button",
        "aria-pressed": String(tag === activeTag),
        onclick: () => {
          activeTag = tag;
          update();
        },
      },
      tag
    )
  );
  filters.append(...tagButtons);

  /* ---------- Cards ---------- */
  const number = (i) => String(i + 1).padStart(2, "0");

  const cards = projects.map((p, i) => {
    const color = COLORS[i % COLORS.length];
    const node = h(
      "article",
      { class: "project-card reveal" },
      h(
        "div",
        { class: "project-cover bg-" + color },
        h("span", { class: "project-no" }, number(i)),
        p.year ? h("span", { class: "project-year" }, p.year) : null
      ),
      h(
        "div",
        { class: "project-body" },
        h("h3", {}, h("button", { class: "card-open", type: "button", onclick: () => openModal(p, color, i) }, p.title)),
        h("p", {}, p.summary),
        h("ul", { class: "chips small" }, (p.tags || []).map((t) => h("li", {}, t))),
        h("span", { class: "more", "aria-hidden": "true" }, "View details", icon("arrow"))
      )
    );
    return { p, node };
  });
  grid.append(...cards.map((c) => c.node));

  /* ---------- Filtering ---------- */
  function matches(p) {
    if (activeTag !== "All" && !(p.tags || []).includes(activeTag)) return false;
    if (!query) return true;
    const text = [p.title, p.summary, p.description, p.role, p.year, ...(p.tags || []), ...(p.stack || [])]
      .join(" ")
      .toLowerCase();
    return text.includes(query);
  }

  function update() {
    tagButtons.forEach((btn, i) => btn.setAttribute("aria-pressed", String(tags[i] === activeTag)));
    let shown = 0;
    cards.forEach(({ p, node }) => {
      const ok = matches(p);
      node.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent =
      shown === projects.length
        ? shown + (shown === 1 ? " project" : " projects")
        : "Showing " + shown + " of " + projects.length;
    empty.hidden = shown > 0;
  }

  search.addEventListener("input", () => {
    query = search.value.trim().toLowerCase();
    update();
  });

  $("reset").addEventListener("click", () => {
    activeTag = "All";
    query = "";
    search.value = "";
    update();
  });

  /* ---------- Details pop-up ---------- */
  function openModal(p, color, i) {
    const links = (p.links || []).filter((l) => l && l.url);
    const chips = (p.stack || []).length ? p.stack : p.tags || [];
    modal.replaceChildren(
      h("div", { class: "modal-cover bg-" + color }, number(i)),
      h(
        "button",
        { class: "icon-btn modal-close", type: "button", "aria-label": "Close", onclick: () => modal.close() },
        icon("close")
      ),
      h(
        "div",
        { class: "modal-body" },
        h("h2", { id: "modal-title" }, p.title),
        h("p", { class: "muted" }, [p.year, p.role].filter(Boolean).join(" · ")),
        h("p", {}, p.description || p.summary),
        (p.highlights || []).length ? h("ul", { class: "bullets" }, p.highlights.map((x) => h("li", {}, x))) : null,
        chips.length ? h("ul", { class: "chips small" }, chips.map((t) => h("li", {}, t))) : null,
        links.length
          ? h(
              "div",
              { class: "modal-actions" },
              links.map((l, n) =>
                h(
                  "a",
                  { class: "btn " + (n === 0 ? "btn-primary" : "btn-ghost"), href: l.url, target: "_blank", rel: "noopener" },
                  l.label,
                  icon("arrow")
                )
              )
            )
          : null
      )
    );
    modal.showModal();
  }

  // Click on the dimmed area around the pop-up closes it
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  update();
})();
