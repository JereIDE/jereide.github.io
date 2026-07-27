const releasesList = document.getElementById("releases-list");
const jumpTo = document.getElementById("jump-to");
const navbar = document.querySelector(".navbar");

// --- Navbar scroll behavior (same as home page) ---
window.addEventListener(
  "scroll",
  () => {
    const threshold = 250;
    if (window.scrollY > threshold) {
      if (!navbar.classList.contains("navbar-fixed")) {
        navbar.classList.add("navbar-fixed");
        document.body.style.paddingTop = navbar.offsetHeight + "px";
      }
    } else {
      if (navbar.classList.contains("navbar-fixed")) {
        navbar.classList.remove("navbar-fixed");
        document.body.style.paddingTop = "";
      }
    }
  },
  { passive: true },
);

// --- Helpers ---

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function convertAlerts(html) {
  if (!html) return html;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const blockquotes = wrapper.querySelectorAll("blockquote");
  for (const bq of blockquotes) {
    const firstP = bq.querySelector("p");
    if (!firstP) continue;
    const text = firstP.textContent || "";
    const match = text.match(/^\[!(\w+)\]/);
    if (!match) continue;

    const type = match[1];
    // Remove the [!TYPE] prefix from the first paragraph
    firstP.textContent = text.replace(/^\[!\w+\]\s*/, "");
    // If the first paragraph is now empty, remove it
    if (!firstP.textContent.trim()) {
      firstP.remove();
    }

    const alert = document.createElement("div");
    alert.className = `markdown-alert markdown-alert-${type.toLowerCase()}`;

    const title = document.createElement("p");
    title.className = "markdown-alert-title";
    title.textContent = type;
    alert.appendChild(title);

    // Move all remaining children from blockquote to alert
    while (bq.firstChild) {
      alert.appendChild(bq.firstChild);
    }
    bq.replaceWith(alert);
  }
  return wrapper.innerHTML;
}

function labelAsset(name) {
  // Try to make a readable label from the filename, preserving important details
  let label = name;
  // Remove common extensions
  label = label.replace(/\.(dmg|msi|zip|tar\.\w+|AppImage|exe)$/i, "");
  // Replace hyphens with spaces (keep underscores — they're meaningful like x86_64)
  label = label.replace(/-/g, " ").replace(/\s+/g, " ").trim();

  // Shorten version strings for readability but keep arch info
  label = label
    .replace(/^jereide\s*/i, "")
    .replace(/\bv?\d+\.\d+\.\d+[^\s]*\s*/i, "")
    .trim();

  if (!label) return name;
  return label;
}

function buildAssetOptions(assets) {
  if (!assets || assets.length === 0) return { options: [], defaultUrl: null };

  let options = assets.map((a) => ({
    label: labelAsset(a.name),
    value: a.browser_download_url,
  }));

  // Prefer a macOS asset as default, otherwise use the first one
  const preferred = options.find(
    (o) =>
      o.label.toLowerCase().includes("mac") ||
      o.label.toLowerCase().includes("apple") ||
      o.label.toLowerCase().includes("dmg"),
  );

  return {
    options,
    defaultUrl: preferred ? preferred.value : options[0].value,
  };
}

function renderRelease(release, index) {
  const badgeHtml =
    index === 0 ? '<span class="release-badge">Latest</span>' : "";

  const { options: assetOptions, defaultUrl } = buildAssetOptions(
    release.assets,
  );
  const hasAssets = assetOptions.length > 0;

  const article = document.createElement("article");
  article.className = "release";
  article.id = release.tag_name;

  // Render markdown and convert alerts
  let bodyHtml = "";
  try {
    if (typeof marked !== "undefined" && typeof marked.parse === "function") {
      bodyHtml = marked.parse(release.body || "");
      bodyHtml = convertAlerts(bodyHtml);
    } else {
      bodyHtml = "<pre>" + escapeHtml(release.body || "") + "</pre>";
    }
  } catch {
    bodyHtml = "<pre>" + escapeHtml(release.body || "") + "</pre>";
  }

  // Build download section — construct elements safely
  const downloadEl = document.createElement("div");
  downloadEl.className = "download-group";
  if (hasAssets) {
    const select = document.createElement("select");
    select.className = "asset-select";
    assetOptions.forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === defaultUrl) o.selected = true;
      select.appendChild(o);
    });

    const btn = document.createElement("a");
    btn.className = "button-accent";
    btn.href = defaultUrl || release.html_url;
    btn.target = "_blank";
    btn.textContent = "Download";

    select.addEventListener("change", function () {
      btn.href = this.value;
    });

    downloadEl.appendChild(select);
    downloadEl.appendChild(btn);
  } else {
    const link = document.createElement("a");
    link.className = "button-accent";
    link.href = release.html_url;
    link.target = "_blank";
    link.textContent = "View on GitHub";
    downloadEl.appendChild(link);
  }

  // Build card
  const card = document.createElement("div");
  card.className = "release-card";
  if (badgeHtml) {
    const temp = document.createElement("div");
    temp.innerHTML = badgeHtml;
    while (temp.firstChild) card.appendChild(temp.firstChild);
  }

  const nameH2 = document.createElement("h2");
  nameH2.className = "release-name";
  const nameA = document.createElement("a");
  nameA.href = `#${release.tag_name}`;
  nameA.textContent = release.name || release.tag_name;
  nameH2.appendChild(nameA);
  card.appendChild(nameH2);

  const dateSpan = document.createElement("span");
  dateSpan.className = "release-date";
  dateSpan.textContent = `Released on ${formatDate(release.published_at)}`;
  card.appendChild(dateSpan);

  card.appendChild(downloadEl);

  const sidebar = document.createElement("div");
  sidebar.className = "release-sidebar";
  sidebar.appendChild(card);

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "release-body";
  bodyDiv.innerHTML = bodyHtml;

  const mainDiv = document.createElement("div");
  mainDiv.className = "release-main";
  mainDiv.appendChild(bodyDiv);

  const grid = document.createElement("div");
  grid.className = "release-grid";
  grid.appendChild(sidebar);
  grid.appendChild(mainDiv);

  article.appendChild(grid);

  return article;
}

// --- Main ---

fetch("https://api.github.com/repos/JereIDE/JereIDE/releases")
  .then((res) => res.json())
  .then((releases) => {
    if (!Array.isArray(releases) || releases.length === 0) {
      releasesList.innerHTML = '<p class="loading-text">No releases found.</p>';
      return;
    }

    releasesList.innerHTML = "";

    releases.forEach((release, index) => {
      try {
        const article = renderRelease(release, index);
        releasesList.appendChild(article);

        // Populate jump‑to dropdown
        const option = document.createElement("option");
        option.value = release.tag_name;
        option.textContent = release.name || release.tag_name;
        jumpTo.appendChild(option);
      } catch (err) {
        console.error("Failed to render release:", release.tag_name, err);
      }
    });
  })
  .catch(() => {
    releasesList.innerHTML =
      '<p class="loading-text">Failed to load releases. Please try again later.</p>';
  });

jumpTo.addEventListener("change", function () {
  if (this.value) {
    location.hash = this.value;
  }
});
