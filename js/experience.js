/* Experience page: tabs, an expandable timeline and the skills panel. */
(function () {
  "use strict";

  const { h, icon } = window.App;
  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);

  const tabList = $("tabs");
  const timeline = $("timeline");
  const toggleAll = $("toggle-all");

  const TABS = [
    { id: "experience", label: "Experience", items: S.experience || [] },
    { id: "education", label: "Education", items: S.education || [] },
    { id: "achievements", label: "Achievements", items: S.achievements || [] },
  ].filter((t) => t.items.length);

  let active = TABS.length ? TABS[0].id : null;

  /* ---------- Tabs ---------- */
  const tabButtons = TABS.map((t) =>
    h(
      "button",
      { class: "tab", type: "button", role: "tab", id: "tab-" + t.id, "aria-controls": "tab-panel", onclick: () => select(t.id) },
      t.label,
      h("span", { class: "tab-count" }, t.items.length)
    )
  );
  tabList.append(...tabButtons);

  // Left / right arrows move between tabs
  tabList.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === active);
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    select(TABS[next].id);
    tabButtons[next].focus();
  });

  function select(id) {
    active = id;
    tabButtons.forEach((btn, i) => {
      const on = TABS[i].id === id;
      btn.setAttribute("aria-selected", String(on));
      btn.tabIndex = on ? 0 : -1;
    });
    $("tab-panel").setAttribute("aria-labelledby", "tab-" + id);
    const tab = TABS.find((t) => t.id === id);
    timeline.replaceChildren(...tab.items.map(entry));
    // The first entry starts open so the page never looks empty
    if (timeline.firstElementChild) setOpen(timeline.firstElementChild, true);
    syncToggleAll();
  }

  /* ---------- Timeline entries ---------- */
  let uid = 0;

  function entry(item) {
    const bodyId = "tl-" + uid++;
    const hasBody = item.summary || (item.points || []).length || (item.tags || []).length;
    const li = h(
      "li",
      { class: "tl-item" },
      h(
        "div",
        { class: "tl-card" },
        h(
          "button",
          {
            class: "tl-head",
            type: "button",
            "aria-expanded": "false",
            "aria-controls": bodyId,
            onclick: () => {
              setOpen(li, !li.classList.contains("open"));
              syncToggleAll();
            },
          },
          h("span", { class: "tl-period" }, item.period),
          h("span", { class: "tl-title" }, item.title),
          h("span", { class: "tl-org" }, [item.org, item.location].filter(Boolean).join(" · ")),
          hasBody ? h("span", { class: "tl-chevron" }, icon("chevron")) : null
        ),
        h(
          "div",
          { class: "tl-body", id: bodyId, inert: true },
          h(
            "div",
            { class: "tl-body-inner" },
            h(
              "div",
              { class: "tl-content" },
              item.summary ? h("p", {}, item.summary) : null,
              (item.points || []).length ? h("ul", { class: "bullets" }, item.points.map((p) => h("li", {}, p))) : null,
              (item.tags || []).length ? h("ul", { class: "chips small" }, item.tags.map((t) => h("li", {}, t))) : null
            )
          )
        )
      )
    );
    return li;
  }

  function setOpen(li, open) {
    li.classList.toggle("open", open);
    li.querySelector(".tl-head").setAttribute("aria-expanded", String(open));
    li.querySelector(".tl-body").inert = !open;
  }

  function syncToggleAll() {
    const items = [...timeline.children];
    const allOpen = items.length > 0 && items.every((li) => li.classList.contains("open"));
    toggleAll.textContent = allOpen ? "Collapse all" : "Expand all";
    toggleAll.dataset.next = allOpen ? "close" : "open";
  }

  toggleAll.addEventListener("click", () => {
    const open = toggleAll.dataset.next !== "close";
    [...timeline.children].forEach((li) => setOpen(li, open));
    syncToggleAll();
  });

  if (active) select(active);
  else toggleAll.hidden = true;

  /* ---------- Skills ---------- */
  $("skills").append(
    ...(S.skills || []).map((group) =>
      h(
        "div",
        { class: "skill-group" },
        h("h3", {}, group.group),
        h("ul", { class: "chips" }, group.items.map((s) => h("li", {}, s)))
      )
    )
  );
})();
