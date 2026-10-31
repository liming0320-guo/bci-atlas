(() => {
  "use strict";

  const seed = window.BCI_SEED_DATA;
  if (!seed) {
    throw new Error("BCI Atlas seed data is missing.");
  }

  const STORAGE_KEY = "bci-atlas-personal-v1";
  const THEME_KEY = "bci-atlas-theme";
  const themes = seed.themes;
  const gaps = seed.gaps;
  const themeById = new Map(themes.map((theme) => [theme.id, theme]));
  const gapById = new Map(gaps.map((gap) => [gap.id, gap]));

  const defaultPersonal = {
    addedPapers: [],
    reading: {},
    notes: {},
    trackedGaps: {},
  };

  function loadPersonalData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultPersonal);
      const parsed = JSON.parse(raw);
      return {
        addedPapers: Array.isArray(parsed.addedPapers) ? parsed.addedPapers : [],
        reading: parsed.reading && typeof parsed.reading === "object" ? parsed.reading : {},
        notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
        trackedGaps:
          parsed.trackedGaps && typeof parsed.trackedGaps === "object"
            ? parsed.trackedGaps
            : {},
      };
    } catch {
      return structuredClone(defaultPersonal);
    }
  }

  const personal = loadPersonalData();
  const ui = {
    view: "overview",
    mapTheme: "communication",
    mapEra: "all",
    timelinePaper: null,
    timelineKind: "all",
    timelineTheme: "all",
    libraryTheme: "all",
    libraryKind: "all",
    librarySignal: "all",
    librarySort: "newest",
    libraryFavorites: false,
    libraryQuery: "",
    focusIds: null,
    focusLabel: "",
    gapCategory: "all",
    gapId: "gap-stability",
    signalStage: "record",
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let toastTimer = null;
  let noteSaveTimer = null;
  const platformState = {
    isIpad: false,
    isTouch: false,
    isStandalone: false,
    serviceWorker: "pending",
  };

  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        }[character]),
    );

  const escapeAttr = escapeHtml;

  function q(value) {
    return String(value ?? "").trim().toLocaleLowerCase("zh-CN");
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(personal));
      return true;
    } catch {
      showToast("本地存储不可用。请导出数据，或通过本地服务器打开网站。");
      return false;
    }
  }

  function allPapers() {
    const combined = [...seed.papers, ...(personal.addedPapers || [])];
    return combined.map(normalizePaper).filter((paper) => paper && paper.id);
  }

  function normalizePaper(paper) {
    if (!paper || !paper.title) return null;
    const year = Number(paper.year);
    return {
      ...paper,
      id: String(paper.id || makePaperId(paper.title, year)),
      title: String(paper.title),
      titleZh: String(paper.titleZh || paper.title),
      authors: String(paper.authors || "作者未注明"),
      venue: String(paper.venue || "来源未注明"),
      year: Number.isFinite(year) ? year : new Date().getFullYear(),
      theme: themeById.has(paper.theme) ? paper.theme : "decoding",
      signal: String(paper.signal || "Conceptual"),
      kind: ["classic", "breakthrough", "recent"].includes(paper.kind)
        ? paper.kind
        : classifyKind(year),
      impact: Math.min(5, Math.max(1, Number(paper.impact) || 3)),
      tags: Array.isArray(paper.tags)
        ? paper.tags.map(String).filter(Boolean)
        : String(paper.tags || "")
            .split(/[,，、]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
      summary: String(paper.summary || "尚待补充一句话贡献。"),
      why: String(paper.why || paper.summary || "尚待补充阅读价值。"),
      limitation: String(paper.limitation || "尚待补充研究边界。"),
      doi: String(paper.doi || "").replace(/^https?:\/\/doi\.org\//i, "").trim(),
      userAdded: Boolean(paper.userAdded),
      addedAt: paper.addedAt || null,
    };
  }

  function makePaperId(title, year) {
    const slug = q(title)
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 45);
    return `user-${slug || "paper"}-${year || "unknown"}`;
  }

  function classifyKind(year) {
    if (year < 2010) return "classic";
    if (year < 2020) return "breakthrough";
    return "recent";
  }

  function kindLabel(kind) {
    return {
      classic: "经典奠基",
      breakthrough: "方法突破",
      recent: "近期前沿",
    }[kind] || "研究文献";
  }

  function signalLabel(signal, compact = false) {
    return {
      EEG: compact ? "EEG" : "头皮 EEG",
      ECoG: compact ? "ECoG" : "皮层 ECoG",
      Intracortical: compact ? "皮层内" : "皮层内记录",
      "Non-invasive": compact ? "非侵入" : "非侵入式成像/电生理",
      Conceptual: compact ? "概念" : "概念 / 综述",
    }[signal] || signal;
  }

  function readingFor(id) {
    const current = personal.reading[id];
    return {
      status: ["unread", "want", "reading", "done"].includes(current?.status)
        ? current.status
        : "unread",
      favorite: Boolean(current?.favorite),
    };
  }

  function updateReading(id, updates) {
    personal.reading[id] = { ...readingFor(id), ...updates };
    persist();
    renderLibrary();
    renderLatest();
    if (ui.timelinePaper === id) renderTimeline();
  }

  function doiUrl(doi) {
    if (!doi) return "";
    return `https://doi.org/${encodeURI(doi)}`;
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Theme persistence is optional.
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0b1614" : "#f3efe4");
    $(".theme-trigger")?.setAttribute(
      "aria-label",
      theme === "dark" ? "切换到浅色主题" : "切换到深色主题",
    );
  }

  function initializeTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch {
      // Ignore restricted storage.
    }
    const preferredDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(saved === "dark" || saved === "light" ? saved : preferredDark ? "dark" : "light");
  }

  function initializePlatform() {
    const userAgent = navigator.userAgent || "";
    platformState.isIpad =
      /iPad/i.test(userAgent) ||
      (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
    platformState.isTouch = matchMedia?.("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
    platformState.isStandalone =
      matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;

    document.documentElement.classList.toggle("is-ipad", platformState.isIpad);
    document.documentElement.classList.toggle("is-touch", platformState.isTouch);
  }

  async function registerOfflineShell() {
    if (!("serviceWorker" in navigator)) {
      platformState.serviceWorker = "unsupported";
      return;
    }
    if (!["http:", "https:"].includes(location.protocol)) {
      platformState.serviceWorker = "file";
      return;
    }
    try {
      await navigator.serviceWorker.register("./sw.js", { scope: "./" });
      platformState.serviceWorker = "ready";
    } catch {
      platformState.serviceWorker = "failed";
    }
  }

  function openIpadGuide() {
    const status = $("#ipad-status");
    let message = "";
    let ready = false;

    if (platformState.isStandalone) {
      message = "当前已从主屏幕独立运行。个人文献与批注保存在这台 iPad 的 Safari 中。";
      ready = true;
    } else if (location.protocol === "file:") {
      message =
        "当前是电脑本地文件模式，iPad 无法直接访问 file:// 地址。请使用下方局域网地址或部署到 HTTPS。";
    } else if (location.protocol === "https:" && platformState.serviceWorker === "ready") {
      message = "当前为 HTTPS 安全连接，离线外壳已就绪。可打开 Safari 分享菜单，选择“添加到主屏幕”。";
      ready = true;
    } else if (location.protocol === "http:") {
      message =
        "当前通过普通 HTTP 打开，可以正常使用和保存批注；Safari 不会为局域网 HTTP 地址启用离线缓存。";
    } else {
      message = "离线缓存正在准备。页面完整加载后，再从 Safari 分享菜单添加到主屏幕。";
    }

    status.textContent = message;
    status.classList.toggle("is-ready", ready);
    $("#ipad-dialog").showModal();
  }

  function setView(view, options = {}) {
    const valid = ["overview", "map", "timeline", "library", "gaps"];
    if (!valid.includes(view)) view = "overview";
    ui.view = view;

    $$(".page").forEach((page) => {
      const active = page.dataset.page === view;
      page.hidden = !active;
      page.classList.toggle("is-active", active);
    });
    $$(".nav-item").forEach((item) => {
      const active = item.dataset.nav === view;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });

    if (options.updateHash !== false) {
      const hash = `#${view}`;
      if (location.hash !== hash) history.pushState({ view }, "", hash);
    }
    if (options.scroll !== false) {
      window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
    }
    if (view === "library" && options.focusSearch) {
      window.setTimeout(() => $("#library-search")?.focus(), 80);
    }
  }

  function populateStaticSelects() {
    $("#timeline-theme").insertAdjacentHTML(
      "beforeend",
      themes
        .map(
          (theme) =>
            `<option value="${escapeAttr(theme.id)}">${escapeHtml(theme.name)}</option>`,
        )
        .join(""),
    );
    $("#add-paper-theme").innerHTML = themes
      .map(
        (theme) =>
          `<option value="${escapeAttr(theme.id)}">${escapeHtml(theme.name)}</option>`,
      )
      .join("");
  }

  function renderAll() {
    renderStats();
    renderPulse();
    renderLatest();
    renderMap();
    renderTimeline();
    renderLibrary();
    renderGaps();
    renderStorageSummary();
  }

  function renderStats() {
    const papers = allPapers();
    const years = papers.map((paper) => paper.year);
    $("#stat-papers").textContent = papers.length;
    $("#stat-start").textContent = Math.min(...years);
    $("#stat-end").textContent = Math.max(...years);
    $("#stat-themes").textContent = themes.length;
    $("#stat-gaps").textContent = gaps.length;
    $("#updated-date").textContent = seed.meta.updated;
  }

  function renderPulse() {
    const papers = allPapers();
    const bins = [
      { label: "1970s", start: 1970, end: 1979 },
      { label: "1980s", start: 1980, end: 1989 },
      { label: "1990s", start: 1990, end: 1999 },
      { label: "2000s", start: 2000, end: 2009 },
      { label: "2010s", start: 2010, end: 2019 },
      { label: "2020s", start: 2020, end: 2029 },
    ].map((bin) => ({
      ...bin,
      count: papers.filter((paper) => paper.year >= bin.start && paper.year <= bin.end)
        .length,
    }));
    const max = Math.max(...bins.map((bin) => bin.count), 1);
    $("#pulse-chart").innerHTML = bins
      .map(
        (bin) => `
          <div class="pulse-column">
            <span class="pulse-value">${bin.count}</span>
            <div class="pulse-bar-track">
              <div class="pulse-bar" style="height:${Math.max(4, (bin.count / max) * 100)}%"></div>
            </div>
            <span class="pulse-label">${bin.label}</span>
          </div>
        `,
      )
      .join("");
    $("#pulse-chart").setAttribute(
      "aria-label",
      `各年代论文数量：${bins.map((bin) => `${bin.label} ${bin.count} 篇`).join("，")}`,
    );
  }

  function renderLatest() {
    const latest = allPapers()
      .slice()
      .sort((a, b) => b.year - a.year || b.impact - a.impact)
      .slice(0, 3);
    $("#latest-grid").innerHTML = latest
      .map((paper) => {
        const theme = themeById.get(paper.theme);
        const reading = readingFor(paper.id);
        return `
          <article class="latest-card" data-paper-id="${escapeAttr(paper.id)}">
            <div class="latest-card-top">
              <span>${paper.year} · ${escapeHtml(theme.short)}</span>
              <span>${reading.favorite ? "已收藏" : kindLabel(paper.kind)}</span>
            </div>
            <h3><button class="paper-open-button" type="button" data-paper-id="${escapeAttr(paper.id)}">${escapeHtml(paper.titleZh)}</button></h3>
            <p>${escapeHtml(paper.summary)}</p>
            <div class="latest-card-footer">
              <span>${escapeHtml(paper.authors)}</span>
              <span aria-hidden="true">↗</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const signalStageCopy = {
    record: {
      title: "采集阶段",
      text: "选择 EEG、ECoG、皮层内微电极或其他神经信号。空间精度、带宽、侵入性与长期稳定性在此交换。",
    },
    decode: {
      title: "解码阶段",
      text: "把节律、连接、群体放电或诱发电位映射为状态和意图。真正的困难不是拟合训练集，而是跨时间与跨个体保持可重复。",
    },
    act: {
      title: "行动阶段",
      text: "输出可以是光标、文字、合成语音、机械臂或脊髓刺激。评价应同时覆盖速度、准确率、延迟与可纠错性。",
    },
    feedback: {
      title: "反馈阶段",
      text: "使用者根据系统反馈调整神经策略，系统也可适应用户。反馈质量与学习过程决定了闭环是否真正形成。",
    },
  };

  function setSignalStage(stage) {
    ui.signalStage = stage;
    $$(".signal-stage").forEach((button) =>
      button.classList.toggle("is-active", button.dataset.stage === stage),
    );
    const copy = signalStageCopy[stage];
    $("#stage-detail").innerHTML = `<strong>${copy.title}</strong> · ${copy.text}`;
  }

  function renderMap() {
    const eraPapers = allPapers().filter((paper) => {
      if (ui.mapEra === "foundation") return paper.year < 2010;
      if (ui.mapEra === "recent") return paper.year >= 2020;
      return true;
    });
    const countByTheme = new Map(
      themes.map((theme) => [
        theme.id,
        eraPapers.filter((paper) => paper.theme === theme.id).length,
      ]),
    );
    const maxCount = Math.max(...countByTheme.values(), 1);

    $("#map-nodes").innerHTML = themes
      .map((theme) => {
        const count = countByTheme.get(theme.id);
        const size = 105 + Math.round((count / maxCount) * 33);
        return `
          <button
            class="map-node ${ui.mapTheme === theme.id ? "is-active" : ""}"
            type="button"
            data-theme-id="${escapeAttr(theme.id)}"
            style="--x:${Number(theme.x)};--y:${Number(theme.y)};--node-color:${theme.color};--node-size:${size}px"
            aria-pressed="${ui.mapTheme === theme.id}"
            aria-label="${escapeAttr(theme.name)}，${count} 篇论文"
          >
            <small>${escapeHtml(theme.code)}</small>
            <strong>${escapeHtml(theme.short)}</strong>
            <span>${count} PAPERS</span>
          </button>
        `;
      })
      .join("");

    renderMapDetail(eraPapers);
  }

  function renderMapDetail(eraPapers) {
    const theme = themeById.get(ui.mapTheme) || themes[0];
    const themePapers = eraPapers
      .filter((paper) => paper.theme === theme.id)
      .sort((a, b) => b.impact - a.impact || b.year - a.year);
    $("#map-detail").innerHTML = `
      <span class="theme-code" style="--detail-color:${theme.color}">${escapeHtml(theme.code)} / ${themePapers.length} PAPERS</span>
      <h2>${escapeHtml(theme.name)}</h2>
      <p class="map-detail-description">${escapeHtml(theme.description)}</p>
      <div class="map-question">
        <span>核心问题</span>
        <p>${escapeHtml(theme.question)}</p>
      </div>
      <div class="detail-papers">
        <span class="detail-label">当前窗口的代表文献</span>
        ${
          themePapers.length
            ? themePapers
                .slice(0, 4)
                .map(
                  (paper) => `
                    <button class="detail-paper-link" type="button" data-paper-id="${escapeAttr(paper.id)}">
                      <span>${paper.year}</span>
                      <strong>${escapeHtml(paper.titleZh)}</strong>
                      <i aria-hidden="true">↗</i>
                    </button>
                  `,
                )
                .join("")
            : `<p class="text-small">当前时间窗口没有收录文献。切换到全时段继续查看。</p>`
        }
      </div>
      <p class="map-detail-description"><strong>演化边界</strong><br>${escapeHtml(theme.boundary)}</p>
      <button class="button button-primary" type="button" data-open-theme="${escapeAttr(theme.id)}">进入该主题的文献库 <span aria-hidden="true">→</span></button>
    `;
  }

  function renderTimeline() {
    const filtered = allPapers()
      .filter(
        (paper) =>
          (ui.timelineKind === "all" || paper.kind === ui.timelineKind) &&
          (ui.timelineTheme === "all" || paper.theme === ui.timelineTheme),
      )
      .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));

    if (!filtered.some((paper) => paper.id === ui.timelinePaper)) {
      ui.timelinePaper = filtered[0]?.id || null;
    }

    if (!filtered.length) {
      $("#timeline-list").innerHTML = `
        <div class="empty-state">
          <span aria-hidden="true">∅</span>
          <h3>当前筛选没有文献</h3>
          <p>切换证据类型或主题，重新查看研究演化。</p>
        </div>
      `;
      $("#timeline-detail").innerHTML = "";
      return;
    }

    const grouped = new Map();
    filtered.forEach((paper) => {
      const decade = Math.floor(paper.year / 10) * 10;
      if (!grouped.has(decade)) grouped.set(decade, []);
      grouped.get(decade).push(paper);
    });

    $("#timeline-list").innerHTML = Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([decade, papers]) => {
        const years = papers.map((paper) => paper.year);
        const span =
          Math.min(...years) === Math.max(...years)
            ? String(Math.min(...years))
            : `${Math.min(...years)}—${Math.max(...years)}`;
        return `
          <section class="timeline-decade" aria-label="${decade} 年代">
            <div class="timeline-decade-title">
              <strong>${decade}s</strong>
              <span>${papers.length} PAPERS · ${span}</span>
            </div>
            <div class="timeline-events">
              ${papers
                .map((paper) => {
                  const theme = themeById.get(paper.theme);
                  return `
                    <button
                      class="timeline-event ${paper.id === ui.timelinePaper ? "is-active" : ""}"
                      type="button"
                      data-timeline-paper="${escapeAttr(paper.id)}"
                      style="--event-color:${theme.color}"
                      aria-pressed="${paper.id === ui.timelinePaper}"
                    >
                      <span class="event-year">${paper.year}</span>
                      <span class="event-title">${escapeHtml(paper.titleZh)}</span>
                      <span class="event-theme">${escapeHtml(theme.short)}</span>
                      <span class="event-arrow" aria-hidden="true">→</span>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </section>
        `;
      })
      .join("");

    const selected = allPapers().find((paper) => paper.id === ui.timelinePaper);
    if (selected) renderTimelineDetail(selected);
  }

  function renderTimelineDetail(paper) {
    const theme = themeById.get(paper.theme);
    const doi = doiUrl(paper.doi);
    $("#timeline-detail").innerHTML = `
      <div class="timeline-detail-year">
        <span>${paper.year} / ${escapeHtml(theme.code)}</span>
        <span>${escapeHtml(kindLabel(paper.kind))}</span>
      </div>
      <h2>${escapeHtml(paper.titleZh)}</h2>
      <p class="paper-original-title">${escapeHtml(paper.title)}</p>
      <p class="paper-summary">${escapeHtml(paper.summary)}</p>
      <div class="timeline-detail-footer">
        <button class="button button-secondary" type="button" data-paper-id="${escapeAttr(paper.id)}">打开卡片</button>
        ${
          doi
            ? `<a class="button button-secondary" href="${escapeAttr(doi)}" target="_blank" rel="noopener noreferrer">查看原文 ↗</a>`
            : ""
        }
      </div>
    `;
  }

  function renderLibrary() {
    const papers = getFilteredPapers();
    const total = allPapers().length;
    $("#library-result-count").textContent = papers.length;
    $("#library-result-count").parentElement.setAttribute(
      "aria-label",
      `找到 ${papers.length} 篇，共 ${total} 篇`,
    );

    $("#theme-filter-row").innerHTML = [
      `<button class="theme-chip ${ui.libraryTheme === "all" ? "is-active" : ""}" type="button" data-library-theme="all" aria-pressed="${ui.libraryTheme === "all"}">全部主题 <span>${total}</span></button>`,
      ...themes.map((theme) => {
        const count = allPapers().filter((paper) => paper.theme === theme.id).length;
        return `<button class="theme-chip ${ui.libraryTheme === theme.id ? "is-active" : ""}" type="button" data-library-theme="${escapeAttr(theme.id)}" style="--chip-color:${theme.color}" aria-pressed="${ui.libraryTheme === theme.id}">${escapeHtml(theme.name)} <span>${count}</span></button>`;
      }),
    ].join("");

    const focusFilter = $("#focus-filter");
    if (ui.focusIds?.length) {
      focusFilter.hidden = false;
      $("#focus-filter-copy").textContent = `正在查看：${ui.focusLabel || "所选证据"}`;
    } else {
      focusFilter.hidden = true;
    }

    $("#library-empty").hidden = papers.length !== 0;
    $("#paper-grid").hidden = papers.length === 0;
    $("#paper-grid").innerHTML = papers.map(renderPaperCard).join("");
  }

  function getFilteredPapers() {
    const search = q(ui.libraryQuery);
    const focusSet = ui.focusIds ? new Set(ui.focusIds) : null;
    const filtered = allPapers().filter((paper) => {
      const reading = readingFor(paper.id);
      if (focusSet && !focusSet.has(paper.id)) return false;
      if (ui.libraryTheme !== "all" && paper.theme !== ui.libraryTheme) return false;
      if (ui.libraryKind !== "all" && paper.kind !== ui.libraryKind) return false;
      if (ui.librarySignal !== "all" && paper.signal !== ui.librarySignal) return false;
      if (ui.libraryFavorites && !reading.favorite) return false;
      if (!search) return true;
      const haystack = q(
        [
          paper.title,
          paper.titleZh,
          paper.authors,
          paper.venue,
          paper.doi,
          paper.signal,
          paper.summary,
          paper.why,
          ...(paper.tags || []),
        ].join(" "),
      );
      return haystack.includes(search);
    });

    if (ui.librarySort === "oldest") {
      return filtered.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
    }
    if (ui.librarySort === "impact") {
      return filtered.sort(
        (a, b) => b.impact - a.impact || b.year - a.year || a.title.localeCompare(b.title),
      );
    }
    return filtered.sort(
      (a, b) => b.year - a.year || b.impact - a.impact || a.title.localeCompare(b.title),
    );
  }

  function renderPaperCard(paper) {
    const theme = themeById.get(paper.theme);
    const reading = readingFor(paper.id);
    const status = reading.favorite
      ? "已收藏"
      : {
          want: "待读",
          reading: "在读",
          done: "已读",
          unread: kindLabel(paper.kind),
        }[reading.status];
    return `
      <article class="paper-card" data-paper-id="${escapeAttr(paper.id)}" style="--card-color:${theme.color}">
        <div class="paper-card-top">
          <div class="paper-meta-line">
            <span>${paper.year}</span>
            <span aria-hidden="true">/</span>
            <span>${escapeHtml(signalLabel(paper.signal, true))}</span>
            <span aria-hidden="true">/</span>
            <span class="theme-dot-label">${escapeHtml(theme.short)}</span>
          </div>
          <span class="paper-status ${reading.favorite ? "is-favorite" : ""}">${escapeHtml(status)}</span>
        </div>
        <h3><button class="paper-open-button" type="button" data-paper-id="${escapeAttr(paper.id)}">${escapeHtml(paper.titleZh)}</button></h3>
        <p class="paper-card-original">${escapeHtml(paper.title)}</p>
        <p class="paper-card-summary">${escapeHtml(paper.summary)}</p>
        <div class="paper-card-tags">
          ${(paper.tags || [])
            .slice(0, 4)
            .map((tag) => `<span>${escapeHtml(tag)}</span>`)
            .join("")}
        </div>
        <div class="paper-card-footer">
          <span>${escapeHtml(paper.authors)} · ${escapeHtml(paper.venue)}</span>
          <button class="text-button" type="button" data-paper-id="${escapeAttr(paper.id)}">打开卡片 ↗</button>
        </div>
      </article>
    `;
  }

  function renderGaps() {
    const filtered = gaps.filter(
      (gap) => ui.gapCategory === "all" || gap.category === ui.gapCategory,
    );
    if (!filtered.some((gap) => gap.id === ui.gapId)) {
      ui.gapId = filtered[0]?.id || null;
    }
    const categoryColors = {
      method: "#c15b43",
      clinical: "#347366",
      governance: "#6f6689",
    };

    $("#gap-dots").innerHTML = filtered
      .map((gap, index) => {
        const active = gap.id === ui.gapId;
        return `
          <button
            class="gap-dot ${active ? "is-active" : ""}"
            type="button"
            data-gap-id="${escapeAttr(gap.id)}"
            style="--gap-x:${Number(gap.x)};--gap-y:${Number(gap.y)};--dot-color:${categoryColors[gap.category] || "#0c5b53"}"
            aria-pressed="${active}"
            aria-label="${escapeAttr(gap.title)}"
          >${String(index + 1).padStart(2, "0")}</button>
        `;
      })
      .join("");

    $("#gap-list").innerHTML = filtered
      .map((gap) => {
        const tracked = Boolean(personal.trackedGaps[gap.id]);
        return `
          <article class="gap-card ${gap.id === ui.gapId ? "is-active" : ""}" data-gap-id="${escapeAttr(gap.id)}">
            <div class="gap-card-top">
              <span>${escapeHtml(gap.categoryLabel)} / ${escapeHtml(gap.maturity)}</span>
              <span>${gap.evidence.length} PAPERS</span>
            </div>
            <h3><button class="paper-open-button" type="button" data-gap-id="${escapeAttr(gap.id)}">${escapeHtml(gap.title)}</button></h3>
            <p>${escapeHtml(gap.thesis)}</p>
            <div class="gap-card-footer">
              <span class="${tracked ? "is-tracked" : ""}">${tracked ? "● 已追踪" : "○ 未追踪"}</span>
              <button class="text-button" type="button" data-gap-id="${escapeAttr(gap.id)}">查看切入点 →</button>
            </div>
          </article>
        `;
      })
      .join("");

    const trackedCount = Object.values(personal.trackedGaps).filter(Boolean).length;
    $("#tracked-gap-count").textContent = trackedCount;
    renderGapDetail(gaps.find((gap) => gap.id === ui.gapId));
  }

  function renderGapDetail(gap) {
    if (!gap) {
      $("#gap-detail").innerHTML = `<p>当前分类没有研究空白。</p>`;
      return;
    }
    const tracked = Boolean(personal.trackedGaps[gap.id]);
    const papers = gap.evidence
      .map((id) => allPapers().find((paper) => paper.id === id))
      .filter(Boolean);
    $("#gap-detail").innerHTML = `
      <div class="gap-detail-kicker">
        <span>${escapeHtml(gap.categoryLabel)} / OPEN QUESTION</span>
        <span class="maturity-pill">${escapeHtml(gap.maturity)}</span>
      </div>
      <h2>${escapeHtml(gap.title)}</h2>
      <p class="gap-thesis">${escapeHtml(gap.thesis)}</p>
      <div class="gap-why"><strong>为什么仍是空白</strong><br>${escapeHtml(gap.why)}</div>
      <div class="gap-evidence">
        <span class="detail-label">入口证据 · 点击查看卡片</span>
        <div class="evidence-chips">
          ${papers
            .map(
              (paper) => `
                <button class="evidence-chip" type="button" data-paper-id="${escapeAttr(paper.id)}">
                  ${paper.year} · ${escapeHtml(paper.authors.split(",")[0])}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
      <div class="gap-detail-actions">
        <button class="button ${tracked ? "button-secondary" : "button-primary"}" type="button" data-track-gap="${escapeAttr(gap.id)}">
          ${tracked ? "移出个人追踪" : "加入个人追踪"}
        </button>
        <button class="button button-secondary" type="button" data-focus-gap="${escapeAttr(gap.id)}">只看证据文献</button>
      </div>
    `;
  }

  function openPaper(paperId) {
    const paper = allPapers().find((item) => item.id === paperId);
    if (!paper) return;
    const theme = themeById.get(paper.theme);
    const reading = readingFor(paper.id);
    const note = personal.notes[paper.id] || "";
    const doi = doiUrl(paper.doi);
    $("#paper-detail-content").innerHTML = `
      <div class="paper-detail-hero" style="--detail-color:${theme.color}">
        <button class="modal-close" type="button" data-close-dialog aria-label="关闭">×</button>
        <p class="eyebrow">${escapeHtml(theme.code)} / ${paper.year} / ${escapeHtml(kindLabel(paper.kind))}</p>
        <h2 id="paper-detail-title">${escapeHtml(paper.titleZh)}</h2>
        <p class="paper-detail-original">${escapeHtml(paper.title)}</p>
        <div class="paper-detail-byline">
          <span>${escapeHtml(paper.authors)}</span>
          <span>${escapeHtml(paper.venue)}</span>
          <span>${escapeHtml(signalLabel(paper.signal))}</span>
        </div>
      </div>
      <div class="paper-detail-body">
        <div class="paper-detail-main">
          <section>
            <h3>研究贡献</h3>
            <p>${escapeHtml(paper.summary)}</p>
          </section>
          <section>
            <h3>为什么值得进入地图</h3>
            <p>${escapeHtml(paper.why)}</p>
          </section>
          <section>
            <h3>关键边界</h3>
            <p>${escapeHtml(paper.limitation)}</p>
          </section>
        </div>
        <aside class="paper-detail-side">
          <h3>阅读记录</h3>
          <div class="reading-controls" aria-label="阅读状态">
            ${[
              ["unread", "未开始"],
              ["want", "待读"],
              ["reading", "在读"],
              ["done", "已读"],
            ]
              .map(
                ([status, label]) => `
                  <button class="${reading.status === status ? "is-active" : ""}" type="button" data-reading-status="${status}" data-reading-paper="${escapeAttr(paper.id)}" aria-pressed="${reading.status === status}">${label}</button>
                `,
              )
              .join("")}
          </div>
          <button class="button ${reading.favorite ? "button-primary" : "button-secondary"}" type="button" data-favorite-paper="${escapeAttr(paper.id)}">${reading.favorite ? "已收藏" : "加入收藏"}</button>
          <ul class="detail-facts">
            <li><span>主题</span><span>${escapeHtml(theme.name)}</span></li>
            <li><span>信号</span><span>${escapeHtml(signalLabel(paper.signal))}</span></li>
            <li><span>DOI</span><span>${paper.doi ? escapeHtml(paper.doi) : "未录入"}</span></li>
            <li><span>来源</span><span>${paper.userAdded ? "个人新增" : "种子文献"}</span></li>
          </ul>
          <label class="note-label" for="paper-note">我的批注</label>
          <textarea class="note-area" id="paper-note" data-note-paper="${escapeAttr(paper.id)}" placeholder="记录方法、可复现性、与你研究问题的连接…">${escapeHtml(note)}</textarea>
        </aside>
      </div>
      <div class="paper-detail-actions">
        ${
          doi
            ? `<a class="button button-primary" href="${escapeAttr(doi)}" target="_blank" rel="noopener noreferrer">打开 DOI ↗</a>`
            : ""
        }
        <button class="button button-secondary" type="button" data-close-dialog>关闭</button>
        ${paper.userAdded ? `<button class="text-button danger-button" type="button" data-delete-paper="${escapeAttr(paper.id)}">删除这条个人文献</button>` : ""}
      </div>
    `;
    const dialog = $("#paper-detail-dialog");
    dialog.showModal();
  }

  function handleReadingStatus(paperId, status) {
    updateReading(paperId, { status });
    openPaper(paperId);
  }

  function toggleFavorite(paperId) {
    const reading = readingFor(paperId);
    updateReading(paperId, { favorite: !reading.favorite });
    openPaper(paperId);
  }

  function openTheme(themeId) {
    if (!themeById.has(themeId)) return;
    ui.libraryTheme = themeId;
    ui.focusIds = null;
    ui.focusLabel = "";
    clearLibraryFilters(false);
    ui.libraryTheme = themeId;
    renderLibrary();
    setView("library");
  }

  function clearLibraryFilters(shouldRender = true) {
    ui.libraryKind = "all";
    ui.librarySignal = "all";
    ui.librarySort = "newest";
    ui.libraryFavorites = false;
    ui.libraryQuery = "";
    ui.focusIds = null;
    ui.focusLabel = "";
    const search = $("#library-search");
    if (search) search.value = "";
    $("#library-kind") && ($("#library-kind").value = "all");
    $("#library-signal") && ($("#library-signal").value = "all");
    $("#library-sort") && ($("#library-sort").value = "newest");
    $("#library-favorites") && ($("#library-favorites").checked = false);
    if (shouldRender) renderLibrary();
  }

  function resetLibraryCompletely() {
    ui.libraryTheme = "all";
    clearLibraryFilters();
  }

  function toggleGap(gapId) {
    if (!gapById.has(gapId)) return;
    personal.trackedGaps[gapId] = !personal.trackedGaps[gapId];
    persist();
    renderGaps();
    renderStorageSummary();
    showToast(personal.trackedGaps[gapId] ? "已加入个人研究议题" : "已移出个人追踪");
  }

  function focusGapEvidence(gapId) {
    const gap = gapById.get(gapId);
    if (!gap) return;
    ui.focusIds = [...gap.evidence];
    ui.focusLabel = gap.title;
    ui.libraryTheme = "all";
    ui.libraryKind = "all";
    ui.librarySignal = "all";
    ui.libraryFavorites = false;
    ui.libraryQuery = "";
    const search = $("#library-search");
    if (search) search.value = "";
    renderLibrary();
    setView("library");
  }

  function handleAddPaper(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const error = $("#add-paper-error");
    error.hidden = true;

    const title = String(data.get("title") || "").trim();
    const year = Number(data.get("year"));
    const theme = String(data.get("theme") || "");
    const doi = String(data.get("doi") || "")
      .trim()
      .replace(/^https?:\/\/doi\.org\//i, "");

    if (!title || !Number.isFinite(year) || year < 1900 || year > 2100) {
      error.textContent = "请至少填写题名和有效年份。";
      error.hidden = false;
      return;
    }
    if (!themeById.has(theme)) {
      error.textContent = "请选择一个有效的研究主题。";
      error.hidden = false;
      return;
    }

    const duplicate = allPapers().find(
      (paper) =>
        (doi && q(paper.doi) === q(doi)) ||
        q(paper.title) === q(title) ||
        q(paper.titleZh) === q(title),
    );
    if (duplicate) {
      error.textContent = `这篇文献已在地图中：${duplicate.titleZh}。可打开已有卡片添加个人批注。`;
      error.hidden = false;
      return;
    }

    const newPaper = normalizePaper({
      id: makePaperId(title, year),
      title,
      titleZh: String(data.get("titleZh") || "").trim() || title,
      authors: String(data.get("authors") || "").trim() || "作者未注明",
      year,
      venue: String(data.get("venue") || "").trim() || "来源未注明",
      doi,
      theme,
      signal: String(data.get("signal") || "Conceptual"),
      kind: String(data.get("kind") || classifyKind(year)),
      impact: 3,
      tags: String(data.get("tags") || "")
        .split(/[,，、]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
      summary:
        String(data.get("summary") || "").trim() || "个人新增文献，尚待补充一句话贡献。",
      why: String(data.get("why") || "").trim(),
      limitation: String(data.get("limitation") || "").trim(),
      userAdded: true,
      addedAt: new Date().toISOString(),
    });

    personal.addedPapers.unshift(newPaper);
    persist();
    form.reset();
    $("#add-paper-dialog").close();
    resetLibraryCompletely();
    renderAll();
    setView("library");
    showToast(`已加入：${newPaper.titleZh}`);
  }

  function renderStorageSummary() {
    $("#storage-paper-count") && ($("#storage-paper-count").textContent = personal.addedPapers.length);
    $("#storage-reading-count") &&
      ($("#storage-reading-count").textContent = Object.values(personal.reading).filter(
        (entry) => entry?.status && entry.status !== "unread",
      ).length);
    $("#storage-gap-count") &&
      ($("#storage-gap-count").textContent = Object.values(personal.trackedGaps).filter(
        Boolean,
      ).length);
  }

  function openManageDialog() {
    renderStorageSummary();
    $("#import-data-error").hidden = true;
    $("#manage-data-dialog").showModal();
  }

  function exportPersonalData() {
    const payload = {
      format: "bci-atlas-personal",
      version: 1,
      exportedAt: new Date().toISOString(),
      papers: personal.addedPapers,
      reading: personal.reading,
      notes: personal.notes,
      trackedGaps: personal.trackedGaps,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `bci-atlas-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("个人数据已导出");
  }

  async function importPersonalData(file) {
    const error = $("#import-data-error");
    error.hidden = true;
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const incomingPapers = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.papers)
          ? parsed.papers
          : Array.isArray(parsed.addedPapers)
            ? parsed.addedPapers
            : [];
      if (
        !incomingPapers.length &&
        !parsed.reading &&
        !parsed.notes &&
        !parsed.trackedGaps
      ) {
        throw new Error("文件中没有可识别的 BCI Atlas 数据。");
      }

      let added = 0;
      const existingKeys = new Set(
        allPapers().flatMap((paper) => [
          `doi:${q(paper.doi)}`,
          `title:${q(paper.title)}`,
          `titlezh:${q(paper.titleZh)}`,
        ]),
      );
      incomingPapers.forEach((rawPaper) => {
        const paper = normalizePaper({ ...rawPaper, userAdded: true });
        if (!paper) return;
        const keys = [
          `doi:${q(paper.doi)}`,
          `title:${q(paper.title)}`,
          `titlezh:${q(paper.titleZh)}`,
        ];
        if (keys.some((key) => key.endsWith(":") ? false : existingKeys.has(key))) {
          return;
        }
        if (!paper.id.startsWith("user-")) {
          paper.id = `user-import-${Date.now()}-${added}-${makePaperId(paper.title, paper.year)}`;
        }
        personal.addedPapers.push(paper);
        keys.forEach((key) => !key.endsWith(":") && existingKeys.add(key));
        added += 1;
      });

      if (parsed.reading && typeof parsed.reading === "object") {
        Object.assign(personal.reading, parsed.reading);
      }
      if (parsed.notes && typeof parsed.notes === "object") {
        Object.assign(personal.notes, parsed.notes);
      }
      if (parsed.trackedGaps && typeof parsed.trackedGaps === "object") {
        Object.assign(personal.trackedGaps, parsed.trackedGaps);
      }
      persist();
      renderAll();
      showToast(
        added
          ? `已导入 ${added} 篇文献及个人记录`
          : "已导入个人记录，没有重复新增文献",
      );
      $("#import-data-input").value = "";
    } catch (caught) {
      error.textContent = `导入失败：${caught.message || "JSON 格式无法识别。"}`;
      error.hidden = false;
    }
  }

  function deletePersonalPaper(paperId) {
    const paper = personal.addedPapers.find((item) => item.id === paperId);
    if (!paper) return;
    if (!window.confirm(`确定删除个人新增文献“${paper.titleZh || paper.title}”吗？`)) {
      return;
    }
    personal.addedPapers = personal.addedPapers.filter((item) => item.id !== paperId);
    delete personal.reading[paperId];
    delete personal.notes[paperId];
    persist();
    $("#paper-detail-dialog").close();
    renderAll();
    showToast("已删除个人文献");
  }

  function handleGlobalClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const nav = target.closest("[data-nav]");
    if (nav) {
      event.preventDefault();
      setView(nav.dataset.nav);
      return;
    }

    const addTrigger = target.closest(".add-paper-trigger");
    if (addTrigger) {
      $("#add-paper-dialog").showModal();
      window.setTimeout(() => $("#add-paper-form [name='title']")?.focus(), 80);
      return;
    }

    const manageTrigger = target.closest(
      ".manage-data-trigger, [data-manage], .footer-manage",
    );
    if (manageTrigger) {
      openManageDialog();
      return;
    }

    const searchTrigger = target.closest(".search-trigger");
    if (searchTrigger) {
      setView("library", { focusSearch: true });
      return;
    }

    const installTrigger = target.closest(".install-trigger");
    if (installTrigger) {
      openIpadGuide();
      return;
    }

    const closeTrigger = target.closest("[data-close-dialog]");
    if (closeTrigger) {
      closeTrigger.closest("dialog")?.close();
      return;
    }

    const themeTrigger = target.closest(".theme-trigger");
    if (themeTrigger) {
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      return;
    }

    const stageButton = target.closest("[data-stage]");
    if (stageButton) {
      setSignalStage(stageButton.dataset.stage);
      return;
    }

    const jumpTheme = target.closest("[data-jump-theme]");
    if (jumpTheme) {
      openTheme(jumpTheme.dataset.jumpTheme);
      return;
    }

    const mapNode = target.closest("[data-theme-id]");
    if (mapNode) {
      ui.mapTheme = mapNode.dataset.themeId;
      renderMap();
      return;
    }

    const mapEra = target.closest("#map-era-filter [data-era]");
    if (mapEra) {
      ui.mapEra = mapEra.dataset.era;
      $$("#map-era-filter [data-era]").forEach((button) =>
        button.classList.toggle("is-active", button === mapEra),
      );
      renderMap();
      return;
    }

    const openThemeTrigger = target.closest("[data-open-theme]");
    if (openThemeTrigger) {
      openTheme(openThemeTrigger.dataset.openTheme);
      return;
    }

    const timelineButton = target.closest("[data-timeline-paper]");
    if (timelineButton) {
      ui.timelinePaper = timelineButton.dataset.timelinePaper;
      renderTimeline();
      return;
    }

    const libraryTheme = target.closest("[data-library-theme]");
    if (libraryTheme) {
      ui.libraryTheme = libraryTheme.dataset.libraryTheme;
      ui.focusIds = null;
      ui.focusLabel = "";
      renderLibrary();
      return;
    }

    const clearFilters = target.closest("#clear-library-filters");
    if (clearFilters) {
      resetLibraryCompletely();
      return;
    }

    const clearFocus = target.closest("#clear-focus-filter");
    if (clearFocus) {
      ui.focusIds = null;
      ui.focusLabel = "";
      renderLibrary();
      return;
    }

    const gapCategory = target.closest("#gap-category-filter [data-category]");
    if (gapCategory) {
      ui.gapCategory = gapCategory.dataset.category;
      $$("#gap-category-filter [data-category]").forEach((button) =>
        button.classList.toggle("is-active", button === gapCategory),
      );
      renderGaps();
      return;
    }

    const gapButton = target.closest("[data-gap-id]");
    if (gapButton) {
      ui.gapId = gapButton.dataset.gapId;
      renderGaps();
      return;
    }

    const trackGapButton = target.closest("[data-track-gap]");
    if (trackGapButton) {
      toggleGap(trackGapButton.dataset.trackGap);
      return;
    }

    const focusGapButton = target.closest("[data-focus-gap]");
    if (focusGapButton) {
      focusGapEvidence(focusGapButton.dataset.focusGap);
      return;
    }

    const readingButton = target.closest("[data-reading-status]");
    if (readingButton) {
      handleReadingStatus(
        readingButton.dataset.readingPaper,
        readingButton.dataset.readingStatus,
      );
      return;
    }

    const favoriteButton = target.closest("[data-favorite-paper]");
    if (favoriteButton) {
      toggleFavorite(favoriteButton.dataset.favoritePaper);
      return;
    }

    const deleteButton = target.closest("[data-delete-paper]");
    if (deleteButton) {
      deletePersonalPaper(deleteButton.dataset.deletePaper);
      return;
    }

    const paperTrigger = target.closest("[data-paper-id]");
    if (paperTrigger) {
      openPaper(paperTrigger.dataset.paperId);
      return;
    }

    if (target instanceof HTMLDialogElement && target.open) {
      target.close();
    }
  }

  function bindEvents() {
    document.addEventListener("click", handleGlobalClick);
    $("#add-paper-form").addEventListener("submit", handleAddPaper);

    $("#library-search").addEventListener("input", (event) => {
      ui.libraryQuery = event.target.value;
      renderLibrary();
    });
    $("#library-kind").addEventListener("change", (event) => {
      ui.libraryKind = event.target.value;
      renderLibrary();
    });
    $("#library-signal").addEventListener("change", (event) => {
      ui.librarySignal = event.target.value;
      renderLibrary();
    });
    $("#library-sort").addEventListener("change", (event) => {
      ui.librarySort = event.target.value;
      renderLibrary();
    });
    $("#library-favorites").addEventListener("change", (event) => {
      ui.libraryFavorites = event.target.checked;
      renderLibrary();
    });
    $("#timeline-kind").addEventListener("change", (event) => {
      ui.timelineKind = event.target.value;
      renderTimeline();
    });
    $("#timeline-theme").addEventListener("change", (event) => {
      ui.timelineTheme = event.target.value;
      renderTimeline();
    });

    document.addEventListener("input", (event) => {
      const note = event.target.closest?.("[data-note-paper]");
      if (!note) return;
      const paperId = note.dataset.notePaper;
      window.clearTimeout(noteSaveTimer);
      noteSaveTimer = window.setTimeout(() => {
        if (note.value.trim()) personal.notes[paperId] = note.value.trim();
        else delete personal.notes[paperId];
        persist();
      }, 350);
    });

    $("#export-data").addEventListener("click", exportPersonalData);
    $("#import-data-input").addEventListener("change", (event) => {
      importPersonalData(event.target.files?.[0]);
    });

    $$("dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });

    window.addEventListener("popstate", () => {
      const view = location.hash.replace("#", "") || "overview";
      setView(view, { updateHash: false });
    });

    document.addEventListener("keydown", (event) => {
      const typing =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        event.target?.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        setView("library", { focusSearch: true });
      }
    });
  }

  function initialize() {
    initializeTheme();
    initializePlatform();
    populateStaticSelects();
    bindEvents();
    setSignalStage(ui.signalStage);
    const initialView = location.hash.replace("#", "") || "overview";
    setView(initialView, { updateHash: false, scroll: false });
    renderAll();
    registerOfflineShell();
  }

  initialize();
})();
